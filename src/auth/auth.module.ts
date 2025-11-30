import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { BuyersModule } from "../buyers/buyers.module";
import { EmployeesModule } from "../employees/employees.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { RoleGuard } from "./guards/roles.guard";
import { DepartmentGuard } from "./guards/department.guard";


@Module({
    imports: [
        PassportModule.register({defaultStrategy: 'jwt'}),
        BuyersModule,
        EmployeesModule,
    ],
    providers: [AuthService, JwtService, RoleGuard, DepartmentGuard, JwtStrategy],
    controllers: [AuthController],
    exports: [JwtStrategy, PassportModule, RoleGuard, DepartmentGuard]
})
export class AuthModule {}