import  mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();


mongoose.connect(""+process.env.CONNECTION,{
            useNewUrlParser: true
});
export default mongoose;