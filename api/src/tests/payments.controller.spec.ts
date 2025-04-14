import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import {PaymentsController} from "../modules/payments/payments.controller";
import {PaymentsService} from "../modules/payments/payments.service";
import {JwtAuthGuard} from "../auth/auth.guard";

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: {
            createPayment: jest.fn(),
            getPayments: jest.fn(),
            getPaymentsById: jest.fn(),
            deletePayment: jest.fn(),
            updatePayment: jest.fn(),
          },
        },
      ],
    })
        .overrideGuard(JwtAuthGuard)
        .useValue({ canActivate: () => true }) // Mock JwtAuthGuard to always return true
        .compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);
  });

  describe('createPayment', () => {
    it('should call paymentsService.createPayment with correct parameters', async () => {
      const req = { user: { userId: 1 } };
      const createPaymentDto = { name: 'teste', balanceId: 1, amount: 100, description: 'Test payment' };

      const result = {
        id: 1,
        created_at: new Date(), // Add created_at
        balance_id: createPaymentDto.balanceId, // Add balance_id
        user_id: req.user.userId, // Add user_id
        ...createPaymentDto,
      };

      jest.spyOn(service, 'createPayment').mockResolvedValue(result);

      expect(await controller.createPayment(req, createPaymentDto)).toEqual(result);
      expect(service.createPayment).toHaveBeenCalledWith({
        userId: req.user.userId,
        ...createPaymentDto,
      });
    });
  });

  describe('getPayments', () => {
    it('should call paymentsService.getPayments and return result', async () => {
      const req = { user: { userId: 1 } };
      const result = [
        {
          id: 1,
          name: 'Test Payment', // Add name
          created_at: new Date(), // Add created_at
          balance_id: 1, // Add balance_id
          user_id: req.user.userId, // Add user_id
          amount: 100,
          description: 'Test payment',
        },
      ];

      jest.spyOn(service, 'getPayments').mockResolvedValue(result);

      expect(await controller.getPayments(req)).toEqual(result);
      expect(service.getPayments).toHaveBeenCalledWith(req.user.userId);
    });
  });

  describe('getPaymentById', () => {
    it('should call paymentsService.getPaymentsById and return result', async () => {
      const req = { user: { userId: 1 } };
      const paymentId = 1;
      const result = {
        id: 1,
        name: 'Test Payment', // Add name
        created_at: new Date(), // Add created_at
        balance_id: 1, // Add balance_id
        user_id: req.user.userId, // Add user_id
        amount: 100,
        description: 'Test payment',
      };

      jest.spyOn(service, 'getPaymentsById').mockResolvedValue(result);

      expect(await controller.getPaymentById(req, paymentId)).toEqual(result);
      expect(service.getPaymentsById).toHaveBeenCalledWith(paymentId, req.user.userId);
    });
  });

  describe('updatePayment', () => {
    it('should call paymentsService.updatePayment and return result', async () => {
      const req = { user: { userId: 1 } };
      const paymentId = 1;
      const newName = 'Updated Payment';
      const result = {
        id: 1,
        name: newName,
        created_at: new Date(), // Add created_at
        balance_id: 1, // Add balance_id
        user_id: req.user.userId, // Add user_id
        amount: 100,
        description: 'Test payment',
      };

      jest.spyOn(service, 'updatePayment').mockResolvedValue(result);

      expect(await controller.updatePayment(req, paymentId, newName)).toEqual(result);
      expect(service.updatePayment).toHaveBeenCalledWith(paymentId, newName, req.user.userId);
    });
  });
});
