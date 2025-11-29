import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Employee } from "./employee.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Department {
    @ApiProperty({ description: '부서 ID', example: 1 })
    @PrimaryGeneratedColumn()
    departmentId: number;

    @ApiProperty({ description: '부서명', example: '소싱팀' })
    @Column()
    departmentName: string;

    @ApiProperty({ description: '부서 코드', example: 'S1' })
    @Column()
    departmentCode: string;

    @ApiProperty({ description: '생성일시' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: '수정일시' })
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty({ description: '소속 직원 목록', type: () => [Employee] })
    @OneToMany(() => Employee, (employee) => employee.department)
    employees: Employee[];
}