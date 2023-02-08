import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtConfigService } from "src/config/jwt.config";
import { UserModule } from "src/user/user.module";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";

@Module({
    imports: [
        UserModule, 
        PassportModule, 
        JwtModule.registerAsync({
            useClass: JwtConfigService
        })
    ],
    exports: [AuthService],
    providers: [AuthService, LocalStrategy],
    controllers: []
})
export class AuthModule {};