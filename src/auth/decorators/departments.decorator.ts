import { SetMetadata } from "@nestjs/common";

export const Departments = (...departments: string[]) => SetMetadata('departments', departments)