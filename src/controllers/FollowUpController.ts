import { Context } from 'koa';
import { AppDataSource } from '../data-source';
import { FollowUp } from '../entities';

export class FollowUpController {
  private followUpRepository = AppDataSource.getRepository(FollowUp);

  constructor() {
    this.getAllFollowUps = this.getAllFollowUps.bind(this);
    this.getFollowUpById = this.getFollowUpById.bind(this);
    this.getFollowUpsByPatient = this.getFollowUpsByPatient.bind(this);
    this.createFollowUp = this.createFollowUp.bind(this);
    this.updateFollowUp = this.updateFollowUp.bind(this);
    this.deleteFollowUp = this.deleteFollowUp.bind(this);
  }

  /**
   * @swagger
   * /api/follow-ups:
   *   get:
   *     summary: 获取所有随访记录
   *     tags: [随访]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: 成功返回随访记录列表
   */
  async getAllFollowUps(ctx: Context) {
    const followUps = await this.followUpRepository.find({
      relations: ['patient', 'doctor', 'visit']
    });
    ctx.body = followUps;
  }

  /**
   * @swagger
   * /api/follow-ups/{id}:
   *   get:
   *     summary: 获取单个随访记录
   *     tags: [随访]
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
   *         description: 成功返回随访记录
   *       404:
   *         description: 随访记录不存在
   */
  async getFollowUpById(ctx: Context) {
    const id = parseInt(ctx.params.id);
    const followUp = await this.followUpRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor', 'visit']
    });
    
    if (!followUp) {
      ctx.status = 404;
      ctx.body = { message: '随访记录不存在' };
      return;
    }
    ctx.body = followUp;
  }

  /**
   * @swagger
   * /api/follow-ups/patient/{patientId}:
   *   get:
   *     summary: 获取指定患者的随访记录
   *     tags: [随访]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: patientId
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: 成功返回随访记录列表
   */
  async getFollowUpsByPatient(ctx: Context) {
    const patientId = parseInt(ctx.params.patientId);
    const followUps = await this.followUpRepository.find({
      where: { patientId },
      relations: ['patient', 'doctor', 'visit']
    });
    ctx.body = followUps;
  }

  /**
   * @swagger
   * /api/follow-ups:
   *   post:
   *     summary: 创建随访记录
   *     tags: [随访]
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
   *               visitId:
   *                 type: integer
   *               followUpDate:
   *                 type: string
   *                 format: date
   *               method:
   *                 type: string
   *                 enum: [phone, visit]
   *               status:
   *                 type: string
   *                 enum: [pending, completed, cancelled]
   *               notes:
   *                 type: string
   *     responses:
   *       200:
   *         description: 创建成功
   */
  async createFollowUp(ctx: Context) {
    const followUpData = ctx.request.body as any;
    const followUp = this.followUpRepository.create(followUpData);
    await this.followUpRepository.save(followUp);
    ctx.body = followUp;
  }

  /**
   * @swagger
   * /api/follow-ups/{id}:
   *   put:
   *     summary: 更新随访记录
   *     tags: [随访]
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
   *     responses:
   *       200:
   *         description: 更新成功
   *       404:
   *         description: 随访记录不存在
   */
  async updateFollowUp(ctx: Context) {
    const id = parseInt(ctx.params.id);
    const followUpData = ctx.request.body as any;
    
    const followUp = await this.followUpRepository.findOne({ where: { id } });
    if (!followUp) {
      ctx.status = 404;
      ctx.body = { message: '随访记录不存在' };
      return;
    }

    Object.assign(followUp, followUpData);
    await this.followUpRepository.save(followUp);
    ctx.body = followUp;
  }

  /**
   * @swagger
   * /api/follow-ups/{id}:
   *   delete:
   *     summary: 删除随访记录
   *     tags: [随访]
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
   *         description: 删除成功
   *       404:
   *         description: 随访记录不存在
   */
  async deleteFollowUp(ctx: Context) {
    const id = parseInt(ctx.params.id);
    
    const followUp = await this.followUpRepository.findOne({ where: { id } });
    if (!followUp) {
      ctx.status = 404;
      ctx.body = { message: '随访记录不存在' };
      return;
    }

    await this.followUpRepository.remove(followUp);
    ctx.body = { message: '删除成功' };
  }
}
