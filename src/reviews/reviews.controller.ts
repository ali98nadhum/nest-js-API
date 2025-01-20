import { Controller , Get } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";


@Controller({})
export class ReviewsController{


    constructor(private readonly reviewService: ReviewsService){}
    @Get("api/reviews")
    public getAllReviews(){
        return this.reviewService.getAll();
    }
}