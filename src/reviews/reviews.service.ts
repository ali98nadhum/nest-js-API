import { Injectable } from "@nestjs/common";



@Injectable()
export class ReviewsService {



        public getAll(){
            return [
                {id: 1, productId: 1, userId: 1, content: "Great product!", rating: 5},
                {id: 2, productId: 2, userId: 2, content: "Disappointing!", rating: 2},
                {id: 3, productId: 3, userId: 3, content: "Fantastic!", rating: 5},
            ]
        }
}

