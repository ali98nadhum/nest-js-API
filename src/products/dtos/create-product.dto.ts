
import {IsString , IsNumber , IsNotEmpty, Min, MinLength, MaxLength} from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    title: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0 , {message: "proce shouldn't be negative"})
    price: number;


    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(100)
    description: string;
}