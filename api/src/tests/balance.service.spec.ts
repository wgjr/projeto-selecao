import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {BalanceService} from "../modules/balance/balance.service";
import {Balance} from "../modules/balance/balance.entity";
import {User} from "../modules/user/user.entity";

describe('BalanceService', () => {
  let service: BalanceService;
  let balanceRepository: Repository<Balance>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const balanceRepositoryMock = {
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const userRepositoryMock = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceService,
        {
          provide: getRepositoryToken(Balance),
          useValue: balanceRepositoryMock,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<BalanceService>(BalanceService);
    balanceRepository = module.get<Repository<Balance>>(getRepositoryToken(Balance));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('createBalance', () => {
    it('should successfully create a balance', async () => {
      const userId = 1;
      const createBalanceData = { amountValue: 100, name: 'Test Balance', description: 'Test Description' };
      const user = { id: userId };
      const balance = new Balance();
      balance.name = createBalanceData.name;
      balance.description = createBalanceData.description;
      balance.initial_value = createBalanceData.amountValue;
      balance.remaining_value = createBalanceData.amountValue;
      balance.operations_value = 0;
      balance.user_id = userId;

      userRepository.findOne = jest.fn().mockResolvedValue(user);
      balanceRepository.save = jest.fn().mockResolvedValue(balance);

      const result = await service.createBalance({
        userId,
        name: createBalanceData.name,
        description: createBalanceData.description,
        amountValue: createBalanceData.amountValue,
      });

      expect(result).toEqual(balance);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(balanceRepository.save).toHaveBeenCalledWith(balance);
    });

    it('should throw an error if user is not found', async () => {
      const createBalanceData = { amountValue: 100, name: 'Test Balance', description: 'Test Description' };
      const userId = 1;

      userRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(
          service.createBalance({
            userId,
            name: createBalanceData.name,
            description: createBalanceData.description,
            amountValue: createBalanceData.amountValue,
          }),
      ).rejects.toThrowError('Usuário não localizado');
    });

    it('should throw an error if saving the balance fails', async () => {
      const userId = 1;
      const createBalanceData = { amountValue: 100, name: 'Test Balance', description: 'Test Description' };
      const user = { id: userId };

      userRepository.findOne = jest.fn().mockResolvedValue(user);
      balanceRepository.save = jest.fn().mockResolvedValue(null);

      await expect(
          service.createBalance({
            userId,
            name: createBalanceData.name,
            description: createBalanceData.description,
            amountValue: createBalanceData.amountValue,
          }),
      ).rejects.toThrowError('Ocorreu um erro ao registrar o saldo. Tente novamente.');
    });
  });

  describe('processBalance', () => {
    it('should successfully process a balance', async () => {
      const balanceId = 1;
      const value = 50;
      const userId = 1;

      const balance = new Balance();
      balance.id = balanceId;
      balance.user_id = userId;
      balance.remaining_value = 100;
      balance.operations_value = 0;

      balanceRepository.findOne = jest.fn().mockResolvedValue(balance);
      balanceRepository.save = jest.fn().mockResolvedValue(balance);

      const result = await service.processBalance(balanceId, value, userId);

      expect(result.remaining_value).toBe(50);
      expect(result.operations_value).toBe(50);
      expect(balanceRepository.findOne).toHaveBeenCalledWith({
        where: { id: balanceId, user_id: userId },
      });
      expect(balanceRepository.save).toHaveBeenCalledWith(balance);
    });

    it('should throw an error if balance is not found', async () => {
      const balanceId = 1;
      const value = 50;
      const userId = 1;

      balanceRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.processBalance(balanceId, value, userId)).rejects.toThrowError('Saldo não localizado');
    });

    it('should throw an error if balance has insufficient funds', async () => {
      const balanceId = 1;
      const value = 150;
      const userId = 1;

      const balance = new Balance();
      balance.id = balanceId;
      balance.user_id = userId;
      balance.remaining_value = 100;
      balance.operations_value = 0;

      balanceRepository.findOne = jest.fn().mockResolvedValue(balance);

      await expect(service.processBalance(balanceId, value, userId)).rejects.toThrowError('Saldo insuficiente para essa operação');
    });
  });

  describe('getBalances', () => {
    it('should return all balances for a user', async () => {
      const userId = 1;
      const balances = [{ id: 1, name: 'Test Balance', remaining_value: 100 }];

      balanceRepository.find = jest.fn().mockResolvedValue(balances);

      const result = await service.getBalances(userId);

      expect(result).toEqual(balances);
      expect(balanceRepository.find).toHaveBeenCalledWith({ where: { user_id: userId } });
    });
  });

  describe('getBalanceFromId', () => {
    it('should return a balance by its id and userId', async () => {
      const balanceId = 1;
      const userId = 1;
      const balance = { id: balanceId, user_id: userId, name: 'Test Balance' };

      balanceRepository.findOne = jest.fn().mockResolvedValue(balance);

      const result = await service.getBalanceFromId(balanceId, userId);

      expect(result).toEqual(balance);
      expect(balanceRepository.findOne).toHaveBeenCalledWith({
        where: { id: balanceId, user_id: userId },
      });
    });

    it('should return null if balance not found', async () => {
      const balanceId = 1;
      const userId = 1;

      balanceRepository.findOne = jest.fn().mockResolvedValue(null);

      const result = await service.getBalanceFromId(balanceId, userId);

      expect(result).toBeNull();
    });
  });

  describe('updateBalance', () => {
    it('should successfully update balance name', async () => {
      const balanceId = 1;
      const userId = 1;
      const newName = 'Updated Balance';

      const balance = new Balance();
      balance.id = balanceId;
      balance.user_id = userId;
      balance.name = newName;

      balanceRepository.findOne = jest.fn().mockResolvedValue(balance);
      balanceRepository.save = jest.fn().mockResolvedValue(balance);

      const result = await service.updateBalance(balanceId, newName, userId);

      expect(result.name).toBe(newName);
      expect(balanceRepository.findOne).toHaveBeenCalledWith({
        where: { id: balanceId, user_id: userId },
      });
      expect(balanceRepository.save).toHaveBeenCalledWith(balance);
    });

    it('should throw an error if balance is not found', async () => {
      const balanceId = 1;
      const userId = 1;
      const newName = 'Updated Balance';

      balanceRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.updateBalance(balanceId, newName, userId)).rejects.toThrowError('Saldo não localizado');
    });
  });

  describe('deleteBalance', () => {
    it('should successfully delete a balance', async () => {
      const balanceId = 1;
      const userId = 1;

      const balance = { id: balanceId, user_id: userId, payments: [] };

      balanceRepository.findOne = jest.fn().mockResolvedValue(balance);
      balanceRepository.delete = jest.fn().mockResolvedValue({ affected: 1 });

      const result = await service.deleteBalance(balanceId, userId);

      expect(result).toEqual(balance);
      expect(balanceRepository.findOne).toHaveBeenCalledWith({
        where: { id: balanceId, user_id: userId },
        relations: ['payments'],
      });
      expect(balanceRepository.delete).toHaveBeenCalledWith({ id: balanceId });
    });

    it('should throw an error if balance is not found', async () => {
      const balanceId = 1;
      const userId = 1;

      balanceRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.deleteBalance(balanceId, userId)).rejects.toThrowError('Saldo não localizado');
    });

    it('should throw an error if balance has payments associated', async () => {
      const balanceId = 1;
      const userId = 1;

      const balance = { id: balanceId, user_id: userId, payments: [{ id: 1 }] };

      balanceRepository.findOne = jest.fn().mockResolvedValue(balance);

      await expect(service.deleteBalance(balanceId, userId)).rejects.toThrowError('Existem pagamentos associados a esse saldo');
    });
  });
});
