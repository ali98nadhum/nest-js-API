import { 
  Controller , 
  Get , Post , 
  Body , Param ,
   NotFoundException, 
   Put, 
   Delete,
   ParseIntPipe,
   ValidationPipe
  } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductsService } from './products.service';


@Controller("api/products")
export class ProductsController {
  
 

    constructor(private readonly productService: ProductsService){}

  

  // Create a new product
  @Post()
  public createNewProduct(@Body() body:CreateProductDto){
   return this.productService.createProduct(body)
  }
  // Get all products
  @Get()
    public getAllProducts() {
     return this.productService.getAll()
  }


  @Get(":id")
    public getSingleProducts(@Param("id" , ParseIntPipe) id:number) {
      return this.productService.getOneBy(id)
  }
  

  // update products
  @Put(":id")
  public updateProduct(@Param("id" , ParseIntPipe) id: number , @Body() body:UpdateProductDto){
    return this.productService.update(id , body);
   
  }


  // Delete product
  @Delete(":id")
  public deleteProduct(@Param("id") id: number){
    return this.productService.delete(id)
  }
}
