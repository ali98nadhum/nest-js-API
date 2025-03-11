import { BadRequestException, Injectable, RequestTimeoutException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dtos/register.dto";
import * as bcrypt from "bcryptjs";
import { LoginDto } from "./dtos/login.dto";
import { JwtPayloadType } from "src/utils/types";
import { MailService } from "src/mail/mail.service";
import {randomBytes} from "node:crypto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthProvider {

    constructor(
            @InjectRepository(User) private readonly userRepository: Repository<User>,
            private readonly jwtService: JwtService,
            private readonly mailService: MailService,
            private readonly config:ConfigService
        ){}

     public async register(registerDto: RegisterDto) {
        const {email , password , username} = registerDto;
    
        // check if user already exists
        const userFromDb = await this.userRepository.findOne({where: {email}})
        if(userFromDb) throw new BadRequestException("User already exists");
    
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
    
        // create new user
        let newUser = this.userRepository.create({
            email,
            username,
            password: hashPassword,
            verificationToken: randomBytes(32).toString('hex')
        });
    
        newUser = await this.userRepository.save(newUser);
        const link = `${this.config.get<string>('DOMAIN')}/api/users/verify-email/${newUser.id}/${newUser.verificationToken}`

        await this.mailService.sendVerifyEmail(email , link)
    
       
        return {message: "Verification token has been sent to your email"}
    
      }
    
    
    
      // Login user
      public async login(loginDto: LoginDto){
        const {email, password} = loginDto;
    
        // Check if user found
        const user = await this.userRepository.findOne({where: {email}})
        if(!user) throw new BadRequestException("Invalid email or password");
    
        // Check if password is valid
        const passwordIsValid = await bcrypt.compare(password , user.password);
        if(!passwordIsValid) throw new BadRequestException("Invalid email or password");
    
        const payload: JwtPayloadType = {id: user.id , userType: user.userType};
        const token = await this.generateJWT(payload);

        // send email to user before send token
        await this.mailService.sendLoginEmail(user.email);

    
        return {message: "Logged in successfully", token}
        
      }


        // generate jsonweb token
      private generateJWT(payload: JwtPayloadType): Promise<string> {
        return this.jwtService.signAsync(payload);
      }
}