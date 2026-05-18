import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type UserRole = 'admin' | 'doctor' | 'receptionist' | 'patient';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ default: 'patient' })
  role!: UserRole;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  doctorId?: number;

  @Column({ nullable: true })
  patientId?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
