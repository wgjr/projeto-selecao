import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Payment } from '../payments/payment.entity';

@Entity()
export class Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  user_id: number;

  @Column()
  description: string;

  @Column('decimal', { precision: 15, scale: 0 })
  initial_value: number;

  @Column('decimal', { precision: 15, scale: 0 })
  remaining_value: number;

  @Column({ default: 0, type: 'decimal', precision: 15, scale: 0 })
  operations_value: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Payment, (payment) => payment.balance_id)
  payments: Payment[];
}
