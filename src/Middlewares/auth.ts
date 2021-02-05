import express from "express";
import * as jwt from 'jsonwebtoken';
import { IUser, TokenDecode, UserModel } from "../Models";
let router = express.Router();

const routers = [
    '/user/create_user'
];

let authMiddleware = async function (req: any, res: any, next: any) {
    if (req.headers.authorization) {
        let token: string = req.headers.authorization.replace("Bearer ", "");
        try {
            const { userId } = jwt.verify(
                token,
                "" + process.env.KEY
            ) as TokenDecode;


            let user: IUser | null = await UserModel.findById(userId);
            if (user) {

                if (user.status) {
                    console.log("data");
                    
                    req.headers.user_id = userId;
                    next();
                }else{
                    res.status(400).json({ message: "DISABLED_USER" });
                }


            } else {
                res
                    .status(400)
                    .json({ message: "USER_NOT_FOUND" });
            }

        } catch (error) {
            res
                .status(400)
                .json({ message: error });
        }


    } else {
        res.status(400).json({ message: 'TOKEN_NOT_SENT' });
    }
}

const isAdmin = async function (req: express.Request, res: express.Response, next: express.NextFunction) {
    const userId = req.headers.user_id;
    let user: IUser | null = await UserModel.findById(userId);
    if (user?.is_admin) {
        next();
    } else {
        res.status(400).json({ mensaje: 'PERMISSION_DENIED' });
    }

}

export { authMiddleware, isAdmin };