import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Appointment } from './Appointment';
import { MedicalRecord } from './MedicalRecord';

export type Gender = 'male' | 'female' | 'other';
export type BloodType = 'A' | 'B' | 'AB' | 'O' | 'unknown';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  idNumber!: string;

  @Column({ default: 'male' })
  gender!: Gender;

  @Column()
  birthDate!: Date;

  @Column({ default: 'unknown' })
  bloodType!: BloodType;

  @Column('simple-json', { default: '[]' })
  allergies!: string[];

  @Column()
  phone!: string;

  @OneToMany(() => Appointment, appointment => appointment.patient)
  appointments!: Appointment[];

  @OneToMany(() => MedicalRecord, medicalRecord => medicalRecord.patient)
  medicalRecords!: MedicalRecord[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
