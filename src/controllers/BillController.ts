import { Context } from 'koa';
import { AppDataSource } from '../data-source';
import { Bill } from '../entities';
import { BillService } from '../services';

export class BillController {
  private billRepository = AppDataSource.getRepository(Bill);
  private billService = new BillService();

  constructor() {
    this.getAllBills = this.getAllBills.bind(this);
    this.getBillById = this.getBillById.bind(this);
    this.payBill = this.payBill.bind(this);
  }

  /**
   * @swagger
   * /api/bills:
   *   get:
   *     summary: 获取所有账单列表
   *     tags: [收费]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: 成功返回账单列表
   */
  async getAllBills(ctx: Context) {
    const bills = await this.billRepository.find({
      relations: ['visit', 'visit.appointment', 'visit.appointment.patient']
    });
    ctx.body = bills;
  }

  /**
   * @swagger
   * /api/bills/{id}:
   *   get:
   *     summary: 获取单个账单信息
   *     tags: [收费]
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
   *         description: 成功返回账单信息
   *       404:
   *         description: 账单不存在
   */
  async getBillById(ctx: Context) {
    const id = parseInt(ctx.params.id);
    const bill = await this.billRepository.findOne({
      where: { id },
      relations: ['visit', 'visit.appointment', 'visit.appointment.patient']
    });
    
    if (!bill) {
      ctx.status = 404;
      ctx.body = { message: '账单不存在' };
      return;
    }
    ctx.body = bill;
  }

  /**
   * @swagger
   * /api/bills/{id}/pay:
   *   post:
   *     summary: 支付账单
   *     tags: [收费]
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
   *         description: 支付成功
   */
  async payBill(ctx: Context) {
    const id = parseInt(ctx.params.id);
    try {
      const bill = await this.billService.payBill(id);
      ctx.body = bill;
    } catch (error: any) {
      ctx.status = 400;
      ctx.body = { message: error.message };
    }
  }
}
