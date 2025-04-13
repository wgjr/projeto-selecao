import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from 'typeorm';
import {Payment} from "../payments/payment.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @OneToMany(() => Payment, (payment) => payment.user_id)
    payments: Payment[];
}