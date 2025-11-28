import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Employee } from "./employee.entity";

@Entity()
export class Department {
    @PrimaryGeneratedColumn()
    departmentId: number;

    @Column()
    departmentName: string;

    @Column()
    departmentCode: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Employee, (employee) => employee.department)
    employees: Employee[];
}