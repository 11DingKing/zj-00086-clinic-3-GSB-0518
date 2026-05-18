import { Context } from 'koa';
import { AppDataSource } from '../data-source';
import { PrescriptionTemplate } from '../entities';

export class PrescriptionTemplateController {
  private templateRepository = AppDataSource.getRepository(PrescriptionTemplate);

  constructor() {
    this.getAllTemplates = this.getAllTemplates.bind(this);
    this.getTemplateById = this.getTemplateById.bind(this);
    this.createTemplate = this.createTemplate.bind(this);
    this.updateTemplate = this.updateTemplate.bind(this);
    this.deleteTemplate = this.deleteTemplate.bind(this);
  }

  /**
   * @swagger
   * /api/prescription-templates:
   *   get:
   *     summary: 获取所有处方模板
   *     tags: [处方模板]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: 成功返回处方模板列表
   */
  async getAllTemplates(ctx: Context) {
    const templates = await this.templateRepository.find();
    ctx.body = templates;
  }

  /**
   * @swagger
   * /api/prescription-templates/{id}:
   *   get:
   *     summary: 获取单个处方模板
   *     tags: [处方模板]
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
   *         description: 成功返回处方模板
   *       404:
   *         description: 模板不存在
   */
  async getTemplateById(ctx: Context) {
    const id = parseInt(ctx.params.id);
    const template = await this.templateRepository.findOne({ where: { id } });
    
    if (!template) {
      ctx.status = 404;
      ctx.body = { message: '处方模板不存在' };
      return;
    }
    ctx.body = template;
  }

  /**
   * @swagger
   * /api/prescription-templates:
   *   post:
   *     summary: 创建处方模板
   *     tags: [处方模板]
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
   *               diagnosisCode:
   *                 type: string
   *               diagnosisName:
   *                 type: string
   *               medicines:
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
   *     responses:
   *       200:
   *         description: 创建成功
   */
  async createTemplate(ctx: Context) {
    const templateData = ctx.request.body as any;
    const template = this.templateRepository.create(templateData);
    await this.templateRepository.save(template);
    ctx.body = template;
  }

  /**
   * @swagger
   * /api/prescription-templates/{id}:
   *   put:
   *     summary: 更新处方模板
   *     tags: [处方模板]
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
   *         description: 模板不存在
   */
  async updateTemplate(ctx: Context) {
    const id = parseInt(ctx.params.id);
    const templateData = ctx.request.body as any;
    
    const template = await this.templateRepository.findOne({ where: { id } });
    if (!template) {
      ctx.status = 404;
      ctx.body = { message: '处方模板不存在' };
      return;
    }

    Object.assign(template, templateData);
    await this.templateRepository.save(template);
    ctx.body = template;
  }

  /**
   * @swagger
   * /api/prescription-templates/{id}:
   *   delete:
   *     summary: 删除处方模板
   *     tags: [处方模板]
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
   *         description: 模板不存在
   */
  async deleteTemplate(ctx: Context) {
    const id = parseInt(ctx.params.id);
    
    const template = await this.templateRepository.findOne({ where: { id } });
    if (!template) {
      ctx.status = 404;
      ctx.body = { message: '处方模板不存在' };
      return;
    }

    await this.templateRepository.remove(template);
    ctx.body = { message: '删除成功' };
  }
}
