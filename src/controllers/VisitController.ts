import { Context } from "koa";
import { AppDataSource } from "../data-source";
import { Visit, Prescription, Medicine } from "../entities";
import {
  MedicineService,
  MedicalRecordService,
  BillCreationService,
} from "../services";

export class VisitController {
  private visitRepository = AppDataSource.getRepository(Visit);
  private prescriptionRepository = AppDataSource.getRepository(Prescription);
  private medicineService = new MedicineService();
  private medicalRecordService = new MedicalRecordService();
  private billCreationService = new BillCreationService();

  constructor() {
    this.getAllVisits = this.getAllVisits.bind(this);
    this.getVisitById = this.getVisitById.bind(this);
    this.createVisit = this.createVisit.bind(this);
  }

  /**
   * @swagger
   * /api/visits:
   *   get:
   *     summary: 获取所有就诊记录
   *     tags: [就诊]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: 成功返回就诊记录列表
   */
  async getAllVisits(ctx: Context) {
    const visits = await this.visitRepository.find({
      relations: [
        "appointment",
        "appointment.patient",
        "appointment.doctor",
        "prescriptions",
      ],
    });
    ctx.body = visits;
  }

  /**
   * @swagger
   * /api/visits/{id}:
   *   get:
   *     summary: 获取单个就诊记录
   *     tags: [就诊]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: 成功返回就诊记录
   *       404:
   *         description: 就诊记录不存在
   */
  async getVisitById(ctx: Context) {
    const id = parseInt(ctx.params.id);
    const visit = await this.visitRepository.findOne({
      where: { id },
      relations: [
        "appointment",
        "appointment.patient",
        "appointment.doctor",
        "prescriptions",
        "prescriptions.medicine",
      ],
    });

    if (!visit) {
      ctx.status = 404;
      ctx.body = { message: "就诊记录不存在" };
      return;
    }
    ctx.body = visit;
  }

  /**
   * @swagger
   * /api/visits:
   *   post:
   *     summary: 创建就诊记录
   *     tags: [就诊]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               appointmentId:
   *                 type: integer
   *               chiefComplaint:
   *                 type: string
   *               presentIllness:
   *                 type: string
   *               examinationResults:
   *                 type: string
   *               diagnosisCode:
   *                 type: string
   *               diagnosisName:
   *                 type: string
   *               medicalAdvice:
   *                 type: string
   *               followUpAdvice:
   *                 type: string
   *               prescriptions:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     medicineId:
   *                       type: integer
   *                     medicineName:
   *                       type: string
   *                     specification:
   *                       type: string
   *                     usage:
   *                       type: string
   *                     dosage:
   *                       type: string
   *                     days:
   *                       type: integer
   *                     quantity:
   *                       type: integer
   *                     unitPrice:
   *                       type: number
   *     responses:
   *       200:
   *         description: 创建成功
   */
  async createVisit(ctx: Context) {
    const visitData = ctx.request.body as any;
    const prescriptionsData = visitData.prescriptions || [];
    delete visitData.prescriptions;

    const visit = this.visitRepository.create(visitData);
    await this.visitRepository.save(visit);

    for (const prescData of prescriptionsData) {
      try {
        await this.medicineService.checkAndDeductStock(
          prescData.medicineId,
          prescData.quantity,
        );
      } catch (error: any) {
        ctx.status = 400;
        ctx.body = { message: error.message };
        return;
      }

      const prescription = this.prescriptionRepository.create({
        visitId: visit.id,
        ...prescData,
        totalPrice: prescData.unitPrice * prescData.quantity,
      });
      await this.prescriptionRepository.save(prescription);
    }

    const summary = `诊断：${visitData.diagnosisName}，主诉：${visitData.chiefComplaint}`;
    const savedVisit = await this.visitRepository.findOne({
      where: { id: visit.id },
      relations: ["appointment", "appointment.patient"],
    });
    if (savedVisit) {
      await this.medicalRecordService.createMedicalRecord(
        savedVisit.appointment.patient.id,
        visit.id,
        summary,
      );
    }

    await this.billCreationService.createBill(visit.id);

    ctx.body = await this.visitRepository.findOne({
      where: { id: visit.id },
      relations: ["prescriptions"],
    });
  }
}
