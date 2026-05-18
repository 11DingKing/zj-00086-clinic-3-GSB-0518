import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Schedule } from './Schedule';
import { Appointment } from './Appointment';

export type Department = 'general' | 'internal' | 'surgery' | 'pediatrics' | 'dentistry' | 'chinese';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ default: 'general' })
  department!: Department;

  @Column()
  title!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  registrationFee!: number;

  @OneToMany(() => Schedule, schedule => schedule.doctor)
  schedules!: Schedule[];

  @OneToMany(() => Appointment, appointment => appointment.doctor)
  appointments!: Appointment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
