import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type MedicineCategory = 'western' | 'chinese-herb' | 'chinese-patent';

@Entity()
export class Medicine {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  specification!: string;

  @Column()
  stockQuantity!: number;

  @Column({ default: 10 })
  alertThreshold!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice!: number;

  @Column({ default: 'western' })
  category!: MedicineCategory;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
