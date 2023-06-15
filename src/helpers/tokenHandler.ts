import jwt from "jsonwebtoken";

class TokenManager{
    static async signIn(payload,secret = null){
        return jwt.sign(payload,secret ?? process.env.ACCESS_TOKEN_SECRET,{ expiresIn: payload.expiresIn ?? '10m' });
    }
    static async verify(token,secret = null){
        return jwt.verify(token, secret ?? process.env.ACCESS_TOKEN_SECRET);
    }
}
export default TokenManager