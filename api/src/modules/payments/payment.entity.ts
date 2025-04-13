import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Balance } from '../balance/balance.entity';
import { User } from '../user/user.entity';

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column('decimal')
    amount: number;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => Balance, (balance) => balance.payments)
    @JoinColumn({ name: 'balance_id' })
    balance_id: number;

    @ManyToOne(() => User, (user) => user.payments)
    user_id: number;
}
