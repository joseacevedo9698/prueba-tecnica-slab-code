import express from 'express';
import { hashSync, compareSync } from 'bcrypt';
import { validate } from "class-validator";
import { CreateUser, CreateUserStructure, IUser, updatePassword, UserModel } from '../Models';
import { sendNewUserEmail } from '../Services';
import { authMiddleware, isAdmin } from '../Middlewares';
import mongoose from '../Server/database';

let router = express.Router();

const hashSalt: number = 10;

router.post('/create_user', [authMiddleware, isAdmin], async function (req: express.Request, res: express.Response) {
    let data = new CreateUserStructure(req.body);
    validate(data).then(async (errors: any) => {
        if (errors.length <= 0) {
            let email_verify: IUser | null = await UserModel.findOne({ email: data.email });
            if (!email_verify) {
                const password = data.password;
                data.password = hashSync(data.password, hashSalt);
                let user: CreateUser = new UserModel(data);
                user.save().then(() => {
                    sendNewUserEmail(user.email, user.username, password)
                    res.status(201).json({
                        created: true,
                    })
                }).catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        created: false
                    })
                });
            } else {
                res.status(400).json({
                    created: false,
                    error: "user already exists"
                });
            }

        } else {
            res.status(400).json({
                created: false,
                errors: errors
            })
        }
    });
});

router.post('/update_password', [authMiddleware], async function (req: express.Request, res: express.Response) {
    const userId = req.headers.user_id;
    const password = req.body.password;
    const new_password = req.body.new_password;

    let user: IUser | null = await UserModel.findById(userId);

    if (user) {
        if (compareSync(password, user.password)) {
            if (password !== new_password) {
                let data = new updatePassword(new_password);
                console.log(data);

                validate(data, { skipMissingProperties: true }).then((errors) => {
                    if (errors.length <= 0) {
                        if (user) {
                            user.password = data.password ? hashSync(data.password, hashSalt) : user.password;
                            user.save();
                            res.send({ status: true });
                        }
                    } else {
                        res.status(401).send({ status: false, error: errors });
                    }

                }).catch((err) => {
                    res.status(401).send({ status: false });
                })

            } else {
                res.status(401).json({
                    error: "INCORRECT_PASSWORD",
                    message: "Incorrect credentials"
                })
            }
        } else {
            res.status(401).json({
                error: "INCORRECT_PASSWORD",
                message: "Incorrect credentials"
            })
        }
    } else {
        res.status(500).json({
            error: "SYSTEM_ERROR",
            message: "system error"
        })
    }
});

router.post('/change_status_operator/:user_id', [authMiddleware, isAdmin], async function (req: express.Request, res: express.Response) {
    const user_id = req.params.user_id;
    if (!mongoose.isValidObjectId(user_id)) {
        res.status(400).json({ error: "INCORRECT_OBJECT_ID" });
    } else {
        let user: IUser | null = await UserModel.findById(user_id);
        if (user) {
            if (!user.is_admin) {
                user.status = !user.status;
                user.save().then(() => {
                    res.status(200).json({
                        update: true,
                        user
                    })
                }).catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        update: false
                    })
                });
            } else {
                res.status(400).json({ errors: "USER_IS_ADMIN" });

            }
        } else {
            res.status(404).json({ errors: "USER_NOT_FOUND" });
        }
    }
});

let userRouter = router;

export { userRouter };