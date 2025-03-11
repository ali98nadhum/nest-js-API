import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, RequestTimeoutException } from "@nestjs/common";




@Injectable()
export class MailService {


    constructor(private readonly mailerService: MailerService){}

    public async sendLoginEmail(email: string){

        // Send email to user
        try {
            const today = new Date();
            await this.mailerService.sendMail({
              to: email,
              from : `<no-rerplay@my-nest-app.com>`,
              subject: "Login",
              template: 'login',
              context: {email , today}
            })
            
          } catch (error) {
            console.log(error);
            throw new RequestTimeoutException()
            
          }
    }

}