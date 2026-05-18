import { Context } from 'koa';
import { MedicalRecordService } from '../services';

export class MedicalRecordController {
  private medicalRecordService = new MedicalRecordService();

  constructor() {
    this.getPatientMedicalRecords = this.getPatientMedicalRecords.bind(this);
    this.getMedicalRecordByVersion = this.getMedicalRecordByVersion.bind(this);
  }

  /**
   * @swagger
   * /api/medical-records/patient/{patientId}:
   *   get:
   *     summary: 获取患者的所有病历记录
   *     tags: [病历]
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
   *         description: 成功返回病历列表
   */
  async getPatientMedicalRecords(ctx: Context) {
    const patientId = parseInt(ctx.params.patientId);
    const records = await this.medicalRecordService.getPatientMedicalRecords(patientId);
    ctx.body = records;
  }

  /**
   * @swagger
   * /api/medical-records/patient/{patientId}/version/{version}:
   *   get:
   *     summary: 获取患者指定版本的病历
   *     tags: [病历]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: patientId
   *         required: true
   *         schema:
   *           type: integer
   *       - in: path
   *         name: version
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: 成功返回病历
   *       404:
   *         description: 病历不存在
   */
  async getMedicalRecordByVersion(ctx: Context) {
    const patientId = parseInt(ctx.params.patientId);
    const version = parseInt(ctx.params.version);
    const record = await this.medicalRecordService.getMedicalRecordByVersion(patientId, version);
    
    if (!record) {
      ctx.status = 404;
      ctx.body = { message: '病历不存在' };
      return;
    }
    ctx.body = record;
  }
}
