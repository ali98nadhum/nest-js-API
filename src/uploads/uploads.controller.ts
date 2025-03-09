import { BadRequestException, Controller, Get, Param, Post , Res, UploadedFile , UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express , Response } from "express";


@Controller("api/uploads")
export class UploadsController{


    @Post()
    @UseInterceptors(FileInterceptor("file"))
    public uploadFile(@UploadedFile() file: Express.Multer.File){

        if(!file) throw new BadRequestException("no file to upload")
        return {message: "Uploading file"}

    }

    @Get(":image")
    public getImage(@Param("image") image:string , @Res() res: Response){

        return res.sendFile(image , {root: "images"})

    }

}