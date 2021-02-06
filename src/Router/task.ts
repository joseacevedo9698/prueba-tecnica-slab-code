import express from 'express';
import moment from 'moment-timezone';
import mongoose from '../Server/database';
import { validate } from "class-validator";
import { authMiddleware } from '../Middlewares';
import { ICreateTask, IProject, ITask, ProjectModel, TaskModel, TaskStructure } from '../Models';

let router = express.Router();

router.post('/', [authMiddleware], async function (req: express.Request, res: express.Response) {
    const date_now = moment().tz("America/Bogota").format('YYYY-MM-DD');
    let data = new TaskStructure(req.body);
    validate(data).then(async (errors: any) => {
        if (errors.length <= 0) {
            if (!mongoose.isValidObjectId(data.project)) {
                res.status(400).json({ error: "INCORRECT_OBJECT_ID" });
            } else {

                let project: IProject | null = await ProjectModel.findById(data.project);
                if (!project) {
                    res.status(400).json({ error: "PROJECT_NOT_FOUND" });
                } else {
                    const date_init = moment(data.date_init, 'YYYY-MM-DD');
                    if (!moment(date_init).isBetween(project?.date_init, project?.date_end, null, '[]')) {
                        res.status(400).json({ created: false, error: "INVALID_RANGE_DATE" });
                    } else {
                        let task: ICreateTask = new TaskModel(data);
                        task.save().then(() => {
                            res.status(201).json({
                                created: true,
                                task
                            })
                        }).catch((err) => {
                            console.log(err);
                            res.status(500).json({
                                created: false
                            })
                        });
                    }
                }

            }
        } else {
            res.status(400).json(...errors);
        }
    });

});

let taskRouter = router;

export { taskRouter };