import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FullUser, UserDto } from "src/user/user.dto";
import { UserService } from "src/user/user.service";
import { isMatch } from "src/utils/bcrypt";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService) {} 

    async validateUser(username: string, password: string): Promise<UserDto> {
        const user: FullUser = await this.userService.findFullUser(username); // Get the full user details (email, password, username)
        if (!user) return null; //checking if user exists
        
        const match: boolean = await isMatch(password, user.password);
        if (match) { // check if the supplied password matches the password hash
            const res: UserDto = {
                userId: user.userId,
                username: user.username,
                email: user.email
            }
            return res;
        }
        return null; // also returns null if passwords dont match
    }

    async login(user: UserDto) {
        const payload = { username: user.username, sub: user.userId, email: user.email};
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
};