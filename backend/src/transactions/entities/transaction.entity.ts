import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SpendingCategory } from '../../spending_categories/entities/spending_category.entity';

@Entity('transactions')
export class Transaction {
	@PrimaryGeneratedColumn('identity', { name: 'transaction_id' })
	transactionId: number;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user: User;

		@ManyToOne(() => SpendingCategory, { onDelete: 'SET NULL', nullable: true })
		@JoinColumn({ name: 'category_id' })
		category: SpendingCategory | null;

	@Column({ type: 'varchar', length: 255, name: 'item_purchased' })
	itemPurchased: string;

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	cost: number;

	@CreateDateColumn({ name: 'time' })
	time: Date;

	@Column({ type: 'varchar', length: 255, name: 'plaid_category', nullable: true })
	plaidCategory?: string;
}
