import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Department } from './Doctor';

export interface TemplateMedicine {
  medicineId: number;
  medicineName: string;
  specification: string;
  usage: string;
  dosage: string;
  days: number;
  quantity: number;
}

@Entity()
export class PrescriptionTemplate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ default: 'general' })
  department!: Department;

  @Column({ nullable: true })
  diagnosisCode?: string;

  @Column({ nullable: true })
  diagnosisName?: string;

  @Column('simple-json')
  medicines!: TemplateMedicine[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
