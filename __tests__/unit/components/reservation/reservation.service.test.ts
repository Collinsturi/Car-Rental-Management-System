import { eq, and, or, isNull, isNotNull, gt, gte, lte, lt } from 'drizzle-orm';
import { relations } from "drizzle-orm/relations";

import db from '../../../../src/Drizzle/db';
import { CustomerTable, ReservationTable, UsersTable, CarTable } from '../../../../src/Drizzle/schema';
import {
  getReservationByCustomerIdService,
  getReservationByCarIdService,
  getReturnedCarsService,
  getCurrentlyReservedCarsService,
  getCurrentlyReservedCarsByCustomerService,
  createReservationService
} from '../../../../src/components/reservation/reservation.service';

// Mock the database
jest.mock('../../../../src/Drizzle/db');
const mockDb = db as jest.Mocked<typeof db>;

// Mock drizzle-orm functions
jest.mock('drizzle-orm', () => ({
  eq: jest.fn(),
  and: jest.fn(),
  or: jest.fn(),
  isNull: jest.fn(),
  isNotNull: jest.fn(),
  gt: jest.fn(),
  gte: jest.fn(),
  lte: jest.fn(),
  lt: jest.fn()
}));

const mockEq = eq as jest.MockedFunction<typeof eq>;
const mockAnd = and as jest.MockedFunction<typeof and>;
const mockOr = or as jest.MockedFunction<typeof or>;
const mockIsNull = isNull as jest.MockedFunction<typeof isNull>;
const mockIsNotNull = isNotNull as jest.MockedFunction<typeof isNotNull>;
const mockGt = gt as jest.MockedFunction<typeof gt>;
const mockLte = lte as jest.MockedFunction<typeof lte>;
const mockLt = lt as jest.MockedFunction<typeof lt>;

// Mock Date
const mockDate = '2024-01-15';
jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(`${mockDate}T10:30:00.000Z`);

describe('Reservation Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mock returns
    mockEq.mockReturnValue({} as any);
    mockAnd.mockReturnValue({} as any);
    mockOr.mockReturnValue({} as any);
    mockIsNull.mockReturnValue({} as any);
    mockIsNotNull.mockReturnValue({} as any);
    mockGt.mockReturnValue({} as any);
    mockLte.mockReturnValue({} as any);
    mockLt.mockReturnValue({} as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockReservationData = [
    {
      reservation: {
        reservationID: 1,
        customerID: 1,
        carID: 1,
        reservationDate: new Date('2024-01-10'),
        pickupDate: new Date('2024-01-12'),
        returnDate: new Date('2024-01-20')
      },
      customer: {
        customerID: 1,
        userID: 1
      },
      users: {
        userID: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      },
      car: {
        carID: 1,
        carModel: 'Toyota Camry',
        year: new Date('2023-01-01'),
        color: 'Blue',
        rentalRate: '50.00',
        availability: true
      }
    }
  ];

  describe('getReservationByCustomerIdService', () => {
    it('should return reservations for a specific customer', async () => {
      // Arrange
      const customerId = 1;
      
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        rightJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockReservationData)
      };

      mockDb.select = jest.fn().mockReturnValue(mockSelect);

      // Act
      const result = await getReservationByCustomerIdService(customerId);

      // Assert
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockSelect.from).toHaveBeenCalledWith(ReservationTable);
      expect(mockSelect.rightJoin).toHaveBeenCalledTimes(3);
      expect(mockSelect.where).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith(ReservationTable.customerID, customerId);
      expect(result).toEqual(mockReservationData);
    });

    it('should return empty array when customer has no reservations', async () => {
      // Arrange
      const customerId = 999;
      
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        rightJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([])
      };

      mockDb.select = jest.fn().mockReturnValue(mockSelect);

      // Act
      const result = await getReservationByCustomerIdService(customerId);

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      // Arrange
      const customerId = 1;
      const dbError = new Error('Database connection failed');
      
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        rightJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockRejectedValue(dbError)
      };

      mockDb.select = jest.fn().mockReturnValue(mockSelect);

      // Act & Assert
      await expect(getReservationByCustomerIdService(customerId)).rejects.toThrow('Database connection failed');
    });
  });

  describe('getReservationByCarIdService', () => {
    it('should return reservations for a specific car', async () => {
      // Arrange
      const carId = 1;
      
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        rightJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockReservationData)
      };

      mockDb.select = jest.fn().mockReturnValue(mockSelect);

      // Act
      const result = await getReservationByCarIdService(carId);

      // Assert
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockSelect.from).toHaveBeenCalledWith(ReservationTable);
      expect(mockSelect.rightJoin).toHaveBeenCalledTimes(3);
      expect(mockSelect.where).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith(ReservationTable.carID, carId);
      expect(result).toEqual(mockReservationData);
    });

    it('should return empty array when car has no reservations', async () => {
      // Arrange
      const carId = 999;
      
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        rightJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([])
      };

      mockDb.select = jest.fn().mockReturnValue(mockSelect);

      // Act
      const result = await getReservationByCarIdService(carId);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getReturnedCarsService', () => {
    it('should return cars that have been returned', async () => {
      // Arrange
      const returnedCarsData = [
        {
          ...mockReservationData[0],
          reservation: {
            ...mockReservationData[0].reservation,
            returnDate: new Date('2024-01-10') // Past date
          }
        }
      ];
      
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        rightJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(returnedCarsData)
      };

      mockDb.select = jest.fn().mockReturnValue(mockSelect);

      // Act
      const result = await getReturnedCarsService();

      // Assert
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockSelect.from).toHaveBeenCalledWith(ReservationTable);
      expect(mockSelect.rightJoin).toHaveBeenCalledTimes(3);
      expect(mockSelect.where).toHaveBeenCalled();
      expect(mockAnd).toHaveBeenCalled();
      expect(mockIsNotNull).toHaveBeenCalledWith(ReservationTable.returnDate);
      expect(mockLt).toHaveBeenCalledWith(ReservationTable.returnDate, mockDate);
      expect(result).toEqual(returnedCarsData);
    });

    it('should return empty array when no cars have been returned', async () => {
      // Arrange
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        rightJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([])
      };

      mockDb.select = jest.fn().mockReturnValue(mockSelect);

      // Act
      const result = await getReturnedCarsService();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getCurrentlyReservedCarsService', () => {
    it('should return currently reserved cars', async () => {
      // Arrange
      const currentlyReservedData = [
        {
          ...mockReservationData[0],
          reservation: {
            ...mockReservationData[0].reservation,
            pickupDate: new Date('2024-01-14'),
            returnDate: null // Not returned yet
          }
        }
      ];
      
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        rightJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(currentlyReservedData)
      };

      mockDb.select = jest.fn().mockReturnValue(mockSelect);

      // Act
      const result = await getCurrentlyReservedCarsService();

      // Assert
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockSelect.from).toHaveBeenCalledWith(ReservationTable);
      expect(mockSelect.rightJoin).toHaveBeenCalledTimes(3);
      expect(mockSelect.where).toHaveBeenCalled();
      expect(mockAnd).toHaveBeenCalled();
      expect(mockLte).toHaveBeenCalledWith(ReservationTable.pickupDate, mockDate);
      expect(mockOr).toHaveBeenCalled();
      expect(mockIsNull).toHaveBeenCalledWith(ReservationTable.returnDate);
      expect(mockGt).toHaveBeenCalledWith(ReservationTable.returnDate, mockDate);
      expect(result).toEqual(currentlyReservedData);
    });

    it('should return empty array when no cars are currently reserved', async () => {
      // Arrange
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        rightJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([])
      };

      mockDb.select = jest.fn().mockReturnValue(mockSelect);

      // Act
      const result = await getCurrentlyReservedCarsService();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getCurrentlyReservedCarsByCustomerService', () => {
    it('should return currently reserved cars for a specific customer', async () => {
      // Arrange
      const customerName = 'John';
      const mockCustomer = {
        userID: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };

      const mockQuery = {
        UsersTable: {
          findFirst: jest.fn().mockResolvedValue(mockCustomer)
        }
      };

      mockDb.query = mockQuery as any;

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        rightJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockReservationData)
      };

      mockDb.select = jest.fn().mockReturnValue(mockSelect);

      // Act
      const result = await getCurrentlyReservedCarsByCustomerService(customerName);

      // Assert
      expect(mockQuery.UsersTable.findFirst).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith(UsersTable.firstName, customerName);
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockSelect.from).toHaveBeenCalledWith(ReservationTable);
      expect(mockSelect.rightJoin).toHaveBeenCalledTimes(3);
      expect(mockSelect.where).toHaveBeenCalled();
      expect(mockAnd).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith(ReservationTable.customerID, mockCustomer.userID);
      expect(mockOr).toHaveBeenCalled();
      expect(mockIsNull).toHaveBeenCalledWith(ReservationTable.returnDate);
      expect(result).toEqual(mockReservationData);
    });

    it('should throw error when customer is not found', async () => {
      // Arrange
      const customerName = 'NonExistent';

      const mockQuery = {
        UsersTable: {
          findFirst: jest.fn().mockResolvedValue(null)
        }
      };

      mockDb.query = mockQuery as any;

      // Act & Assert
      await expect(getCurrentlyReservedCarsByCustomerService(customerName))
        .rejects.toThrow('Customer not found');

      expect(mockQuery.UsersTable.findFirst).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith(UsersTable.firstName, customerName);
    });

    it('should handle database errors when finding customer', async () => {
      // Arrange
      const customerName = 'John';
      const dbError = new Error('Database query failed');

      const mockQuery = {
        UsersTable: {
          findFirst: jest.fn().mockRejectedValue(dbError)
        }
      };

      mockDb.query = mockQuery as any;

      // Act & Assert
      await expect(getCurrentlyReservedCarsByCustomerService(customerName))
        .rejects.toThrow('Database query failed');
    });
  });

  describe('createReservationService', () => {
    it('should create a reservation successfully', async () => {
      // Arrange
      const mockReservation = {
        reservationID: 1,
        customerID: 1,
        carID: 1,
        reservationDate: '2024-01-10',
        pickupDate: '2024-01-12',
        returnDate: '2024-01-20'
      };

      const mockInsertResult = [mockReservation];
      
      const mockInsert = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue(mockInsertResult)
      };

      mockDb.insert = jest.fn().mockReturnValue(mockInsert);

      // Act
      const result = await createReservationService(mockReservation);

      // Assert
      expect(mockDb.insert).toHaveBeenCalledWith(ReservationTable);
      expect(mockInsert.values).toHaveBeenCalledWith(mockReservation);
      expect(mockInsert.returning).toHaveBeenCalled();
      expect(result).toEqual(mockInsertResult);
    });

    it('should handle database errors during reservation creation', async () => {
      // Arrange
      const mockReservation = {
        reservationID: 1,
        customerID: 1,
        carID: 1,
        reservationDate: '2024-01-10',
        pickupDate: '2024-01-12',
        returnDate: '2024-01-20'
      };

      const mockInsert = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockRejectedValue(new Error('Constraint violation'))
      };

      mockDb.insert = jest.fn().mockReturnValue(mockInsert);

      // Act & Assert
      await expect(createReservationService(mockReservation)).rejects.toThrow('Constraint violation');
    });

    // it('should create reservation with minimal required data', async () => {
    //   // Arrange
    //   const minimalReservation = {
    //     customerID: 1,
    //     carID: 1,
    //     reservationDate: '2024-01-10',
    //     pickupDate: '2024-01-12'
        
    //   };

    //   const mockInsertResult = [{ ...minimalReservation, reservationID: 1 }];
      
    //   const mockInsert = {
    //     values: jest.fn().mockReturnThis(),
    //     returning: jest.fn().mockResolvedValue(mockInsertResult)
    //   };

    //   mockDb.insert = jest.fn().mockReturnValue(mockInsert);

    //   // Act
    //   const result = await createReservationService(minimalReservation);

    //   // Assert
    //   expect(mockDb.insert).toHaveBeenCalledWith(ReservationTable);
    //   expect(mockInsert.values).toHaveBeenCalledWith(minimalReservation);
    //   expect(result).toEqual(mockInsertResult);
    // });
  });

  describe('Edge Cases and Validation', () => {
    it('should handle zero customer ID in getReservationByCustomerIdService', async () => {
      // Arrange
      const customerId = 0;
      
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        rightJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([])
      };

      mockDb.select = jest.fn().mockReturnValue(mockSelect);

      // Act
      const result = await getReservationByCustomerIdService(customerId);

      // Assert
      expect(mockEq).toHaveBeenCalledWith(ReservationTable.customerID, 0);
      expect(result).toEqual([]);
    });

    it('should handle negative car ID in getReservationByCarIdService', async () => {
      // Arrange
      const carId = -1;
      
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        rightJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([])
      };

      mockDb.select = jest.fn().mockReturnValue(mockSelect);

      // Act
      const result = await getReservationByCarIdService(carId);

      // Assert
      expect(mockEq).toHaveBeenCalledWith(ReservationTable.carID, -1);
      expect(result).toEqual([]);
    });

    it('should handle empty customer name in getCurrentlyReservedCarsByCustomerService', async () => {
      // Arrange
      const customerName = '';

      const mockQuery = {
        UsersTable: {
          findFirst: jest.fn().mockResolvedValue(null)
        }
      };

      mockDb.query = mockQuery as any;

      // Act & Assert
      await expect(getCurrentlyReservedCarsByCustomerService(customerName))
        .rejects.toThrow('Customer not found');

      expect(mockEq).toHaveBeenCalledWith(UsersTable.firstName, '');
    });
  });
});