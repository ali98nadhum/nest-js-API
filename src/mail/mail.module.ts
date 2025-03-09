import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";


@Module({
    imports: [
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    transport: {
                        host: config.get<string>("SMTP_HOST"),
                        port: config.get<number>("SMTP_PORT"),
                        secure: false,
                        auth: {
                            user: config.get<string>("SMTP_USERNAME"),
                            pass: config.get<string>("SMTP_PASSWORD")
                        }
                    }
                }
            }
        })
    ]
})
export class MailModule{}