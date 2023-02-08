import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt";

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
    constructor(private readonly configService: ConfigService) {}
    createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
        const jwtSecret = this.configService.get<string>('jwt_secret');
        return {
            secret: jwtSecret,
            signOptions: {expiresIn: '5h'} // was 60s before
        }
    }

}