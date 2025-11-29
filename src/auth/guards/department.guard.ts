import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class DepartmentGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredDepartments = this.reflector.getAllAndOverride<string[]>('departments', [
            context.getHandler(),
            context.getClass(),
        ])

        if (!requiredDepartments) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user.departmentCode || !requiredDepartments.includes(user.departmentCode)) {
            throw new ForbiddenException('Department is not authorized');
        }
        return true
    }

}