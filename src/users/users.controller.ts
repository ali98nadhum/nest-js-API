import { Body, Controller , Get, HttpCode, HttpStatus, Post ,Req , UseGuards } from "@nestjs/common";
import { UserService } from "./users.service";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { AuthGuard } from "./guards/auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import { JwtPayloadType } from "src/utils/types";


@Controller("api/users")
export class UsersController{


    constructor(private readonly userService:UserService){}

    @Post('auth/register')
    public register(@Body() Body: RegisterDto){
        return this.userService.register(Body);
    }

    @Post("auth/login")
    @HttpCode(HttpStatus.OK)
    public login(@Body() body:LoginDto){
        return this.userService.login(body);
    }

    @Get("current-user")
    @UseGuards(AuthGuard)
    public getCurrentUser(@CurrentUser() payload:JwtPayloadType){
        return this.userService.getCurrentUser(payload.id);
    }
}