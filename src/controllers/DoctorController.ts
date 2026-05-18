import { Context } from 'koa';
import { AppDataSource } from '../data-source';
import { Doctor, Schedule } from '../entities';

export class DoctorController {
  private doctorRepository = AppDataSource.getRepository(Doctor);
  private scheduleRepository = AppDataSource.getRepository(Schedule);

  constructor() {
    this.getAllDoctors = this.getAllDoctors.bind(this);
    this.getDoctorById = this.getDoctorById.bind(this);
    this.createDoctor = this.createDoctor.bind(this);
    this.setSchedule = this.setSchedule.bind(this);
  }

  /**
   * @swagger
   * /api/doctors:
   *   get:
   *     summary: 获取所有医生列表
   *     tags: [医生]
   *     responses:
   *       200:
   *         description: 成功返回医生列表
   */
  async getAllDoctors(ctx: Context) {
    const doctors = await this.doctorRepository.find({ relations: ['schedules'] });
    ctx.body = doctors;
  }

  /**
   * @swagger
   * /api/doctors/{id}:
   *   get:
   *     summary: 获取单个医生信息
   *     tags: [医生]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: 成功返回医生信息
   *       404:
   *         description: 医生不存在
   */
  async getDoctorById(ctx: Context) {
    const id = parseInt(ctx.params.id);
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ['schedules']
    });
    
    if (!doctor) {
      ctx.status = 404;
      ctx.body = { message: '医生不存在' };
      return;
    }
    ctx.body = doctor;
  }

  /**
   * @swagger
   * /api/doctors:
   *   post:
   *     summary: 创建医生
   *     tags: [医生]
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
   *               department:
   *                 type: string
   *                 enum: [general, internal, surgery, pediatrics, dentistry, chinese]
   *               title:
   *                 type: string
   *               registrationFee:
   *                 type: number
   *     responses:
   *       200:
   *         description: 创建成功
   */
  async createDoctor(ctx: Context) {
    const doctorData = ctx.request.body as any;
    const doctor = this.doctorRepository.create(doctorData);
    await this.doctorRepository.save(doctor);
    ctx.body = doctor;
  }

  /**
   * @swagger
   * /api/doctors/{id}/schedule:
   *   post:
   *     summary: 设置医生排班
   *     tags: [医生]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               day:
   *                 type: string
   *                 enum: [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
   *               morning:
   *                 type: string
   *                 enum: [morning, afternoon, rest]
   *               afternoon:
   *                 type: string
   *                 enum: [morning, afternoon, rest]
   *     responses:
   *       200:
   *         description: 排班设置成功
   */
  async setSchedule(ctx: Context) {
    const doctorId = parseInt(ctx.params.id);
    const scheduleData = ctx.request.body as any;
    
    let schedule = await this.scheduleRepository.findOne({
      where: { doctorId, day: scheduleData.day }
    });

    if (schedule) {
      schedule.morning = scheduleData.morning;
      schedule.afternoon = scheduleData.afternoon;
    } else {
      schedule = this.scheduleRepository.create({
        doctorId,
        ...scheduleData
      });
    }

    await this.scheduleRepository.save(schedule);
    ctx.body = schedule;
  }
}
