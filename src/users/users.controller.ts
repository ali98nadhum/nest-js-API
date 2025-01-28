import { 
    Body, 
    Controller ,
    Delete, 
    Get, 
    HttpCode, 
    HttpStatus, 
    Param, 
    ParseIntPipe, 
    Post ,
    Put , 
    UseGuards , 
} from "@nestjs/common";
import { UserService } from "./users.service";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { AuthGuard } from "./guards/auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import { JwtPayloadType } from "src/utils/types";
import { Roles } from "./decorators/user.role.decorator";
import { UserType } from "../utils/enums";
import { AuthRolesGuard } from "./guards/auth.roles.guard";
import { UpdateUserDto } from "./dtos/update.user.dto";



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

    @Get()
    @Roles(UserType.ADMIN)
    @UseGuards(AuthRolesGuard)
    public getAllUsers(){
        return this.userService.getAll();
    }

    @Put()
    @Roles(UserType.ADMIN , UserType.NORMAL_USER)
    @UseGuards(AuthRolesGuard)
    public updateUser(@CurrentUser() payload:JwtPayloadType , @Body() body: UpdateUserDto){
        return this.userService.update(payload.id , body);
    }

    @Delete(":id")
    @Roles(UserType.ADMIN , UserType.NORMAL_USER)
    @UseGuards(AuthRolesGuard)
    public deleteUser(@Param("id" , ParseIntPipe) id: number , @CurrentUser() payload: JwtPayloadType){
        return this.userService.delete(id , payload);
    }
}