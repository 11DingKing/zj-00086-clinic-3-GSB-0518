import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Doctor } from './Doctor';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type TimeSlot = 'morning' | 'afternoon' | 'rest';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  doctorId!: number;

  @ManyToOne(() => Doctor, doctor => doctor.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctorId' })
  doctor!: Doctor;

  @Column()
  day!: DayOfWeek;

  @Column({ default: 'rest' })
  morning!: TimeSlot;

  @Column({ default: 'rest' })
  afternoon!: TimeSlot;
}
