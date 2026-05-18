import { AppDataSource } from '../data-source';
import { Bill } from '../entities';

export class BillPaymentService {
  private billRepository = AppDataSource.getRepository(Bill);

  async payBill(billId: number): Promise<Bill> {
    const bill = await this.billRepository.findOne({ where: { id: billId } });
    if (!bill) {
      throw new Error('账单不存在');
    }
    if (bill.paymentStatus !== 'unpaid') {
      throw new Error('账单状态不正确');
    }
    bill.paymentStatus = 'paid';
    bill.paidAt = new Date();
    return this.billRepository.save(bill);
  }

  async refundBill(billId: number): Promise<Bill> {
    const bill = await this.billRepository.findOne({ where: { id: billId } });
    if (!bill) {
      throw new Error('账单不存在');
    }
    if (bill.paymentStatus !== 'paid') {
      throw new Error('账单未支付，无法退款');
    }
    bill.paymentStatus = 'refunded';
    bill.refundedAt = new Date();
    return this.billRepository.save(bill);
  }

  async getBillById(id: number): Promise<Bill | null> {
    return this.billRepository.findOne({ where: { id } });
  }
}
