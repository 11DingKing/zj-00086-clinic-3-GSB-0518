import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Patient } from './Patient';
import { Visit } from './Visit';

@Entity()
export class MedicalRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  patientId!: number;

  @ManyToOne(() => Patient, patient => patient.medicalRecords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient!: Patient;

  @Column({ nullable: true })
  visitId?: number;

  @ManyToOne(() => Visit)
  @JoinColumn({ name: 'visitId' })
  visit?: Visit;

  @Column()
  version!: number;

  @Column('text')
  summary!: string;

  @Column('simple-json', { default: '[]' })
  visitHistory!: number[];

  @CreateDateColumn()
  createdAt!: Date;
}
