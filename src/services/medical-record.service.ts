import { AppDataSource } from '../data-source';
import { MedicalRecord, Patient } from '../entities';

export class MedicalRecordService {
  private medicalRecordRepository = AppDataSource.getRepository(MedicalRecord);
  private patientRepository = AppDataSource.getRepository(Patient);

  async createMedicalRecord(patientId: number, visitId: number, visitSummary: string): Promise<MedicalRecord> {
    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
      relations: ['medicalRecords']
    });
    if (!patient) {
      throw new Error('患者不存在');
    }

    const lastRecord = await this.medicalRecordRepository.findOne({
      where: { patientId },
      order: { version: 'DESC' }
    });

    const newVersion = lastRecord ? lastRecord.version + 1 : 1;
    
    const visitHistory = lastRecord ? [...lastRecord.visitHistory, visitId] : [visitId];
    
    const summary = lastRecord 
      ? `${lastRecord.summary}\n\n--- 第 ${newVersion} 次就诊 ---\n${visitSummary}`
      : visitSummary;

    const medicalRecord = this.medicalRecordRepository.create({
      patientId,
      visitId,
      version: newVersion,
      summary,
      visitHistory
    });

    return this.medicalRecordRepository.save(medicalRecord);
  }

  async getPatientMedicalRecords(patientId: number): Promise<MedicalRecord[]> {
    return this.medicalRecordRepository.find({
      where: { patientId },
      order: { version: 'DESC' }
    });
  }

  async getMedicalRecordByVersion(patientId: number, version: number): Promise<MedicalRecord | null> {
    return this.medicalRecordRepository.findOne({
      where: { patientId, version }
    });
  }
}
