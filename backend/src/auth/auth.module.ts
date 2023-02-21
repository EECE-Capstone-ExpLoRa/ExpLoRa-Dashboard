import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtConfigService } from "src/config/jwt.config";
import { UserModule } from "src/user/user.module";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { LocalStrategy } from "./local.strategy";

@Module({
    imports: [
        UserModule, 
        PassportModule, 
        JwtModule.registerAsync({
            useClass: JwtConfigService
        })
    ],
    exports: [
        AuthService, 
        JwtModule.registerAsync({
            useClass: JwtConfigService
        })
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {};