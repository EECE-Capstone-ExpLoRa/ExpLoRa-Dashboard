import { CACHE_MANAGER, Inject, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Cache } from "cache-manager";
import { NextFunction, Request, Response } from "express";

export class BlacklistMiddleware implements NestMiddleware {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}
    
    async use(req: Request, res: Response, next: NextFunction) {
        console.log('called');
        console.log(await this.cacheManager.store.keys());
        if (req.headers.authorization) {
            const bearer = req.headers.authorization;
            const jwt = bearer.replace('Bearer ', '');
            const value = await this.cacheManager.get(jwt);
            console.log(value);
            
            if (value) {
                throw new UnauthorizedException();
            }
        }
        next();
    }
    
}