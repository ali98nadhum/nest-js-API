import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "./review.entity";
import { Repository } from "typeorm";
import { ProductsService } from "src/products/products.service";
import { UserService } from "src/users/users.service";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { UodateReviewDto } from "./dtos/update-review.dto";
import { JwtPayloadType } from "src/utils/types";
import { UserType } from "src/utils/enums";



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


    // Get all review
    public async getAll(pageNumber: number , reviewPerPage: number){
        return this.reviewRepository.find({
            skip: reviewPerPage * (pageNumber - 1),
            take: reviewPerPage,
            order: {created_at: "DESC"}})
    }


    // Update review
    public async update(reviewId: number , userId: number , dto: UodateReviewDto){
        // get review from database
        const review = await this.getReviewById(reviewId)
        // check if the user is the owner of the review
        if(review.user.id !== userId) throw new ForbiddenException("access denied you are not allowed")

        // update review
        review.comment = dto.comment ?? review.comment;
        review.rating = dto.rating ?? review.rating;

        return this.reviewRepository.save(review)
    }


    // Delete review
    public async delete(reviewId: number , payload: JwtPayloadType){
        // get review from database
        const review = await this.getReviewById(reviewId)
        // check if the user is the owner of the review
        if(review.user.id === payload.id || payload.userType === UserType.ADMIN){
            await this.reviewRepository.remove(review)
            return {message: "Review has been deleted"}
        }

        throw new ForbiddenException("You are not allowed to delete this review");
        

    }


    private async getReviewById(id: number){
        const review = await this.reviewRepository.findOne({where: {id}})
        if(!review) throw new NotFoundException("Review not found")
        return review;
    }
}

