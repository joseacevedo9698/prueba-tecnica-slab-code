import mongoose from '../../Server/database';
import {IProject} from '../Interfaces';
export const ProjectSchema = new mongoose.Schema<IProject>({
    name:{
        type: 'string',
        required: [true,'NAME_IS_REQUIRED'],
    },

    status:{
        type: 'boolean',
        default: false
    },

    description:{
        type: 'string',
        required: [true,'DESCRIPTION_IS_REQUIRED'],
    },

    date_init:{
        type: 'string',
        required: [true,'DATE_INIT_IS_REQUIRED'],
    },

    date_end:{
        type: 'string',
        required: [true,'DATE_END_IS_REQUIRED'],
    },
});

export const ProjectModel = mongoose.model<IProject>("Project", ProjectSchema);
