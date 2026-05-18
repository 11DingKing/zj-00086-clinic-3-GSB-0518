import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Appointment } from './Appointment';
import { Prescription } from './Prescription';
import { Bill } from './Bill';

@Entity()
export class Visit {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  appointmentId!: number;

  @OneToOne(() => Appointment, appointment => appointment.visit, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'appointmentId' })
  appointment!: Appointment;

  @Column('text')
  chiefComplaint!: string;

  @Column('text')
  presentIllness!: string;

  @Column('text')
  examinationResults!: string;

  @Column()
  diagnosisCode!: string;

  @Column()
  diagnosisName!: string;

  @OneToMany(() => Prescription, prescription => prescription.visit)
  prescriptions!: Prescription[];

  @Column('text')
  medicalAdvice!: string;

  @Column('text', { nullable: true })
  followUpAdvice?: string;

  @OneToOne(() => Bill, bill => bill.visit)
  bill!: Bill;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
