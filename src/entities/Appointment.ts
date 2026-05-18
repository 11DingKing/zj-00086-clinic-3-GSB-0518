import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { Patient } from './Patient';
import { Doctor } from './Doctor';
import { Visit } from './Visit';

export type AppointmentStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
export type TimeSlot = 'morning' | 'afternoon';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  patientId!: number;

  @ManyToOne(() => Patient, patient => patient.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient!: Patient;

  @Column()
  doctorId!: number;

  @ManyToOne(() => Doctor, doctor => doctor.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctorId' })
  doctor!: Doctor;

  @Column()
  appointmentDate!: Date;

  @Column()
  timeSlot!: TimeSlot;

  @Column()
  sequenceNumber!: number;

  @Column({ default: 'pending' })
  status!: AppointmentStatus;

  @OneToOne(() => Visit, visit => visit.appointment)
  visit!: Visit;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
