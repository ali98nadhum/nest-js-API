
import { createParamDecorator , ExecutionContext } from "@nestjs/common";
import {JwtPayloadType} from "src/utils/types";


export const CurrentUser =createParamDecorator(
    (data , context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        const payload:  JwtPayloadType = req["user"]
        return payload;
    }
)