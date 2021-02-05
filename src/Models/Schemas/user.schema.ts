import mongoose from '../../Server/database';
import {IUser} from '../Interfaces';
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;
export const UserSchema = new mongoose.Schema<IUser>({
    username:{
        type: 'string',
        required: [true,'USERNAME_IS_REQUIRED']
    },
    name:{
        type: 'string',
        required: [false,'NAME_IS_REQUIRED'],
    },

    status:{
        type: 'boolean',
        required: [false],
        default: true
    },
    is_admin:{
        type: 'boolean',
        required: [false],
        default: false
    },
    email:{
        type: 'string',
        required: [true,'EMAIL_IS_REQUIRED'],
    },
    password:{
        type:String,
        required:[true,'PASSWORD_IS_REQUIRED'],
        trim:true
    }
});

export const UserModel = mongoose.model<IUser>("User", UserSchema);