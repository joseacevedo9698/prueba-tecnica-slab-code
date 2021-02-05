import express from 'express';

import * as jwt from 'jsonwebtoken';
import { compareSync } from 'bcrypt';
import { IUser, UserModel } from '../Models';

let router = express.Router();

router.post('/auth', async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    let user: IUser | null = await UserModel.findOne({ username });

    if (user) {
        if (user.status) {
            if (compareSync(password, user.password)) {
                const expiresIn = 8400;
                const payload = {
                    userId: user._id
                };
                const token = jwt.sign(payload, "" + process.env.KEY, {
                    expiresIn: expiresIn
                });
                res.status(200).json({
                    status: "authenticate",
                    token: token,
                    expiresIn: expiresIn
                });
            } else {
                res.status(401).json({
                    status: "Unauthenticated",
                    message: "Incorrect credentials"
                })
            }
        }else{
            res.status(400).json({ message: "DISABLED_USER" });
        }

    } else {
        res.status(401).json({
            status: "Unauthenticated",
            message: "Incorrect credentials"
        })
    }
})


let authRouter = router;

export { authRouter };