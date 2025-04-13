import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, OneToMany } from 'typeorm';
import { Payment } from '../payments/payment.entity';

@Entity()
export class Balance {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    user_id: number

    @Column()
    description: string;

    @Column('decimal')
    initial_value: number;

    @Column('decimal')
    remaining_value: number;

    @Column({default: 0, type: 'decimal'})
    operations_value: number;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => Payment, (payment) => payment.balance_id)
    payments: Payment[];
}
