import { BadRequestException, ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { userEntity } from 'src/model/user.entity';
import * as jwt from "jsonwebtoken";
import { sendMail } from 'src/config/mail.config';
import { Token } from 'src/helper/utils/token';
import { verifyEmailDTO } from './dto/verify-email.dto';
import { hash } from 'src/helper/utils/hash';
import { CreateUserDto } from './dto/create-user.dto';
import { loginUserDto } from './dto/login-user.dto';
import { JwtPayload } from 'jsonwebtoken';
import { forgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { roleType } from 'src/helper/types/index.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(userEntity)
    private userRepo: Repository<userEntity>,
    private config: ConfigService,
    private readonly hashService: hash,
    private readonly tokenService: Token
  ) { }

  private roleUser = {
    admin: 'admin',
    seller: 'seller',
    customer: 'customer'
  }
  async getVerify(verifyEmailDto: verifyEmailDTO) {
    try {
      const { email } = verifyEmailDto;
      const existingUser = await this.userRepo.findOne({
        where: { email: email }
      });

      if (existingUser) {
        throw new ForbiddenException("User already exists.");
      } else {
        // Generate an access token for email verification
        const token = await this.tokenService.generateAcessToken({ email });

        // Construct verification URL
        const frontURL = this.config.get<string>('frontURL');
        const url = `${frontURL}/signup/create-customer/${token}`;
        const message = `<p>Please verify your email by clicking on the following link: <a href="${url}">Verify Email</a></p>`;

        // Send the verification email
        await sendMail(email, 'Email Verification', message);

        return "Verification email has been sent";
      }
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async verifySeller(verifyEmailDto: verifyEmailDTO) {
    try {
      const { email } = verifyEmailDto;
      const existingUser = await this.userRepo.findOne({
        where: { email: email }
      });

      if (existingUser) {
        throw new ForbiddenException("User already exists.");
      } else {
        // Generate an access token for email verification
        const token = await this.tokenService.generateAcessToken({ email });

        // Construct verification URL
        const frontURL = this.config.get<string>('frontURL');
        const url = `${frontURL}/signup/create-seller/${token}`;
        const message = `<p>Please verify your email by clicking on the following link: <a href="${url}">Verify Email</a></p>`;

        // Send the verification email
        await sendMail(email, 'Email Verification', message);

        return "Verification email has been sent";
      }
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  // Register a new user
  async create(createUserDto: CreateUserDto, token: string) {
    try {
      token = token.split(' ')[1];
      let decodedToken;

      decodedToken = await jwt.verify(token, process.env.AT_SECRET);
      if (!decodedToken) {
        throw new ForbiddenException("Token malformed")
      }
      const { email } = decodedToken;
      const existingUser = await this.userRepo.findOne({ where: { email } });

      if (existingUser) {
        throw new ConflictException('Email address is already in use');
      }
      const hashedPassword = await this.hashService.value(createUserDto.password);
      const user = new userEntity();
      user.email = email;
      user.password = hashedPassword;
      user.name = createUserDto.name;
      const savedUser = await this.userRepo.save(user);
      return {
        message: "Registered Successfully.",
        data: savedUser
      }

    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  // Register a new seller
  async createseller(createUserDto: CreateUserDto, token: string) {
    try {
      token = token.split(' ')[1];
      let decodedToken;

      decodedToken = await jwt.verify(token, process.env.AT_SECRET);
      if (!decodedToken) {
        throw new ForbiddenException("Token malformed")
      }
      const { email } = decodedToken;
      const existingUser = await this.userRepo.findOne({ where: { email } });

      if (existingUser) {
        throw new ConflictException('Email address is already in use');
      }
      const hashedPassword = await this.hashService.value(createUserDto.password);
      const user = new userEntity();
      user.email = email;
      user.password = hashedPassword;
      user.name = createUserDto.name;
      user.role = roleType.seller;
      const savedUser = await this.userRepo.save(user);
      return {
        message: "Registered Successfully.",
        data: savedUser
      }

    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async login(LoginUserDto: loginUserDto) {
    const { email, password } = LoginUserDto;
    const authUser = await this.userRepo.findOne({
      where: { email }
    });
    if (!authUser) {
      throw new ForbiddenException("User Not found")
    } else {
      const status = await this.hashService.verifyHashing(authUser.password, password)
      if (!status) {
        throw new UnauthorizedException("Credential doesn't match")
      }
      const userRole = this.roleUser[authUser.role];
      const tokens = {
        accessToken: await this.tokenService.generateAcessToken({ email: email, role: userRole, id: authUser.id }),
        refreshToken: await this.tokenService.generateRefreshToken({ email: email, role: userRole, id: authUser.id }),
        role: authUser.role
      }
      authUser.rToken = await this.hashService.value(tokens.refreshToken)
      await this.userRepo.save(authUser)
      return tokens
    }
  }


  async refreshTokenAdmin(user: JwtPayload) {

    return await this.tokenService.generateAcessToken({ email: user.email, role: user.role })
  }

  // Forgot Password
  async forgot(ForgotPasswordDto: forgotPasswordDto) {
    try {
      const { email } = ForgotPasswordDto;
      const user = await this.userRepo.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException("User not found.");
      }

      // Generate reset token using the Token service
      const token = await this.tokenService.generateAcessToken({ email });

      // Construct the reset password URL
      const frontURL = this.config.get<string>('frontURL');
      const url = `${frontURL}/auth/reset-password/${token}`;

      // Send email using the custom sendMail function
      await sendMail(email, 'Reset your password', `To reset your password, click on the following link: ${url}`);

      return "Verification mail has been sent";
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  //reset-password
  async reset(resetPasswordDto: ResetPasswordDto, token: string) {
    try {
      const newPassword = resetPasswordDto.password;
      console.log(newPassword);

      if (!token) {
        throw new NotFoundException("Token not found");
      } else {
        token = token.split(' ')[1];
        let decodedToken;

        decodedToken = await jwt.verify(token, process.env.AT_SECRET);
        if (!decodedToken) {
          return ({ message: "Token verification failed" });
        } else {
          const { email } = decodedToken;
          const hashedPassword = await this.hashService.value(newPassword);
          const user = await this.userRepo.findOne({ where: { email: email } });
          user.password = hashedPassword;
          return {
            data: await this.userRepo.save(user),
            message: "Password changed successfully"
          }
        }
      }
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }


  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
