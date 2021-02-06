import nodemailer from 'nodemailer';
import { formatContent } from '../Email/new_user_email';

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "1a239cf4a115a0",
      pass: "a37fa0c023c99d"
    }
});

export async function sendNewUserEmail(email: string, username:string, password: string){
    const mailOptions = {
        from: "Slab Code",
        to: email,
        subject: "New User credentials",
        html: formatContent(username, password)
    }

    transport.sendMail(mailOptions, (error,info) => {
        if(error){
            console.log(error);
            
        }else{
            console.log("email sent");
            
        }
    });
}