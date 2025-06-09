import { eq } from 'drizzle-orm';
import db from '../../../../src/Drizzle/db';
import {PaymentTable} from '../../../../src/Drizzle/schema';
import {
  createPaymentService,
  getPaymentByIdService,
  getPaymentByBookingIdService
} from '../../../../src/components/payment/payment.service';

// Mock the database
jest.mock('../../../../src/Drizzle/db', () => ({
    insert: jest.fn(),
    select: jest.fn()
}))

const mockDb = db as jest.Mocked<typeof db>;

// Mock drizzle-orm eq function
jest.mock('drizzle-orm', () => ({
  eq: jest.fn()
}));
const mockEq = eq as jest.MockedFunction<typeof eq>;

describe('Payment Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createPaymentService', () => {
    it('should create a payment successfully', async () => {
      // Arrange
      const mockPayment = {
        paymentID: 1,
        bookingID: 1,
        paymentDate: "2024-01-15",
        amount: '150.00',
        paymentMethod: 'Credit Card'
      };

      const mockInsertResult = [mockPayment];
      
      const mockInsert = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue(mockInsertResult)
      };

      mockDb.insert = jest.fn().mockReturnValue(mockInsert);

      // Act
      const result = await createPaymentService(mockPayment);

      // Assert
      expect(mockDb.insert).toHaveBeenCalledWith(PaymentTable);
      expect(mockInsert.values).toHaveBeenCalledWith(mockPayment);
      expect(mockInsert.returning).toHaveBeenCalled();
      expect(result).toEqual(mockInsertResult);
    });

    it('should handle database errors during payment creation', async () => {
      // Arrange
      const mockPayment = {
        paymentID: 1,
        bookingID: 1,
        paymentDate: '2024-01-15',
        amount: '150.00',
        paymentMethod: 'Credit Card'
      };

      const mockInsert = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockRejectedValue(new Error('Database connection failed'))
      };

      mockDb.insert = jest.fn().mockReturnValue(mockInsert);

      // Act & Assert
      await expect(createPaymentService(mockPayment)).rejects.toThrow('Database connection failed');
    });
  });

  describe('getPaymentByIdService', () => {
    it('should return payment with joined data when payment exists', async () => {
      // Arrange
      const paymentId = 1;
      const mockPaymentData = [
        {
          payment: {
            paymentID: 1,
            bookingID: 1,
            paymentDate: new Date('2024-01-15'),
            amount: '150.00',
            paymentMethod: 'Credit Card'
          },
          bookings: {
            bookingID: 1,
            carID: 1,
            customerID: 1,
            rentalStartDate: new Date('2024-01-10'),
            rentalEndDate: new Date('2024-01-20'),
            totalAmount: '300.00'
          },
          customer: {
            customerID: 1,
            userID: 1
          },
          users: {
            userID: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phoneNumber: '+1234567890',
            address: '123 Main St'
          }
        }
      ];

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        rightJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockPaymentData)
      };

      mockDb.select = jest.fn().mockReturnValue(mockSelect);
      mockEq.mockReturnValue({} as any);

      // Act
      const result = await getPaymentByIdService(paymentId);

      // Assert
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockSelect.from).toHaveBeenCalledWith(PaymentTable);
      expect(mockSelect.rightJoin).toHaveBeenCalledTimes(3);
      expect(mockSelect.where).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith(PaymentTable.paymentID, paymentId);
      expect(result).toEqual(mockPaymentData);
    });

    it('should return null when payment does not exist', async () => {
      // Arrange
      const paymentId = 999;
      
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        rightJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([])
      };

      mockDb.select = jest.fn().mockReturnValue(mockSelect);
      mockEq.mockReturnValue({} as any);

      // Act
      const result = await getPaymentByIdService(paymentId);

      // Assert
      expect(result).toEqual([]);
    });

    it('should throw error when database query fails', async () => {
      // Arrange
      const paymentId = 1;
      const dbError = new Error('Database connection timeout');
      
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        rightJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockRejectedValue(dbError)
      };

      mockDb.select = jest.fn().mockReturnValue(mockSelect);
      mockEq.mockReturnValue({} as any);

      // Act & Assert
      await expect(getPaymentByIdService(paymentId)).rejects.toThrow(
        'Get payment by ID error: Database connection timeout'
      );
    });
  });

  describe('getPaymentByBookingIdService', () => {
    it('should return payment with joined data when payment exists for booking', async () => {
      // Arrange
      const bookingId = 1;
      const mockPaymentData = [
        {
          payment: {
            paymentID: 1,
            bookingID: 1,
            paymentDate: new Date('2024-01-15'),
            amount: '150.00',
            paymentMethod: 'Credit Card'
          },
          bookings: {
            bookingID: 1,
            carID: 1,
            customerID: 1,
            rentalStartDate: new Date('2024-01-10'),
            rentalEndDate: new Date('2024-01-20'),
            totalAmount: '300.00'
          },
          customer: {
            customerID: 1,
            userID: 1
          },
          users: {
            userID: 1,
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            phoneNumber: '+1987654321',
            address: '456 Oak Ave'
          }
        }
      ];

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        rightJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockPaymentData)
      };

      mockDb.select = jest.fn().mockReturnValue(mockSelect);
      mockEq.mockReturnValue({} as any);

      // Act
      const result = await getPaymentByBookingIdService(bookingId);

      // Assert
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockSelect.from).toHaveBeenCalledWith(PaymentTable);
      expect(mockSelect.rightJoin).toHaveBeenCalledTimes(3);
      expect(mockSelect.where).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith(PaymentTable.bookingID, bookingId);
      expect(result).toEqual(mockPaymentData);
    });

    it('should return null when no payment exists for booking', async () => {
      // Arrange
      const bookingId = 999;
      
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        rightJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([])
      };

      mockDb.select = jest.fn().mockReturnValue(mockSelect);
      mockEq.mockReturnValue({} as any);

      // Act
      const result = await getPaymentByBookingIdService(bookingId);

      // Assert
      expect(result).toEqual([]);
    });

    it('should throw error when database query fails', async () => {
      // Arrange
      const bookingId = 1;
      const dbError = new Error('Network error');
      
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        rightJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockRejectedValue(dbError)
      };

      mockDb.select = jest.fn().mockReturnValue(mockSelect);
      mockEq.mockReturnValue({} as any);

      // Act & Assert
      await expect(getPaymentByBookingIdService(bookingId)).rejects.toThrow(
        'Get payment by booking ID error: Network error'
      );
    });
  });

  describe('Edge Cases and Validation', () => {
    it('should handle createPaymentService with minimal payment data', async () => {
      // Arrange
      const minimalPayment = {
        bookingID: 1,
        paymentDate: '2024-01-15',
        amount: '0.01',
        paymentID: 1,
        paymentMethod: 'Credit Card'
      };

      const mockInsertResult = [{ ...minimalPayment, paymentID: 1 }];
      
      const mockInsert = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue(mockInsertResult)
      };

      mockDb.insert = jest.fn().mockReturnValue(mockInsert);

      // Act
      const result = await createPaymentService(minimalPayment);

      // Assert
      expect(result).toEqual(mockInsertResult);
    });

    it('should handle getPaymentByIdService with zero paymentId', async () => {
      // Arrange
      const paymentId = 0;
      
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        rightJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([])
      };

      mockDb.select = jest.fn().mockReturnValue(mockSelect);
      mockEq.mockReturnValue({} as any);

      // Act
      const result = await getPaymentByIdService(paymentId);

      // Assert
      expect(mockEq).toHaveBeenCalledWith(PaymentTable.paymentID, 0);
      expect(result).toEqual([]);
    });

    it('should handle getPaymentByBookingIdService with negative bookingId', async () => {
      // Arrange
      const bookingId = -1;
      
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        rightJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([])
      };

      mockDb.select = jest.fn().mockReturnValue(mockSelect);
      mockEq.mockReturnValue({} as any);

      // Act
      const result = await getPaymentByBookingIdService(bookingId);

      // Assert
      expect(mockEq).toHaveBeenCalledWith(PaymentTable.bookingID, -1);
      expect(result).toEqual([]);
    });
  });
});