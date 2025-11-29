export interface JwtPayload {
    sub: string;                           // (buyerId 또는 employeeId)
    userType: 'buyer' | 'employee';      // 사용자 유형
    email: string;
    departmentCode?: string;              // Employee인 경우
    role?: string[];                      // Employee인 경우
    iat?: number;                         // issued at
    exp?: number;                         // expiration
}