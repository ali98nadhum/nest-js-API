import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from "bcryptjs";
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import {JwtPayloadType} from "../utils/types";
import { UpdateUserDto } from './dtos/update.user.dto';
import { UserType } from 'src/utils/enums';


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ){}
   
//   Register new user
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
        password: hashPassword
    });

    newUser = await this.userRepository.save(newUser);

    // Genrated token
    const payload: JwtPayloadType = {id: newUser.id , userType: newUser.userType};
    const token = await this.generateJWT(payload);

    return {token}

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

    return {message: "Logged in successfully", token}
    
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


  // generate jsonweb token
  private generateJWT(payload: JwtPayloadType): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

}
