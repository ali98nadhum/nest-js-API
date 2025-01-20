
import {IsString , IsNumber , IsNotEmpty, Min, MinLength, MaxLength, IsOptional} from "class-validator";



export class UpdateProductDto {
        @IsString()
        @IsNotEmpty()
        @MinLength(2)
        @MaxLength(100)
        @IsOptional()
        title?: string;
    
        @IsNumber()
        @IsNotEmpty()
        @Min(0 , {message: "proce shouldn't be negative"})
        @IsOptional()
        price?: number;


        @IsString()
        @IsNotEmpty()
        @MinLength(10)
        @MaxLength(100)
        @IsOptional()
        description?: string;
}