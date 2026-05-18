import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Visit } from './Visit';
import { Medicine } from './Medicine';

@Entity()
export class Prescription {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  visitId!: number;

  @ManyToOne(() => Visit, visit => visit.prescriptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'visitId' })
  visit!: Visit;

  @Column()
  medicineId!: number;

  @ManyToOne(() => Medicine)
  @JoinColumn({ name: 'medicineId' })
  medicine!: Medicine;

  @Column()
  medicineName!: string;

  @Column()
  specification!: string;

  @Column()
  usage!: string;

  @Column()
  dosage!: string;

  @Column()
  days!: number;

  @Column()
  quantity!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice!: number;
}
