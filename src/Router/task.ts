import express from 'express';
import moment from 'moment-timezone';
import mongoose from '../Server/database';
import { validate } from "class-validator";
import { authMiddleware } from '../Middlewares';
import { ICreateTask, IProject, ITask, ProjectModel, TaskModel, TaskStructure, EditTaskStructure } from '../Models';

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

router.patch('/:task_id', [authMiddleware], async function (req: express.Request, res: express.Response) {
    const task_id = req.params.task_id;
    if (!mongoose.isValidObjectId(task_id)) {
        res.status(400).json({ error: "INCORRECT_OBJECT_ID" });
    } else {
        let data = new EditTaskStructure(req.body);
        validate(data).then(async (errors: any) => {
            if (errors.length <= 0) {
                let task: ITask | null = await TaskModel.findById(task_id);
                if (task) {
                    let project: IProject | null = await ProjectModel.findById(task.project);
                    if(data.date_init && !moment(data.date_init).isBetween(project?.date_init, project?.date_end, null, '[]')){
                            res.status(400).json({ created: false, error: "INVALID_RANGE_DATE" });
                    }else{
                        task.name = data.name ? data.name : task.name;
                        task.description = data.description ? data.description : task.description;
                        task.date_init = data.date_init ? data.date_init : task.date_init;
                        task.save().then(() => {
                            res.status(200).json({
                                update: true,
                                task
                            })
                        }).catch((err) => {
                            console.log(err);
                            res.status(500).json({
                                update: false
                            })
                        });
                    }
                   

                } else {
                    res.status(404).json({ errors: "TASK_NOT_FOUND" });

                }
            } else {
                res.status(400).json({ errors });
            }
        });

    }
});

router.delete('/:task_id', [authMiddleware], async function (req: express.Request, res: express.Response) {
    const task_id = req.params.task_id;
    if (!mongoose.isValidObjectId(task_id)) {
        res.status(400).json({ error: "INCORRECT_OBJECT_ID" });
    } else {
        let task: ITask | null = await TaskModel.findById(task_id);
        if (task) {
            task.delete().then(() => {
                res.status(200).json({
                    delete: true
                })
            }).catch((err) => {
                console.log(err);
                res.status(500).json({
                    delete: false
                })
            });
        }else{
            res.status(404).json({ errors: "TASK_NOT_FOUND" });
        }
    }
});

router.post('/complete/:task_id', [authMiddleware], async function (req: express.Request, res: express.Response) {
    const task_id = req.params.task_id;
    if (!mongoose.isValidObjectId(task_id)) {
        res.status(400).json({ error: "INCORRECT_OBJECT_ID" });
    } else {
        let task: ITask | null = await TaskModel.findById(task_id);
        if (task) {
            task.status = true;
            task.save().then(() => {
                res.status(200).json({
                    update: true,
                    task
                })
            }).catch((err) => {
                console.log(err);
                res.status(500).json({
                    update: false
                })
            });
        }else{
            res.status(404).json({ errors: "TASK_NOT_FOUND" });
        }
    }
});

let taskRouter = router;

export { taskRouter };