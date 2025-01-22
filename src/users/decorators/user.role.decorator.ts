import { SetMetadata } from "@nestjs/common";
import {UserType} from "../../utils/enums";


// Roles Methods Decorators
export const Roles = (...roles: UserType[]) => SetMetadata("roles", roles);