import { 
    BadRequestException,
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
    UploadedFile, 
    UseGuards, 
    UseInterceptors, 
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
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";



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





    @Post("upload-image")
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor("user-image" , {
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
    }))
    public uploadProfileImage(@UploadedFile() file: Express.Multer.File , @CurrentUser() payload: JwtPayloadType){

        if(!file) throw new BadRequestException("no image to upload")
            
         return this.userService.setProfileImage(payload.id , file.filename)
    }




    @Delete("images/remove-profile-image")
    @UseGuards(AuthGuard)
    public deleteProfileImage(@CurrentUser() payload: JwtPayloadType){
        return this.userService.deleteImage(payload.id);
    }
   
    
}