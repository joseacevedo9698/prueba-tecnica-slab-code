import mongoose from '../../Server/database';
import {IProject, ITask} from '../Interfaces';
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;
export const TaskSchema = new mongoose.Schema<ITask>({

    project:{
        type: ObjectId,
        ref: "Project",
        required: true,
    },

    name:{
        type: String,
        required: [true, "NAME_IS_REQUIRED" ],
    },

    description:{
        type: String,
        required: [true, "DESCRIPTION_IS_REQUIRED" ],
    },

    date_init:{
        type: String,
        required: [true, "DATE_INIT_IS_REQUIRED" ],
    },
    status:{
        type: Boolean,
        required: [true, "STATUS_IS_REQUIRED" ],
        default: false
    },

});

export const TaskModel = mongoose.model<ITask>("Task", TaskSchema);
