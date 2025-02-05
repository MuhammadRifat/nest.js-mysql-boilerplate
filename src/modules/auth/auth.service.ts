import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dto/auth.dto";
import { UserService } from "../user/user.service";
import * as bcrypt from 'bcryptjs';
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { UpdateUserDto } from "../user/dto/update-user.dto";
import { User } from "../user/entities/user.entity";
import { TimeService } from "../time/time.service";
import { EnumService } from "../enum/enum.service";


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private enumService: EnumService,
        private jwtService: JwtService,
        private timeService: TimeService
    ) { }

    // user login 
    async userLogin(loginDto: LoginDto) {
        const user = await this.userService.findOneByQuery({ email: loginDto.email });
        if (!user) {
            throw new NotFoundException('user not found');
        }
        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('password mismatch!');
        }
        const shopSetting = await this.enumService.findOneByQuery({ key: 'setting' });

        delete user.password;
        const payload = {
            id: user.id,
            email: user.email,
            phone: user.phone,
            name: user.name,
            role: user.role,
            image: user.image,
        };

        return {
            accessToken: await this.generateToken(payload),
            data: { ...user, setting: shopSetting?.value || null }
        };
    }

    // user registration 
    async userRegistration(createUserDto: CreateUserDto, admin: User) {
        createUserDto.password = await this.generateHash(createUserDto.password);
        const user = await this.userService.create(createUserDto, admin);
        // const payload = { id: user.id };

        return {
            // accessToken: await this.generateToken(payload),
            data: user
        };
    }

    // bulk create
    async bulkCreate(start: number, end: number) {
        const users = [];
        const password = await this.generateHash('123456');

        for (let i = start; i < end; i++) {
            users.push({
                firstName: `Muhammad Rifat`,
                lastName: `${i}`,
                email: `rifat${i}@gmail.com`,
                password: password,
                image: `172138463382721749627_whatsapp_image_2024_03_02_at_90234_am.jpeg`,
            });
        }

        await this.userService.createMany(users);
        return users.length;
    }

    // get user profile
    async userProfile(id: number) {
        const user = await this.userService.findOneById(id);
        delete user?.password;

        return user;
    }

    // update user profile
    async userProfileUpdate(user, updateUserDto: UpdateUserDto) {
        return await this.userService.update(user.id, updateUserDto);
    }

    // find user by payload
    async validateUser(payload: User) {
        try {
            const user = await this.userService.findOne(payload.id);
            delete user.password;

            return user;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }

    async validateToken(token: string) {
        if (!token) {
            throw new BadRequestException('token is required');
        }
        const payload = await this.verifyToken(token);
        const user = await this.userService.findOneById(payload?.id);

        if (!user) {
            throw new UnauthorizedException();
        }
        delete user.password;
        return user;
    }

    // generate hash
    private async generateHash(plainPassword: string) {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(plainPassword, salt);
    }

    // hash compare 
    private async hashCompare(plainPassword: string, hashPassword: string) {

        return await bcrypt.compare(plainPassword, hashPassword);
    }

    // generate jwt token
    private async generateToken(payload: object) {

        // Set the expiration to today
        const todayEnd = this.timeService.getEndOfDay();
        const now = this.timeService.getCurrentTime();

        // Calculate the expiration time in seconds
        const expiresIn = Math.floor((todayEnd.valueOf() - now.valueOf()) / 1000);
        return await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn
        });
    }

    // verify token
    private async verifyToken(token: string) {
        const payload = await this.jwtService.verifyAsync(
            token,
            {
                secret: process.env.JWT_SECRET
            }
        );

        return payload;
    }
}
