import { mysql } from "../app";
import { verifyAccessToken } from "../utilities/jwt";

export const companyServices = async (atk: string): Promise<any> => {

    const decode = verifyAccessToken(atk) as any;
    if(!decode.token)
        return { status: 401 };
    
    try {

        const [rows] = await mysql.promise().query('SELECT * FROM tbl_company_theme WHERE company = ?', [decode.payload.company]) as any;
        delete rows[0].company;

        return { status: 200, result: rows[0] };

    } catch (error) {

        console.log('MYSQL ERROR');
        console.log(error);

        return { status: 500 };
    }
}