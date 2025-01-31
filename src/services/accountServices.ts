import { createAccountDTO } from "../dto/accountController/createAccountDto";
import { mysql, redis } from "../app";
import { generateInvitationToken, generateRefreshToken } from "../utilities/jwt";
import { nodeMailer } from "../utilities/nodemailer";
import { inviteToSignupDto } from "../dto/accountController/inviteToSignupDto";
import { loginAccountDto } from "../dto/accountController/loginAccountDto";
import { comparePassword } from "../utilities/bcrypt";

export const loginAccountService = async (data: loginAccountDto): Promise<{ status: number, rtk: string | null }> => {
    if(!data.username || !data.password)
        return { status: 401, rtk: null };

    const result = (await mysql.promise().query(`CALL login_account(?)`, [data.username]) as any)[0][0][0];
    if(result.id === 0) 
        return { status: 404, rtk: null };

    const match = await comparePassword(data.password, result.password);
    if(!match)
        return { status: 400, rtk: null };

    const rtk = generateRefreshToken(result.id, result.name, result.role, result.picture);
    if(!rtk)
        return { status: 500, rtk: null }
        
    return { status: 200, rtk: rtk };
}

export const createAccountService = async (data: createAccountDTO) => {

    try {

        await mysql.promise().query(" ", [data.username, data.password]);
        return 200;

    } catch (error) {

        console.error(error);
        return 500;
    }
}

export const inviteToSignupService = async (data: inviteToSignupDto): Promise<number> => {

    const invitationKey = generateInvitationToken(data.email, data.company, data.role);
    const url = `http://localhost:3000/invite?invitation=${invitationKey}`;

    try {

        await redis.db1.del('db2:' + data.email);
        const sent = await nodeMailer(data.email, url);

        if(!sent) 
            return 403;
        
    } catch {

        return 400;
    } 

    return 200;
}