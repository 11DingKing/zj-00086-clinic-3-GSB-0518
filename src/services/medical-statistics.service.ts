import { AppDataSource } from '../data-source';
import { MedicalRecord, Patient } from '../entities';
import { Between } from 'typeorm';

export class MedicalStatisticsService {
  private medicalRecordRepository = AppDataSource.getRepository(MedicalRecord);
  private patientRepository = AppDataSource.getRepository(Patient);

  async countMedicalRecordsByPatient(patientId: number): Promise<number> {
    return this.medicalRecordRepository.count({ where: { patientId } });
  }

  async getMedicalRecordTrend(startDate: Date, endDate: Date): Promise<any[]> {
    const records = await this.medicalRecordRepository
      .createQueryBuilder('record')
      .select([
        'DATE(record.createdAt) as date',
        'COUNT(*) as count'
      ])
      .where('record.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('DATE(record.createdAt)')
      .getRawMany();

    return records;
  }

  async getPatientVisitCount(patientId: number): Promise<number> {
    const record = await this.medicalRecordRepository.findOne({
      where: { patientId },
      order: { version: 'DESC' }
    });
    return record ? record.visitHistory.length : 0;
  }
}
