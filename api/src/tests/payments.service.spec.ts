import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteResult } from 'typeorm';
import {PaymentsService} from "../modules/payments/payments.service";
import {Payment} from "../modules/payments/payment.entity";
import {Balance} from "../modules/balance/balance.entity";
import {User} from "../modules/user/user.entity";
import {BalanceService} from "../modules/balance/balance.service";

describe('PaymentsService', () => {
  let service: PaymentsService;
  let paymentsRepository: Repository<Payment>;
  let balanceRepository: Repository<Balance>;
  let userRepository: Repository<User>;
  let balanceService: BalanceService;

  const mockPaymentRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  const mockBalanceRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockBalanceService = {
    processBalance: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: getRepositoryToken(Payment), useValue: mockPaymentRepository },
        { provide: getRepositoryToken(Balance), useValue: mockBalanceRepository },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: BalanceService, useValue: mockBalanceService },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    paymentsRepository = module.get<Repository<Payment>>(getRepositoryToken(Payment));
    balanceRepository = module.get<Repository<Balance>>(getRepositoryToken(Balance));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    balanceService = module.get<BalanceService>(BalanceService);
  });

  describe('createPayment', () => {
    it('should create a payment and return it', async () => {
      const mockUser = { id: 1 };
      const mockPayment = new Payment();
      mockPayment.name = 'Test Payment';
      mockPayment.description = 'Test Description';
      mockPayment.amount = 100;
      mockPayment.balance_id = 1;
      mockPayment.user_id = 1;

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockBalanceService.processBalance.mockResolvedValue(undefined);
      mockPaymentRepository.save.mockResolvedValue(mockPayment);

      const result = await service.createPayment({
        userId: 1,
        name: 'Test Payment',
        description: 'Test Description',
        amount: 100,
        balanceId: 1,
      });

      expect(result).toEqual(mockPayment);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockBalanceService.processBalance).toHaveBeenCalledWith(1, 100, 1);
    });

    it('should throw an error if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
          service.createPayment({
            userId: 1,
            name: 'Test Payment',
            description: 'Test Description',
            amount: 100,
            balanceId: 1,
          }),
      ).rejects.toThrowError('Usuário não identificado');
    });
  });

  describe('getPayments', () => {
    it('should return an array of payments', async () => {
      const mockPayments = [new Payment()];
      mockPaymentRepository.find.mockResolvedValue(mockPayments);

      const result = await service.getPayments(1);

      expect(result).toEqual(mockPayments);
      expect(mockPaymentRepository.find).toHaveBeenCalledWith({ where: { user_id: 1 } });
    });
  });

  describe('getPaymentsById', () => {
    it('should return a payment by id', async () => {
      const mockPayment = new Payment();
      mockPayment.id = 1;
      mockPayment.user_id = 1;
      mockPaymentRepository.findOne.mockResolvedValue(mockPayment);

      const result = await service.getPaymentsById(1, 1);

      expect(result).toEqual(mockPayment);
      expect(mockPaymentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, user_id: 1 },
        relations: ['balance_id'],
      });
    });
  });

  describe('deletePayment', () => {
    it('should delete a payment and update balance', async () => {
      const mockPayment = new Payment();
      mockPayment.id = 1;
      mockPayment.user_id = 1;
      mockPayment.amount = 100;
      mockPayment.balance_id = 1;

      const mockBalance = new Balance();
      mockBalance.id = 1;
      mockBalance.remaining_value = 200;
      mockBalance.operations_value = 50;

      mockPaymentRepository.findOne.mockResolvedValue(mockPayment);
      mockBalanceRepository.findOne.mockResolvedValue(mockBalance);
      mockBalanceRepository.save.mockResolvedValue(mockBalance);
      mockPaymentRepository.delete.mockResolvedValue({ affected: 1 } as DeleteResult);

      const result = await service.deletePayment(1, 1);

      expect(result).toEqual({ affected: 1 });
      expect(mockBalanceRepository.save).toHaveBeenCalledWith(mockBalance);
      expect(mockPaymentRepository.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an error if payment is not found', async () => {
      mockPaymentRepository.findOne.mockResolvedValue(null);

      await expect(service.deletePayment(1, 1)).rejects.toThrowError('Payment not found');
    });

    it('should throw an error if balance is not found', async () => {
      const mockPayment = new Payment();
      mockPayment.id = 1;
      mockPayment.user_id = 1;
      mockPayment.amount = 100;
      mockPayment.balance_id = 1;

      mockPaymentRepository.findOne.mockResolvedValue(mockPayment);
      mockBalanceRepository.findOne.mockResolvedValue(null);

      await expect(service.deletePayment(1, 1)).rejects.toThrowError('Balance not found');
    });
  });

  describe('updatePayment', () => {
    it('should update payment name', async () => {
      const mockPayment = new Payment();
      mockPayment.id = 1;
      mockPayment.user_id = 1;
      mockPayment.name = 'Old Name';

      mockPaymentRepository.findOne.mockResolvedValue(mockPayment);
      mockPaymentRepository.save.mockResolvedValue({ ...mockPayment, name: 'New Name' });

      const result = await service.updatePayment(1, 'New Name', 1);

      expect(result.name).toBe('New Name');
      expect(mockPaymentRepository.save).toHaveBeenCalledWith({ ...mockPayment, name: 'New Name' });
    });

    it('should throw an error if payment not found', async () => {
      mockPaymentRepository.findOne.mockResolvedValue(null);

      await expect(service.updatePayment(1, 'New Name', 1)).rejects.toThrowError('Payment not found');
    });
  });
});
