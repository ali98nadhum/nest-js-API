import {ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from "bcryptjs";
import { LoginDto } from './dtos/login.dto';
import {JwtPayloadType} from "../utils/types";
import { UpdateUserDto } from './dtos/update.user.dto';
import { UserType } from 'src/utils/enums';
import { AuthProvider } from './auth.provider';


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly authProvider: AuthProvider
    ){}
   
//   Register new user
  public async register(registerDto: RegisterDto) {
    
    return this.authProvider.register(registerDto)

  }



  // Login user
  public async login(loginDto: LoginDto){
    
    return this.authProvider.login(loginDto)
    
  }

  
  // Get user information (for him selef)
  public async getCurrentUser(id: number) {
    const user = await this.userRepository.findOne({where: {id}});
    if(!user) throw new NotFoundException("User not found");
    return user;
  }


  // Get all users
  public getAll(){
    return this.userRepository.find();
  }


  // Update user information
  public async update(id: number , updateUserDto:UpdateUserDto){
    const {password , username} = updateUserDto;

    const user = await this.userRepository.findOne({where: {id}});
    if(!user) throw new NotFoundException("User not found");

    user.username = username ?? user.username
    if(password){
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      user.password = hashPassword;
    }

    return this.userRepository.save(user);
  }

  // Delete user
  public async delete(userId: number , payload: JwtPayloadType){
    const user = await this.getCurrentUser(userId);
    if(user.id === payload.id || payload.userType === UserType.ADMIN){
      await this.userRepository.remove(user)
      return {message: "User has been deleted"}
    }

    throw new ForbiddenException("You are not allowed to delete this user");
  }



 

}
