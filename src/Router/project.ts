import express from 'express';
import moment from 'moment-timezone';
import mongoose from '../Server/database';
import { validate } from "class-validator";
import { authMiddleware } from '../Middlewares';
import { EditProjectStructure, ICreateProject, IProject, ITask, ProjectModel, ProjectStructure, TaskModel } from '../Models';


let router = express.Router();

router.post('/', [authMiddleware], async function (req: express.Request, res: express.Response) {
    const date_now = moment().tz("America/Bogota").format('YYYY-MM-DD');
    let data = new ProjectStructure(req.body);
    validate(data).then(async (errors: any) => {
        if (errors.length <= 0) {
            const date_init = moment(data.date_init, 'YYYY-MM-DD');
            const date_end = moment(data.date_end, 'YYYY-MM-DD');
            if (moment(date_end).isAfter(date_init) && moment(date_now).isSameOrBefore(date_init)) {
                let project: ICreateProject = new ProjectModel(data);
                project.save().then(() => {
                    res.status(201).json({
                        created: true,
                        project
                    })
                }).catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        created: false
                    })
                });
            } else {
                res.status(400).json({ created: false, error: "INVALID_RANGE_DATE" });
            }
        } else {
            res.status(400).json(...errors);

        }
    });

});


router.patch('/:project_id', [authMiddleware], async function (req: express.Request, res: express.Response) {
    const project_id = req.params.project_id;
    if (!mongoose.isValidObjectId(project_id)) {
        res.status(400).json({ error: "INCORRECT_OBJECT_ID" });
    } else {
        let data = new EditProjectStructure(req.body);
        validate(data).then(async (errors: any) => {
            if (errors.length <= 0) {
                let project: IProject | null = await ProjectModel.findById(project_id);
                if (project) {

                    let tasks: number = await TaskModel.count({ project: project_id, date_init: { $gt: data.date_end } });
                    if (!moment(data.date_end).isAfter(project.date_init) || tasks >= 1) {
                        res.status(400).json({ created: false, error: "INVALID_RANGE_DATE" });
                    } else {
                        project.name = data.name ? data.name : project.name;
                        project.description = data.description ? data.description : project.description;
                        project.date_end = data.date_end ? data.date_end : project.date_end;
                        project.save().then(() => {
                            res.status(200).json({
                                update: true,
                                project
                            })
                        }).catch((err) => {
                            console.log(err);
                            res.status(500).json({
                                update: false
                            })
                        });
                    }



                } else {
                    res.status(404).json({ errors: "PROJECT_NOT_FOUND" });
                }
            } else {

            }
        });
    }
});

router.delete('/:project_id', [authMiddleware], async function (req: express.Request, res: express.Response) {
    const project_id = req.params.project_id;
    if (!mongoose.isValidObjectId(project_id)) {
        res.status(400).json({ error: "INCORRECT_OBJECT_ID" });
    } else {
        let project: IProject | null = await ProjectModel.findById(project_id);
        TaskModel.deleteMany({ project: project_id }).then(() => {
            if (project) {

                project.delete().then(() => {
                    res.status(200).json({
                        delete: true
                    })
                }).catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        delete: false
                    })
                });
            } else {
                res.status(404).json({ errors: "PROJECT_NOT_FOUND" });
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                delete: false
            })
        });

    }
});

router.post('/complete/:project_id', [authMiddleware], async function (req: express.Request, res: express.Response) {
    const project_id = req.params.project_id;
    if (!mongoose.isValidObjectId(project_id)) {
        res.status(400).json({ error: "INCORRECT_OBJECT_ID" });
    } else {
        let project: IProject | null = await ProjectModel.findById(project_id);
        if(project){
            let task_not_complete: number = await TaskModel.count({ project: project_id, status: false });
            if (task_not_complete >= 1) {
                res.status(404).json({ errors: "TASK_NOT_COMPLETE" });
            }else{
                project.status = true;
                project.save().then(() => {
                    res.status(200).json({
                        update: true,
                        project
                    })
                }).catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        update: false
                    })
                });
            }
        }else{
            res.status(404).json({ errors: "PROJECT_NOT_FOUND" });
        }

    }
});

let projectRouter = router;

export { projectRouter };