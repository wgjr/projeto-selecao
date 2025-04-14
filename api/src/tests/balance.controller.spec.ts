import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import {BalanceController} from "../modules/balance/balance.controller";
import {BalanceService} from "../modules/balance/balance.service";
import {JwtAuthGuard} from "../auth/auth.guard";

describe('BalanceController', () => {
  let controller: BalanceController;
  let balanceService: BalanceService;

  beforeEach(async () => {
    const balanceServiceMock = {
      createBalance: jest.fn(),
      getBalances: jest.fn(),
      getBalanceFromId: jest.fn(),
      deleteBalance: jest.fn(),
      updateBalance: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BalanceController],
      providers: [
        {
          provide: BalanceService,
          useValue: balanceServiceMock,
        },
      ],
    })
        .overrideGuard(JwtAuthGuard) // Mock JwtAuthGuard if needed
        .useValue({ canActivate: () => true })
        .compile();

    controller = module.get<BalanceController>(BalanceController);
    balanceService = module.get<BalanceService>(BalanceService);
  });

  describe('createBalance', () => {
    it('should successfully create a balance', async () => {
      const createBalanceDto = { amount: 100, name: 'Test Balance', description: 'Test Description' };
      const req = { user: { userId: 1 } };
      const result = { id: 1, ...createBalanceDto };

      balanceService.createBalance = jest.fn().mockResolvedValue(result);

      expect(await controller.createBalance(req, createBalanceDto)).toEqual(result);
      expect(balanceService.createBalance).toHaveBeenCalledWith({
        amountValue: 100,
        userId: 1,
        name: 'Test Balance',
        description: 'Test Description',
      });
    });

  });

  describe('getBalances', () => {
    it('should return all balances for the user', async () => {
      const req = { user: { userId: 1 } };
      const balances = [{ id: 1, amount: 100, name: 'Test Balance', description: 'Test Description' }];
      balanceService.getBalances = jest.fn().mockResolvedValue(balances);

      expect(await controller.getBalances(req)).toEqual(balances);
    });
  });

  describe('getBalanceById', () => {
    it('should return a balance by its id', async () => {
      const req = { user: { userId: 1 } };
      const balanceId = 1;
      const balance = { id: 1, amount: 100, name: 'Test Balance', description: 'Test Description' };

      balanceService.getBalanceFromId = jest.fn().mockResolvedValue(balance);

      expect(await controller.getBalanceById(req, balanceId)).toEqual(balance);
    });
  });

  describe('deleteBalance', () => {
    it('should delete a balance by its id', async () => {
      const req = { user: { userId: 1 } };
      const balanceId = 1;

      balanceService.deleteBalance = jest.fn().mockResolvedValue({ message: 'Deleted successfully' });

      expect(await controller.deleteBalance(req, balanceId)).toEqual({ message: 'Deleted successfully' });
    });
  });

  describe('updateBalance', () => {
    it('should update a balance by its id', async () => {
      const req = { user: { userId: 1 } };
      const balanceId = 1;
      const newName = 'Updated Balance';

      balanceService.updateBalance = jest.fn().mockResolvedValue({ id: 1, name: newName });

      expect(await controller.updateBalance(req, balanceId, newName)).toEqual({ id: 1, name: newName });
    });
  });
});
