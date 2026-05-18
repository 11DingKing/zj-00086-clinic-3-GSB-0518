import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Diagnosis {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  icd10Code!: string;

  @Column()
  name!: string;
}
