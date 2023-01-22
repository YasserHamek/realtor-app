import { ConflictException, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ProductKeyDto, SignInUserDto, SignUpUserDto, UserDto, UserType } from "../controller/user.dto";
import * as bcrypt from "bcryptjs";
import { JwtUtils } from "../../common/helper/JwtUtils";
import { IUserRepository } from "../repository/user.repository";

@Injectable()
export class AuthService {
  constructor(@Inject("UserRepository") private readonly userRepository: IUserRepository<any>) {}

  async signUpUser(createUserDto: SignUpUserDto, userType: UserType) {
    //Checking if user want to signUp as REALTOR, if true, we check if he have a valid productKey
    const productKey = `${createUserDto.email}-${createUserDto.name}-${process.env.PRODUCT_KEY_SIGNITURE}`;
    if (userType === UserType.REALTOR && (!createUserDto.productKey || !bcrypt.compare(createUserDto.productKey, productKey))) {
      throw new HttpException(
        "To signup as REALTOR, you must give a valid productKey, please contact you admin to get a productKey",
        HttpStatus.UNAUTHORIZED,
      );
    }

    //checking if email is used
    const user = await this.userRepository.findByEmail(createUserDto.email);

    if (user) {
      throw new ConflictException("email adress is already used, please use another email adress");
    }

    //hashing the password
    const hashedPassword: string = await bcrypt.hash(createUserDto.password, 10);

    //creating the user
    const createdUser: UserDto = await this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      phoneNumber: createUserDto.phoneNumber,
      userType: userType,
    });

    //returning JsonWebToken
    return JwtUtils.createJsonWebToken(createdUser.id, createdUser.name);
  }

  async signInUser(signInUserDto: SignInUserDto): Promise<string> {
    const user: UserDto = await this.userRepository.findByEmail(signInUserDto.email);

    if (!user || !(await bcrypt.compare(signInUserDto.password, user.password)))
      throw new HttpException("Email or Password are incorrect", HttpStatus.BAD_REQUEST);

    return JwtUtils.createJsonWebToken(user.id, user.name);
  }

  async getUserById(id: string): Promise<UserDto> {
    const user = await this.userRepository.getById(id);

    return new UserDto(user);
  }

  async generateProductKeyDto(productKeyDto: ProductKeyDto): Promise<string> {
    const key = `${productKeyDto.email}-${productKeyDto.name}-${process.env.PRODUCT_KEY_SIGNITURE}`;
    return await bcrypt.hash(key, 10);
  }
}
