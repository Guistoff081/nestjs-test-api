import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  // use createMock to mock A fileBufferinstance
  const mockFile = createMock<Express.Multer.File>();
  mockFile.fieldname = 'avatar';
  mockFile.originalname = 'avatar.jpg';
  mockFile.buffer = Buffer.from('some data');
  const createUserDto: CreateUserDto = {
    first_name: 'User',
    last_name: ' #1',
    email: 'test@mail.com',
    avatar: mockFile,
  };

  const mockUser = {
    first_name: 'User',
    last_name: ' #1',
    email: 'test@mail.com',
    avatar: null,
    _id: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // create a testing module
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
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
            ]),
            create: jest.fn().mockResolvedValue(createUserDto),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should create a new user', async () => {
      const createSpy = jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce(mockUser);

      await controller.create(createUserDto, mockFile);
      expect(createSpy).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll()', () => {
    it('should return an array of users', async () => {
      expect(controller.findAll()).resolves.toEqual([
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
      ]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
