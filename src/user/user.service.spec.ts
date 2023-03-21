import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;
  let httpClient: HttpService;

  const mockFile = createMock<Express.Multer.File>();

  mockFile.fieldname = 'avatar';
  mockFile.originalname = 'avatar.jpg';
  mockFile.buffer = Buffer.from('some data');

  const mockUser = {
    first_name: 'User',
    last_name: ' #1',
    email: 'test@mail.com',
    avatar: mockFile,
    _id: 1,
  };

  const usersMock = [
    {
      first_name: 'User',
      last_name: ' #1',
      email: 'test@mail.com',
      id: 1,
      avatar: mockFile,
    },
    {
      first_name: 'User',
      last_name: ' #2',
      email: 'test2@mail.com',
      id: 2,
      avatar: mockFile,
    },
    {
      first_name: 'User',
      last_name: ' #3',
      email: 'test3@mail.com',
      _id: 3,
      avatar: mockFile,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn().mockImplementation(() => of({ data: {} })),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser),
            constructor: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken('User'));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    httpClient = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(usersMock),
    } as any);
    const users = await service.findAll();
    expect(users).toEqual(usersMock);
  });

  it('should insert a new user', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve({
        first_name: 'User',
        last_name: ' #1',
        email: 'test@mail.com',
        avatar: mockFile,
        _id: 1,
      } as any),
    );
    const newUser = await service.create({
      first_name: 'User',
      last_name: ' #1',
      email: 'test@mail.com',
      avatar: mockFile,
    });
    expect(newUser).toEqual(mockUser);
  });
});
