import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "./review.entity";
import { Repository } from "typeorm";
import { ProductsService } from "src/products/products.service";
import { UserService } from "src/users/users.service";
import { CreateReviewDto } from "./dtos/create-review.dto";



@Injectable()
export class ReviewsService {


    // Constructor
    constructor(
        @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
        private readonly productService: ProductsService,
        private readonly usersService: UserService
    ){}

       
    // Create new review
    public async createReview(productId:number , userId: number , dto:CreateReviewDto){
        const product = await this.productService.getOneBy(productId);
        const user = await this.usersService.getCurrentUser(userId);

        const review = this.reviewRepository.create({...dto , user , product})
        const result = await this.reviewRepository.save(review);

        return {
            id: result.id,
            comment: result.comment, 
            rating: result.rating,
            createdAt: result.created_at,
            userId: user.id,
            productId: product.id
        }
    }
}

