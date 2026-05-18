import { AppDataSource } from '../data-source';
import { Appointment, Visit, Prescription, Doctor, Bill } from '../entities';
import { Between } from 'typeorm';

export class StatisticsService {
  private appointmentRepository = AppDataSource.getRepository(Appointment);
  private visitRepository = AppDataSource.getRepository(Visit);
  private prescriptionRepository = AppDataSource.getRepository(Prescription);
  private doctorRepository = AppDataSource.getRepository(Doctor);
  private billRepository = AppDataSource.getRepository(Bill);

  async getDailyVisitsByDepartment(startDate: Date, endDate: Date): Promise<any[]> {
    const visits = await this.visitRepository
      .createQueryBuilder('visit')
      .leftJoin('visit.appointment', 'appointment')
      .leftJoin('appointment.doctor', 'doctor')
      .select([
        'doctor.department as department',
        'DATE(visit.createdAt) as date',
        'COUNT(*) as count'
      ])
      .where('visit.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('doctor.department, DATE(visit.createdAt)')
      .getRawMany();

    return visits;
  }

  async getDoctorWorkloadRanking(startDate: Date, endDate: Date): Promise<any[]> {
    const doctors = await this.visitRepository
      .createQueryBuilder('visit')
      .leftJoin('visit.appointment', 'appointment')
      .leftJoin('appointment.doctor', 'doctor')
      .select([
        'doctor.id as doctorId',
        'doctor.name as doctorName',
        'doctor.department as department',
        'COUNT(*) as visitCount'
      ])
      .where('visit.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('doctor.id')
      .orderBy('visitCount', 'DESC')
      .getRawMany();

    return doctors;
  }

  async getTopMedicines(startDate: Date, endDate: Date, limit: number = 10): Promise<any[]> {
    const medicines = await this.prescriptionRepository
      .createQueryBuilder('prescription')
      .leftJoin('prescription.visit', 'visit')
      .select([
        'prescription.medicineId as medicineId',
        'prescription.medicineName as medicineName',
        'SUM(prescription.quantity) as totalQuantity',
        'SUM(prescription.totalPrice) as totalAmount'
      ])
      .where('visit.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('prescription.medicineId')
      .orderBy('totalQuantity', 'DESC')
      .limit(limit)
      .getRawMany();

    return medicines;
  }

  async getMonthlyRevenue(year: number, month: number): Promise<any> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const bills = await this.billRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
        paymentStatus: 'paid'
      }
    });

    const totalRevenue = bills.reduce((sum, b) => sum + Number(b.totalAmount), 0);
    const registrationRevenue = bills.reduce((sum, b) => sum + Number(b.registrationFee), 0);
    const medicineRevenue = bills.reduce((sum, b) => sum + Number(b.medicineFee), 0);

    return {
      year,
      month,
      totalRevenue,
      registrationRevenue,
      medicineRevenue,
      billCount: bills.length
    };
  }

  async getNoShowRate(startDate: Date, endDate: Date): Promise<any> {
    const appointments = await this.appointmentRepository.find({
      where: { createdAt: Between(startDate, endDate) }
    });

    const total = appointments.length;
    const noShow = appointments.filter(a => a.status === 'no-show').length;
    const rate = total > 0 ? (noShow / total) * 100 : 0;

    return {
      totalAppointments: total,
      noShowCount: noShow,
      noShowRate: rate.toFixed(2) + '%'
    };
  }
}
