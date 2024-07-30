import { da, faker } from '@faker-js/faker';
import { MAILER_OPTIONS, MailerService } from '@nestjs-modules/mailer';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, UserRole, Users } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtStrategy } from '../guards/jwt.strategy';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockPrisma = {
  users: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

const mockJwtService = {
  sign: jest.fn(),
};

const mockMailService = {
  sendMail: jest.fn(),
};

describe('UsersController', () => {
  let sut: UsersController;
  let prisma: PrismaClient;
  let jwtService: JwtService;
  let jwtStrategy: JwtStrategy;
  let mailService: MailerService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        JwtStrategy,
        JwtService,
        MailerService,
        {
          provide: 'dbclient',
          useValue: mockPrisma,
        },
        {
          provide: MailerService,
          useValue: mockMailService,
        },
      ],
    }).compile();
    sut = await module.get<UsersController>(UsersController);
    prisma = await module.get<PrismaClient>('dbclient');
    jwtService = await module.get<JwtService>(JwtService);
    jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
    mailService = await module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
    expect(prisma).toBeDefined();
    expect(mailService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(jwtStrategy).toBeDefined();
  });

  describe('find all users', () => {
    it('should return a array with no data', async () => {
      const result = MakeBody();
      const users = await prisma.users.create({
        data: result,
      });
      const reuslt = await sut.findAll();
      expect(reuslt).toEqual(users);
    });
  });

  describe('Register a new user', () => {
    it('should register a new user', async () => {
      const users: RegisterUserDto = MakeBody({});

      const hashedPassword = await bcrypt.hash(users.password, 10);

      const newUser = await sut.register({
        ...users,
        password: hashedPassword,
        passwordConfirmation: hashedPassword,
      });
      const result = await prisma.users.create({
        data: {
          ...users,
        },
      });
      expect(result).not.toBeInstanceOf(Error);
      expect(result).toEqual(newUser);
      expect(mailService.sendMail).toHaveBeenCalled();
    });
  });
  describe('Not match password', () => {
    it('should return an error with password and passwordConfirmation not matching', async () => {
      const user = MakeBody();
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = await prisma.users.create({
        data: {
          ...user,
          password: hashedPassword,
          passwordConfirmation: '123456789',
        },
      });
      expect(newUser).not.toBeInstanceOf(UnprocessableEntityException);
    });
  });

  describe('Login', () => {
    it('should return a authenticated user with token', async () => {
      const data: LoginUserDto = MakeBody({});

      const { email, password } = data;

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const result = await sut.login({
        ...data,
        password: hashedPassword,
      });

      expect(result).not.toBeInstanceOf(Error);
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('role');
      expect(result).toEqual(data);
    });
  });
  describe('Not found Email', () => {
    it('should return a error', async () => {
      const user = await prisma.users.findFirst({
        where: {
          email: 'olate@gmail.com',
        },
      });

      expect(user).not.toBeInstanceOf(NotFoundException);
    });
  });
});

function MakeBody(props?: any) {
  const defaultData = {
    id: faker.number.int(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(10),
    passwordConfirmation: faker.internet.password(10),
    confirmationToken: faker.string.alphanumeric({ length: 100 }),
    role: UserRole.USER,
    status: true,
    recoverToken: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  return { ...defaultData, ...props };
}
