import * as bycrypt from 'bcrypt';

export async function hashPassword(plainTextPassword: string): Promise<string> {
    const saltRounds: number = 10;
    const hashedPassword = await bycrypt.hash(plainTextPassword, saltRounds);
    return hashedPassword;
}

export async function isMatch(rawPassword: string, savedPassword: string) {
    const match = await bycrypt.compare(rawPassword, savedPassword);
    return match;
}