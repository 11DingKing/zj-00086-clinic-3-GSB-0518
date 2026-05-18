import { Context } from 'koa';
import { StatisticsService } from '../services';

export class StatisticsController {
  private statisticsService = new StatisticsService();

  constructor() {
    this.getDailyVisits = this.getDailyVisits.bind(this);
    this.getDoctorWorkload = this.getDoctorWorkload.bind(this);
    this.getTopMedicines = this.getTopMedicines.bind(this);
    this.getMonthlyRevenue = this.getMonthlyRevenue.bind(this);
    this.getNoShowRate = this.getNoShowRate.bind(this);
  }

  /**
   * @swagger
   * /api/statistics/daily-visits:
   *   get:
   *     summary: 获取各科室日均就诊量
   *     tags: [统计]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: startDate
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: endDate
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *     responses:
   *       200:
   *         description: 成功返回统计数据
   */
  async getDailyVisits(ctx: Context) {
    const { startDate, endDate } = ctx.request.query as any;
    const data = await this.statisticsService.getDailyVisitsByDepartment(
      new Date(startDate as string),
      new Date(endDate as string)
    );
    ctx.body = data;
  }

  /**
   * @swagger
   * /api/statistics/doctor-workload:
   *   get:
   *     summary: 获取医生工作量排行
   *     tags: [统计]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: startDate
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: endDate
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *     responses:
   *       200:
   *         description: 成功返回统计数据
   */
  async getDoctorWorkload(ctx: Context) {
    const { startDate, endDate } = ctx.request.query as any;
    const data = await this.statisticsService.getDoctorWorkloadRanking(
      new Date(startDate as string),
      new Date(endDate as string)
    );
    ctx.body = data;
  }

  /**
   * @swagger
   * /api/statistics/top-medicines:
   *   get:
   *     summary: 获取药品消耗TOP10
   *     tags: [统计]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: startDate
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: endDate
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *     responses:
   *       200:
   *         description: 成功返回统计数据
   */
  async getTopMedicines(ctx: Context) {
    const { startDate, endDate } = ctx.request.query as any;
    const data = await this.statisticsService.getTopMedicines(
      new Date(startDate as string),
      new Date(endDate as string)
    );
    ctx.body = data;
  }

  /**
   * @swagger
   * /api/statistics/monthly-revenue:
   *   get:
   *     summary: 获取月度营收
   *     tags: [统计]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: year
   *         required: true
   *         schema:
   *           type: integer
   *       - in: query
   *         name: month
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: 成功返回统计数据
   */
  async getMonthlyRevenue(ctx: Context) {
    const { year, month } = ctx.request.query as any;
    const data = await this.statisticsService.getMonthlyRevenue(
      parseInt(year as string),
      parseInt(month as string)
    );
    ctx.body = data;
  }

  /**
   * @swagger
   * /api/statistics/no-show-rate:
   *   get:
   *     summary: 获取爽约率
   *     tags: [统计]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: startDate
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: endDate
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *     responses:
   *       200:
   *         description: 成功返回统计数据
   */
  async getNoShowRate(ctx: Context) {
    const { startDate, endDate } = ctx.request.query as any;
    const data = await this.statisticsService.getNoShowRate(
      new Date(startDate as string),
      new Date(endDate as string)
    );
    ctx.body = data;
  }
}
