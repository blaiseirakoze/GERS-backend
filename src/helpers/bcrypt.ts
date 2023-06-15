import { genSalt, hash, compare } from "bcryptjs";

export async function hashPassword(plainText: string): Promise<string> {
	const saltRounds = 10;
	const encryptSalt = await genSalt(saltRounds);
	return await hash(plainText, encryptSalt);
}

export async function validatePassword(plainPwd: string, dbPwd: string): Promise<boolean> {
	return await compare(plainPwd, dbPwd);
}
