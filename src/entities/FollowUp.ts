import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Patient } from './Patient';
import { Doctor } from './Doctor';
import { Visit } from './Visit';

export type FollowUpMethod = 'phone' | 'visit';
export type FollowUpStatus = 'pending' | 'completed' | 'cancelled';

@Entity()
export class FollowUp {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  patientId!: number;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient!: Patient;

  @Column()
  doctorId!: number;

  @ManyToOne(() => Doctor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctorId' })
  doctor!: Doctor;

  @Column({ nullable: true })
  visitId?: number;

  @ManyToOne(() => Visit, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'visitId' })
  visit?: Visit;

  @Column()
  followUpDate!: Date;

  @Column({ default: 'phone' })
  method!: FollowUpMethod;

  @Column({ default: 'pending' })
  status!: FollowUpStatus;

  @Column('text', { nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
