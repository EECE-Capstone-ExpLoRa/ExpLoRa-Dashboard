import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt";

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
    constructor(private readonly configService: ConfigService) {}
    createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
        const jwtSecret = this.configService.get<string>('jwt_secret');
        const jwtExpiration = this.configService.get<string>('expires_in');

        return {
            secret: jwtSecret,
            signOptions: {expiresIn: jwtExpiration}
        }
    }

}