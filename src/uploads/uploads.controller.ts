import { BadRequestException, Controller, Get, Param, Post , Res, UploadedFile , UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express , Response } from "express";
import { diskStorage } from "multer";


@Controller("api/uploads")
export class UploadsController{


    @Post()
    @UseInterceptors(FileInterceptor("file" , {
        storage: diskStorage({
            destination: "./images",
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
    public uploadFile(@UploadedFile() file: Express.Multer.File){

        if(!file) throw new BadRequestException("no file to upload")
        console.log(file);
        return {message: "Uploading file"}

    }

    @Get(":image")
    public getImage(@Param("image") image:string , @Res() res: Response){

        return res.sendFile(image , {root: "images"})

    }

}