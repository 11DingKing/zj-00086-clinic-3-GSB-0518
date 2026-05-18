import { AppDataSource } from '../data-source';
import { Bill, Prescription, Visit } from '../entities';

export class BillCreationService {
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
}
