import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('identity', { name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  income?: number;

  @Column({ 
    type: 'decimal', 
    precision: 12, 
    scale: 2, 
    nullable: true,
    name: 'total_budget'
  })
  totalBudget?: number;

  @Column({ 
    type: 'decimal', 
    precision: 12, 
    scale: 2, 
    nullable: true,
    name: 'current_total'
  })
  currentTotal?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
