import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { Repository } from "typeorm";
import { Product } from "./product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/users/users.service";




@Injectable()
export class ProductsService {

  
  constructor(
    @InjectRepository(Product)
    private readonly ProductsRepository: Repository<Product>,
    private readonly usersService: UserService
  ){}

    
  


      // Create a new product
        public async createProduct(dto:CreateProductDto , userId:number){
          
          const user = await this.usersService.getCurrentUser(userId);

          const newProduct = this.ProductsRepository.create({
            ...dto,
            title: dto.title.toLowerCase(),
            user
          })
          await this.ProductsRepository.save(newProduct)

          return {message: "Product created successfully" , newProduct}
      
          
        }
        // Get all products
        
          public getAll() {
          return this.ProductsRepository.find();
        }
      
      
        
          public async getOneBy(id:number) {
          const product = await this.ProductsRepository.findOne({where: {id}} )
          if(!product) throw new  NotFoundException("product not found");
          return product
        }
        
      
        // update products
        public async update(id: number,dto:UpdateProductDto){
      
          const product = await this.getOneBy(id)
          
          product.title = dto.title ?? product.title;
          product.price = dto.price ?? product.price;
          product.description = dto.description ?? product.description;

          return this.ProductsRepository.save(product)
      
        }
      
      
        // Delete product
        
        public async delete(id: number){
          const product = await this.getOneBy(id);
          await this.ProductsRepository.remove(product);
          return {message: "Product deleted"}
        }

}