import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Visit } from './Visit';

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

@Entity()
export class Bill {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  visitId!: number;

  @OneToOne(() => Visit, visit => visit.bill, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'visitId' })
  visit!: Visit;

  @Column('decimal', { precision: 10, scale: 2 })
  registrationFee!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  medicineFee!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  examinationFee!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({ default: 'unpaid' })
  paymentStatus!: PaymentStatus;

  @Column({ nullable: true })
  paidAt?: Date;

  @Column({ nullable: true })
  refundedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
