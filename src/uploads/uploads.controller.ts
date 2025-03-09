import { BadRequestException, Controller, Get, Param, Post , Res, UploadedFile , UseInterceptors , UploadedFiles } from "@nestjs/common";
import { FileInterceptor , FilesInterceptor } from "@nestjs/platform-express";
import { Express , Response } from "express";


@Controller("api/uploads")
export class UploadsController{


    @Post()
    @UseInterceptors(FileInterceptor("file"))
    public uploadFile(@UploadedFile() file: Express.Multer.File){

        if(!file) throw new BadRequestException("no file to upload")
        return {message: "Uploading file"}

    }


    @Post('multiple-fils')
    @UseInterceptors(FilesInterceptor("files"))
    public UploadMultipleFils(@UploadedFiles() files: Array <Express.Multer.File>){

        if(!files || files.length === 0) throw new BadRequestException("no file to upload")
        return {message: "Uploading files successfully"}

    }

    @Get(":image")
    public getImage(@Param("image") image:string , @Res() res: Response){

        return res.sendFile(image , {root: "images"})

    }

}