import { AppDataSource } from '../data-source';
import { MedicalRecord } from '../entities';

export class MedicalStatisticsService {
  private medicalRecordRepository = AppDataSource.getRepository(MedicalRecord);
}
