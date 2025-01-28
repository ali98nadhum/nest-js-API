import { CallHandler, ExecutionContext, Injectable , NestInterceptor } from "@nestjs/common";
import { map, Observable, tap } from "rxjs";


@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

        console.log("before Route handler");
        

        return next.handle().pipe(map((data) => {
            const {password , ...otherData} = data;
            return {...otherData}
        }))
    }
}