import { Body, Controller , Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { UodateReviewDto } from "./dtos/update-review.dto";
import { CurrentUser } from "src/users/decorators/current-user.decorator";
import { JwtPayloadType } from "src/utils/types";
import { AuthRolesGuard } from "src/users/guards/auth.roles.guard";
import { Roles } from "src/users/decorators/user.role.decorator";
import { UserType } from "src/utils/enums";


@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}

  @Post(':productId')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  public createNewReview(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() body: CreateReviewDto,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    return this.reviewService.createReview(productId, payload.id, body);
  }


  // Get all reviews for a product
  @Get()
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public getAllReviews(
    @Query('pageNumber', ParseIntPipe) pageNumber: number , 
    @Query('reviewPerPage' , ParseIntPipe) reviewPerPage:number){
    return this.reviewService.getAll(pageNumber , reviewPerPage);
  }


  @Put(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  public updateReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UodateReviewDto,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    return this.reviewService.update(id, payload.id , body);
  }

  @Delete(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  public DeleteReview(@Param('id', ParseIntPipe) id: number,@CurrentUser() payload: JwtPayloadType) {
    return this.reviewService.delete(id, payload);
  }
}