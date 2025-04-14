import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from '../modules/user/create-user.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    // Mock the AuthService
    const authServiceMock = {
      createUser: jest
        .fn()
        .mockResolvedValue({ id: 1, email: 'test@test.com' }),
      login: jest.fn().mockResolvedValue({ access_token: 'mocked_token' }),
    };

    // Set up the testing module
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    // Get instances of the controller and service
    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a user', async () => {
      const createUserDto: CreateUserDto = <CreateUserDto>{
        email: 'test@test.com',
        password: 'password',
      };

      // Call the register method of the controller
      const result = await authController.register(createUserDto);

      // Assert the correct method was called on the service
      expect(authService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({ id: 1, email: 'test@test.com' });
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const req = { email: 'test@test.com', password: 'password' };

      // Call the login method of the controller
      const result = await authController.login(req);

      // Assert the correct method was called on the service
      expect(authService.login).toHaveBeenCalledWith(req.email, req.password);
      expect(result).toEqual({ access_token: 'mocked_token' });
    });
  });
});
