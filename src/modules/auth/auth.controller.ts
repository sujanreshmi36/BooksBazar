import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, ForbiddenException, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { verifyEmailDTO } from './dto/verify-email.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { loginUserDto } from './dto/login-user.dto';
import { RtGuard } from 'src/middlewares/refresh_token/rt.guard';
import { forgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateSellerDto } from './dto/create-seller.dto';

@ApiTags('Auth')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  //get email for verification
  @Post('get-verify')
  @ApiOperation({ summary: 'get your email verified' })
  @ApiBody({ type: verifyEmailDTO })
  getVerify(@Body() verifyEmailDto: verifyEmailDTO) {
    return this.authService.getVerify(verifyEmailDto);
  }

  @Post('create')
  @ApiOperation({ summary: 'create your account' })
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto,
    @Headers('Authorization') token: string) {
    console.log(token);

    if (!token) {
      throw new ForbiddenException("Insufficient payload")
    }
    return this.authService.create(createUserDto, token);
  }

  @Post('create-seller')
  @ApiOperation({ summary: 'create your account' })
  @ApiBody({ type: CreateUserDto })
  createseller(@Body() createSellerDto: CreateSellerDto,
    @Headers('Authorization') token: string) {

    if (!token) {
      throw new ForbiddenException("Insufficient payload")
    }
    return this.authService.createseller(createSellerDto, token);
  }


  @Post('signin')
  @ApiOperation({ summary: 'SignIn your Account' })
  login(@Body() LoginUserDto: loginUserDto) {
    return this.authService.login(LoginUserDto)
  }

  @Post('refresh-token')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "Generate access token" })
  @UseGuards(RtGuard)
  async refrshToken(@Req() req) {
    const { user } = req
    return this.authService.refreshTokenAdmin(user);
  }

  //forgot-password
  @Post('forgot-password')
  @ApiOperation({ summary: 'forgot password' })
  @ApiBody({ type: forgotPasswordDto })
  forgot(@Body() ForgotPasswordDto: forgotPasswordDto) {
    return this.authService.forgot(ForgotPasswordDto);
  }


  //rest-password
  @Post('reset-password')
  @ApiOperation({ summary: 'reset password' })
  @ApiBody({ type: ResetPasswordDto })
  reset(@Body() resetPasswordDto: ResetPasswordDto, @Headers('Authorization') token: string) {
    return this.authService.reset(resetPasswordDto, token);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
