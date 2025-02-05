import { Body, Controller, Get, HttpException, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserTypes } from 'src/common/decorators/user-type.decorator';
import { USER_TYPE } from '../user/enum/user.enum';
import { UserTypeGuard } from 'src/common/guards/user-type.guard';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from '../user/entities/user.entity';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post('user/register')
    @UserTypes(USER_TYPE.ADMIN)
    @UseGuards(JwtAuthGuard, UserTypeGuard)
    async create(
        @Body() createUserDto: CreateUserDto,
        @GetUser() user: User
    ) {
        try {
            const data = await this.authService.userRegistration(createUserDto, user);

            return {
                success: true,
                ...data
            }
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Post('user/login')
    async login(@Body() loginDto: LoginDto) {
        try {
            const data = await this.authService.userLogin(loginDto);

            return {
                success: true,
                ...data
            }
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Post('user/validate-token')
    async validateToken(@Body('token') token: string) {
        try {
            const data = await this.authService.validateToken(token);

            return {
                success: true,
                data
            }
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Get('user/profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(
        @Req() req
    ) {
        try {
            const user = await this.authService.userProfile(req.user.id);

            return {
                success: true,
                data: user
            }
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Patch('user/update')
    @UseGuards(JwtAuthGuard)
    async userUpdateProfile(
        @Body() updateUserDto: UpdateUserDto,
        @Req() req
    ) {
        try {
            const user = await this.authService.userProfileUpdate(req.user, updateUserDto);

            return {
                success: true,
                data: user
            }
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
}
