import { 
  Controller , 
  Get , Post , 
  Body , Param ,
   NotFoundException, 
   Put, 
   Delete,
   ParseIntPipe,
   ValidationPipe,
   UseGuards
  } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductsService } from './products.service';
import { AuthRolesGuard } from 'src/users/guards/auth.roles.guard';
import { Roles } from 'src/users/decorators/user.role.decorator';
import { UserType } from 'src/utils/enums';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { JwtPayloadType } from 'src/utils/types';


@Controller("api/products")
export class ProductsController {
  
 

    constructor(private readonly productService: ProductsService){}

  

  // Create a new product
  @Post()
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public createNewProduct(@Body() body:CreateProductDto , @CurrentUser() payload:JwtPayloadType){
   return this.productService.createProduct(body , payload.id)
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
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public updateProduct(@Param("id" , ParseIntPipe) id: number , @Body() body:UpdateProductDto){
    return this.productService.update(id , body);
   
  }


  // Delete product
  @Delete(":id")
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public deleteProduct(@Param("id") id: number){
    return this.productService.delete(id)
  }
}
