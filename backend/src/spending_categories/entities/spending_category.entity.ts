import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('spending_categories')
export class SpendingCategory {
	@PrimaryGeneratedColumn('identity', { name: 'category_id' })
	categoryId: number;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user: User;

	@Column({ type: 'varchar', length: 100 })
	name: string;

	@Column({ type: 'decimal', precision: 5, scale: 2, name: 'total_budget_percent', nullable: true })
	totalBudgetPercent?: number;

	@Column({ type: 'decimal', precision: 12, scale: 2, name: 'total_budget_number', nullable: true })
	totalBudgetNumber?: number;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
