import { AppDataSource } from '../data-source';
import { Bill, Prescription, Visit, Doctor } from '../entities';

export class BillService {
  private billRepository = AppDataSource.getRepository(Bill);
  private prescriptionRepository = AppDataSource.getRepository(Prescription);
  private visitRepository = AppDataSource.getRepository(Visit);

  async calculateMedicineFee(visitId: number): Promise<number> {
    const prescriptions = await this.prescriptionRepository.find({
      where: { visitId }
    });
    return prescriptions.reduce((sum, p) => sum + Number(p.totalPrice), 0);
  }

  async createBill(visitId: number): Promise<Bill> {
    const visit = await this.visitRepository.findOne({
      where: { id: visitId },
      relations: ['appointment', 'appointment.doctor']
    });
    if (!visit) {
      throw new Error('就诊记录不存在');
    }

    const registrationFee = Number(visit.appointment.doctor.registrationFee);
    const medicineFee = await this.calculateMedicineFee(visitId);
    const totalAmount = registrationFee + medicineFee;

    const bill = this.billRepository.create({
      visitId,
      registrationFee,
      medicineFee,
      examinationFee: 0,
      totalAmount,
      paymentStatus: 'unpaid'
    });

    return this.billRepository.save(bill);
  }

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

  async getBillById(id: number): Promise<Bill | null> {
    return this.billRepository.findOne({ where: { id } });
  }
}
