import { BadRequestException, Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UserService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthProvider } from "./auth.provider";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { MailModule } from "src/mail/mail.module";


@Module({
    controllers: [UsersController],
    providers: [UserService , AuthProvider],
    exports: [UserService],
    imports: [
        MailModule,
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    global : true,
                    secret: config.get<string>("JWT_SECRET"),
                    signOptions: {expiresIn: config.get<string>("JWT_EXPIRES_IN")}
                }
            }
        }),
        MulterModule.register({
                storage: diskStorage({
                    destination: './images/users',
                    filename: (req , file , cb) => {
                        const prefix = `${Date.now()}-${Math.round(Math.random() * 1000000)}`;
                        const fileName = `${prefix}-${file.originalname}`;
                        cb(null , fileName);
                    }
                }),
                        fileFilter: (req , file , cb) => {
                            if(file.mimetype.startsWith("image")){
                                cb(null , true);
                            } else{
                                cb(new BadRequestException("this is not image") , false)
                            }
                        },
                        limits: {fileSize: 1024 * 1024 * 2}
            })
]
})


export class UsersModule{}