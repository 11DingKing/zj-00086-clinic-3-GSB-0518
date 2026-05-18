import { AppDataSource } from '../data-source';
import { MedicalRecord } from '../entities';

export class MedicalStatisticsService {
  private medicalRecordRepository = AppDataSource.getRepository(MedicalRecord);

  async getPatientRecordCount(patientId: number): Promise<number> {
    return this.medicalRecordRepository
      .createQueryBuilder('record')
      .where('record.patientId = :patientId', { patientId })
      .getCount();
  }

  async getDiagnosisDistribution(startDate: Date, endDate: Date): Promise<any[]> {
    return this.medicalRecordRepository
      .createQueryBuilder('record')
      .select([
        'record.diagnosisName as diagnosisName',
        'COUNT(*) as count'
      ])
      .where('record.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('record.diagnosisName')
      .getRawMany();
  }

  async getRecordsByVersionRange(minVersion: number, maxVersion: number): Promise<MedicalRecord[]> {
    return this.medicalRecordRepository.find({
      where: {
        version: this.medicalRecordRepository
          .createQueryBuilder('record')
          .expressions({
            version: `record.version BETWEEN ${minVersion} AND ${maxVersion}`
          }) as any
      },
      order: { version: 'ASC' }
    });
  }
}
