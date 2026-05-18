import { Context } from 'koa';
import { AppDataSource } from '../data-source';
import { Patient } from '../entities';

export class PatientController {
  private patientRepository = AppDataSource.getRepository(Patient);

  constructor() {
    this.getAllPatients = this.getAllPatients.bind(this);
    this.getPatientById = this.getPatientById.bind(this);
    this.createPatient = this.createPatient.bind(this);
  }

  /**
   * @swagger
   * /api/patients:
   *   get:
   *     summary: 获取所有患者列表
   *     tags: [患者]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: 成功返回患者列表
   */
  async getAllPatients(ctx: Context) {
    const patients = await this.patientRepository.find();
    ctx.body = patients;
  }

  /**
   * @swagger
   * /api/patients/{id}:
   *   get:
   *     summary: 获取单个患者信息
   *     tags: [患者]
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
   *         description: 成功返回患者信息
   *       404:
   *         description: 患者不存在
   */
  async getPatientById(ctx: Context) {
    const id = parseInt(ctx.params.id);
    const patient = await this.patientRepository.findOne({ where: { id } });
    
    if (!patient) {
      ctx.status = 404;
      ctx.body = { message: '患者不存在' };
      return;
    }
    ctx.body = patient;
  }

  /**
   * @swagger
   * /api/patients:
   *   post:
   *     summary: 创建患者
   *     tags: [患者]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               idNumber:
   *                 type: string
   *               gender:
   *                 type: string
   *                 enum: [male, female, other]
   *               birthDate:
   *                 type: string
   *                 format: date
   *               bloodType:
   *                 type: string
   *                 enum: [A, B, AB, O, unknown]
   *               allergies:
   *                 type: array
   *                 items:
   *                   type: string
   *               phone:
   *                 type: string
   *     responses:
   *       200:
   *         description: 创建成功
   */
  async createPatient(ctx: Context) {
    const patientData = ctx.request.body as any;
    const patient = this.patientRepository.create(patientData);
    await this.patientRepository.save(patient);
    ctx.body = patient;
  }
}
