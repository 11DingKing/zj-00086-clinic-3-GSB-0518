import { Context } from 'koa';
import { AppDataSource } from '../data-source';
import { Appointment } from '../entities';

export class AppointmentController {
  private appointmentRepository = AppDataSource.getRepository(Appointment);

  constructor() {
    this.getAllAppointments = this.getAllAppointments.bind(this);
    this.getAppointmentById = this.getAppointmentById.bind(this);
    this.createAppointment = this.createAppointment.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
  }

  /**
   * @swagger
   * /api/appointments:
   *   get:
   *     summary: 获取所有预约列表
   *     tags: [预约]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: 成功返回预约列表
   */
  async getAllAppointments(ctx: Context) {
    const appointments = await this.appointmentRepository.find({
      relations: ['patient', 'doctor']
    });
    ctx.body = appointments;
  }

  /**
   * @swagger
   * /api/appointments/{id}:
   *   get:
   *     summary: 获取单个预约信息
   *     tags: [预约]
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
   *         description: 成功返回预约信息
   *       404:
   *         description: 预约不存在
   */
  async getAppointmentById(ctx: Context) {
    const id = parseInt(ctx.params.id);
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor']
    });
    
    if (!appointment) {
      ctx.status = 404;
      ctx.body = { message: '预约不存在' };
      return;
    }
    ctx.body = appointment;
  }

  /**
   * @swagger
   * /api/appointments:
   *   post:
   *     summary: 创建预约
   *     tags: [预约]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               patientId:
   *                 type: integer
   *               doctorId:
   *                 type: integer
   *               appointmentDate:
   *                 type: string
   *                 format: date
   *               timeSlot:
   *                 type: string
   *                 enum: [morning, afternoon]
   *     responses:
   *       200:
   *         description: 创建成功
   */
  async createAppointment(ctx: Context) {
    const appointmentData = ctx.request.body as any;
    
    const existingAppointments = await this.appointmentRepository.find({
      where: {
        doctorId: appointmentData.doctorId,
        appointmentDate: appointmentData.appointmentDate,
        timeSlot: appointmentData.timeSlot
      }
    });

    appointmentData.sequenceNumber = existingAppointments.length + 1;
    appointmentData.status = 'pending';

    const appointment = this.appointmentRepository.create(appointmentData);
    await this.appointmentRepository.save(appointment);
    ctx.body = appointment;
  }

  /**
   * @swagger
   * /api/appointments/{id}/status:
   *   put:
   *     summary: 更新预约状态
   *     tags: [预约]
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
   *               status:
   *                 type: string
   *                 enum: [pending, in-progress, completed, cancelled, no-show]
   *     responses:
   *       200:
   *         description: 更新成功
   */
  async updateStatus(ctx: Context) {
    const id = parseInt(ctx.params.id);
    const { status } = ctx.request.body as any;
    
    const appointment = await this.appointmentRepository.findOne({ where: { id } });
    if (!appointment) {
      ctx.status = 404;
      ctx.body = { message: '预约不存在' };
      return;
    }

    appointment.status = status;
    await this.appointmentRepository.save(appointment);
    ctx.body = appointment;
  }
}
