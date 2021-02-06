import express from 'express';
import moment from 'moment-timezone';
import { validate } from "class-validator";
import { authMiddleware } from '../Middlewares';
import { ICreateProject, IProject, ProjectModel, ProjectStructure } from '../Models';


let router = express.Router();

router.post('/', [authMiddleware] ,async function (req: express.Request, res: express.Response) {
    const date_now = moment().tz("America/Bogota").format('YYYY-MM-DD');
    let data = new ProjectStructure(req.body);
    validate(data).then(async (errors: any) => {
        if (errors.length <= 0) {
            const date_init = moment(data.date_init,'YYYY-MM-DD');
            const date_end = moment(data.date_end,'YYYY-MM-DD');
            if(moment(date_end).isAfter(date_init) && moment(date_now).isSameOrBefore(date_init)){
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
            }else{
                res.status(400).json({created: false, error: "INVALID_RANGE_DATE"});
            }
        }else{
            res.status(400).json(...errors);

        }
    });

});


router.patch('/', [authMiddleware] ,async function (req: express.Request, res: express.Response) {
    
});

let projectRouter = router;

export { projectRouter };