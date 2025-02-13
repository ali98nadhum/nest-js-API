import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UserService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthProvider } from "./auth.provider";


@Module({
    controllers: [UsersController],
    providers: [UserService , AuthProvider],
    exports: [UserService],
    imports: [
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
        })
]
})
export class UsersModule{}