// import { eq, and, or, isNull, isNotNull, gt, gte, lte, lt } from 'drizzle-orm';
// import db from '../../../../src/Drizzle/db';
// import { CustomerTable, ReservationTable, UsersTable, CarTable } from '../../../../src/Drizzle/schema';
// import {
//   getReservationByCustomerIdService,
//   getReservationByCarIdService,
//   getReturnedCarsService,
//   getCurrentlyReservedCarsService,
//   getCurrentlyReservedCarsByCustomerService,
//   createReservationService
// } from '../../../../src/components/reservation/reservation.service';
//
// // Mock the database
// jest.mock('../../../../src/Drizzle/db');
// const mockDb = db as jest.Mocked<typeof db>;
//
// // Mock drizzle-orm functions
// jest.mock('drizzle-orm', () => ({
//   eq: jest.fn(),
//   and: jest.fn(),
//   or: jest.fn(),
//   isNull: jest.fn(),
//   isNotNull: jest.fn(),
//   gt: jest.fn(),
//   gte: jest.fn(),
//   lte: jest.fn(),
//   lt: jest.fn()
// }));
//
// const mockEq = eq as jest.MockedFunction<typeof eq>;
// const mockAnd = and as jest.MockedFunction<typeof and>;
// const mockOr = or as jest.MockedFunction<typeof or>;
// const mockIsNull = isNull as jest.MockedFunction<typeof isNull>;
// const mockIsNotNull = isNotNull as jest.MockedFunction<typeof isNotNull>;
// const mockGt = gt as jest.MockedFunction<typeof gt>;
// const mockLte = lte as jest.MockedFunction<typeof lte>;
// const mockLt = lt as jest.MockedFunction<typeof lt>;
//
// // Mock Date.prototype.toISOString
// const mockDate = '2024-01-15';
// const originalDate = Date;
// const mockToISOString = jest.fn().mockReturnValue(`${mockDate}T10:30:00.000Z`);
//
// // Mock console.log to avoid output during tests
// const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
//
// describe('Reservation Service', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     // Setup default mock returns for drizzle-orm functions
//     mockEq.mockReturnValue('eq_condition' as any);
//     mockAnd.mockReturnValue('and_condition' as any);
//     mockOr.mockReturnValue('or_condition' as any);
//     mockIsNull.mockReturnValue('isNull_condition' as any);
//     mockIsNotNull.mockReturnValue('isNotNull_condition' as any);
//     mockGt.mockReturnValue('gt_condition' as any);
//     mockLte.mockReturnValue('lte_condition' as any);
//     mockLt.mockReturnValue('lt_condition' as any);
//
//     // Mock Date constructor and prototype
//     global.Date = jest.fn().mockImplementation(() => ({
//       toISOString: mockToISOString
//     })) as any;
//     global.Date.prototype.toISOString = mockToISOString;
//   });
//
//   afterEach(() => {
//     jest.resetAllMocks();
//     global.Date = originalDate;
//   });
//
//   afterAll(() => {
//     mockConsoleLog.mockRestore();
//   });
//
//   const mockReservationData = [
//     {
//       reservation: {
//         reservationID: 1,
//         customerID: 1,
//         carID: 1,
//         reservationDate: new Date('2024-01-10'),
//         pickupDate: new Date('2024-01-12'),
//         returnDate: new Date('2024-01-20')
//       },
//       customer: {
//         customerID: 1,
//         userID: 1
//       },
//       users: {
//         userID: 1,
//         firstName: 'John',
//         lastName: 'Doe',
//         email: 'john.doe@example.com'
//       },
//       car: {
//         carID: 1,
//         carModel: 'Toyota Camry',
//         year: new Date('2023-01-01'),
//         color: 'Blue',
//         rentalRate: '50.00',
//         availability: true
//       }
//     }
//   ];
//
//   describe('getReservationByCustomerIdService', () => {
//     it('should return reservations for a specific customer', async () => {
//       // Arrange
//       const customerId = 1;
//
//       const mockSelect = {
//         from: jest.fn().mockReturnThis(),
//         rightJoin: jest.fn().mockReturnThis(),
//         where: jest.fn().mockResolvedValue(mockReservationData)
//       };
//
//       mockDb.select = jest.fn().mockReturnValue(mockSelect);
//
//       // Act
//       const result = await getReservationByCustomerIdService(customerId);
//
//       // Assert
//       expect(mockDb.select).toHaveBeenCalled();
//       expect(mockSelect.from).toHaveBeenCalledWith(ReservationTable);
//       expect(mockSelect.rightJoin).toHaveBeenCalledTimes(3);
//       expect(mockSelect.where).toHaveBeenCalledWith('eq_condition');
//       expect(mockEq).toHaveBeenCalledWith(ReservationTable.customerID, customerId);
//       expect(result).toEqual(mockReservationData);
//     });
//
//     it('should return empty array when customer has no reservations', async () => {
//       // Arrange
//       const customerId = 999;
//
//       const mockSelect = {
//         from: jest.fn().mockReturnThis(),
//         rightJoin: jest.fn().mockReturnThis(),
//         where: jest.fn().mockResolvedValue([])
//       };
//
//       mockDb.select = jest.fn().mockReturnValue(mockSelect);
//
//       // Act
//       const result = await getReservationByCustomerIdService(customerId);
//
//       // Assert
//       expect(result).toEqual([]);
//     });
//
//     it('should handle database errors', async () => {
//       // Arrange
//       const customerId = 1;
//       const dbError = new Error('Database connection failed');
//
//       const mockSelect = {
//         from: jest.fn().mockReturnThis(),
//         rightJoin: jest.fn().mockReturnThis(),
//         where: jest.fn().mockRejectedValue(dbError)
//       };
//
//       mockDb.select = jest.fn().mockReturnValue(mockSelect);
//
//       // Act & Assert
//       await expect(getReservationByCustomerIdService(customerId)).rejects.toThrow('Database connection failed');
//     });
//
//     it('should handle zero customer ID', async () => {
//       // Arrange
//       const customerId = 0;
//
//       const mockSelect = {
//         from: jest.fn().mockReturnThis(),
//         rightJoin: jest.fn().mockReturnThis(),
//         where: jest.fn().mockResolvedValue([])
//       };
//
//       mockDb.select = jest.fn().mockReturnValue(mockSelect);
//
//       // Act
//       const result = await getReservationByCustomerIdService(customerId);
//
//       // Assert
//       expect(mockEq).toHaveBeenCalledWith(ReservationTable.customerID, 0);
//       expect(result).toEqual([]);
//     });
//
//     it('should handle negative customer ID', async () => {
//       // Arrange
//       const customerId = -1;
//
//       const mockSelect = {
//         from: jest.fn().mockReturnThis(),
//         rightJoin: jest.fn().mockReturnThis(),
//         where: jest.fn().mockResolvedValue([])
//       };
//
//       mockDb.select = jest.fn().mockReturnValue(mockSelect);
//
//       // Act
//       const result = await getReservationByCustomerIdService(customerId);
//
//       // Assert
//       expect(mockEq).toHaveBeenCalledWith(ReservationTable.customerID, -1);
//       expect(result).toEqual([]);
//     });
//   });
//
//   describe('getReservationByCarIdService', () => {
//     it('should return reservations for a specific car', async () => {
//       // Arrange
//       const carId = 1;
//
//       const mockSelect = {
//         from: jest.fn().mockReturnThis(),
//         rightJoin: jest.fn().mockReturnThis(),
//         where: jest.fn().mockResolvedValue(mockReservationData)
//       };
//
//       mockDb.select = jest.fn().mockReturnValue(mockSelect);
//
//       // Act
//       const result = await getReservationByCarIdService(carId);
//
//       // Assert
//       expect(mockDb.select).toHaveBeenCalled();
//       expect(mockSelect.from).toHaveBeenCalledWith(ReservationTable);
//       expect(mockSelect.rightJoin).toHaveBeenCalledTimes(3);
//       expect(mockSelect.where).toHaveBeenCalledWith('eq_condition');
//       expect(mockEq).toHaveBeenCalledWith(ReservationTable.carID, carId);
//       expect(result).toEqual(mockReservationData);
//     });
//
//     it('should return empty array when car has no reservations', async () => {
//       // Arrange
//       const carId = 999;
//
//       const mockSelect = {
//         from: jest.fn().mockReturnThis(),
//         rightJoin: jest.fn().mockReturnThis(),
//         where: jest.fn().mockResolvedValue([])
//       };
//
//       mockDb.select = jest.fn().mockReturnValue(mockSelect);
//
//       // Act
//       const result = await getReservationByCarIdService(carId);
//
//       // Assert
//       expect(result).toEqual([]);
//     });
//
//     it('should handle database errors', async () => {
//       // Arrange
//       const carId = 1;
//       const dbError = new Error('Database timeout');
//
//       const mockSelect = {
//         from: jest.fn().mockReturnThis(),
//         rightJoin: jest.fn().mockReturnThis(),
//         where: jest.fn().mockRejectedValue(dbError)
//       };
//
//       mockDb.select = jest.fn().mockReturnValue(mockSelect);
//
//       // Act & Assert
//       await expect(getReservationByCarIdService(carId)).rejects.toThrow('Database timeout');
//     });
//
//     it('should handle zero car ID', async () => {
//       // Arrange
//       const carId = 0;
//
//       const mockSelect = {
//         from: jest.fn().mockReturnThis(),
//         rightJoin: jest.fn().mockReturnThis(),
//         where: jest.fn().mockResolvedValue([])
//       };
//
//       mockDb.select = jest.fn().mockReturnValue(mockSelect);
//
//       // Act
//       const result = await getReservationByCarIdService(carId);
//
//       // Assert
//       expect(mockEq).toHaveBeenCalledWith(ReservationTable.carID, 0);
//       expect(result).toEqual([]);
//     });
//
//     it('should handle negative car ID', async () => {
//       // Arrange
//       const carId = -1;
//
//       const mockSelect = {
//         from: jest.fn().mockReturnThis(),
//         rightJoin: jest.fn().mockReturnThis(),
//         where: jest.fn().mockResolvedValue([])
//       };
//
//       mockDb.select = jest.fn().mockReturnValue(mockSelect);
//
//       // Act
//       const result = await getReservationByCarIdService(carId);
//
//       // Assert
//       expect(mockEq).toHaveBeenCalledWith(ReservationTable.carID, -1);
//       expect(result).toEqual([]);
//     });
//   });
//
//   // describe('getReturnedCarsService', () => {
//   //   it('should return cars that have been returned', async () => {
//   //     // Arrange
//   //     const returnedCarsData = [
//   //       {
//   //         ...mockReservationData[0],
//   //         reservation: {
//   //           ...mockReservationData[0].reservation,
//   //           returnDate: new Date('2024-01-10') // Past date
//   //         }
//   //       }
//   //     ];
//
//   //     const mockSelect = {
//   //       from: jest.fn().mockReturnThis(),
//   //       rightJoin: jest.fn().mockReturnThis(),
//   //       where: jest.fn().mockResolvedValue(returnedCarsData)
//   //     };
//
//   //     mockDb.select = jest.fn().mockReturnValue(mockSelect);
//
//   //     // Act
//   //     const result = await getReturnedCarsService();
//
//   //     // Assert
//   //     expect(mockDb.select).toHaveBeenCalled();
//   //     expect(mockSelect.from).toHaveBeenCalledWith(ReservationTable);
//   //     expect(mockSelect.rightJoin).toHaveBeenCalledTimes(3);
//   //     expect(mockSelect.where).toHaveBeenCalledWith('and_condition');
//   //     expect(mockAnd).toHaveBeenCalledWith('isNotNull_condition', 'lt_condition');
//   //     expect(mockIsNotNull).toHaveBeenCalledWith(ReservationTable.returnDate);
//   //     expect(mockLt).toHaveBeenCalledWith(ReservationTable.returnDate, mockDate);
//   //     expect(result).toEqual(returnedCarsData);
//   //   });
//
//   //   it('should return empty array when no cars have been returned', async () => {
//   //     // Arrange
//   //     const mockSelect = {
//   //       from: jest.fn().mockReturnThis(),
//   //       rightJoin: jest.fn().mockReturnThis(),
//   //       where: jest.fn().mockResolvedValue([])
//   //     };
//
//   //     mockDb.select = jest.fn().mockReturnValue(mockSelect);
//
//   //     // Act
//   //     const result = await getReturnedCarsService();
//
//   //     // Assert
//   //     expect(result).toEqual([]);
//   //   });
//
//   //   it('should handle database errors', async () => {
//   //     // Arrange
//   //     const dbError = new Error('Query failed');
//
//   //     const mockSelect = {
//   //       from: jest.fn().mockReturnThis(),
//   //       rightJoin: jest.fn().mockReturnThis(),
//   //       where: jest.fn().mockRejectedValue(dbError)
//   //     };
//
//   //     mockDb.select = jest.fn().mockReturnValue(mockSelect);
//
//   //     // Act & Assert
//   //     await expect(getReturnedCarsService()).rejects.toThrow('Query failed');
//   //   });
//
//   //   it('should use current date for comparison', async () => {
//   //     // Arrange
//   //     const mockSelect = {
//   //       from: jest.fn().mockReturnThis(),
//   //       rightJoin: jest.fn().mockReturnThis(),
//   //       where: jest.fn().mockResolvedValue([])
//   //     };
//
//   //     mockDb.select = jest.fn().mockReturnValue(mockSelect);
//
//   //     // Act
//   //     await getReturnedCarsService();
//
//   //     // Assert
//   //     expect(mockToISOString).toHaveBeenCalled();
//   //     expect(mockLt).toHaveBeenCalledWith(ReservationTable.returnDate, mockDate);
//   //   });
//   // });
//
//   // describe('getCurrentlyReservedCarsService', () => {
//   //   it('should return currently reserved cars', async () => {
//   //     // Arrange
//   //     const currentlyReservedData = [
//   //       {
//   //         ...mockReservationData[0],
//   //         reservation: {
//   //           ...mockReservationData[0].reservation,
//   //           pickupDate: new Date('2024-01-14'),
//   //           returnDate: null // Not returned yet
//   //         }
//   //       }
//   //     ];
//
//   //     const mockSelect = {
//   //       from: jest.fn().mockReturnThis(),
//   //       rightJoin: jest.fn().mockReturnThis(),
//   //       where: jest.fn().mockResolvedValue(currentlyReservedData)
//   //     };
//
//   //     mockDb.select = jest.fn().mockReturnValue(mockSelect);
//
//   //     // Act
//   //     const result = await getCurrentlyReservedCarsService();
//
//   //     // Assert
//   //     expect(mockDb.select).toHaveBeenCalled();
//   //     expect(mockSelect.from).toHaveBeenCalledWith(ReservationTable);
//   //     expect(mockSelect.rightJoin).toHaveBeenCalledTimes(3);
//   //     expect(mockSelect.where).toHaveBeenCalledWith('and_condition');
//   //     expect(mockAnd).toHaveBeenCalledWith('lte_condition', 'or_condition');
//   //     expect(mockLte).toHaveBeenCalledWith(ReservationTable.pickupDate, mockDate);
//   //     expect(mockOr).toHaveBeenCalledWith('isNull_condition', 'gt_condition');
//   //     expect(mockIsNull).toHaveBeenCalledWith(ReservationTable.returnDate);
//   //     expect(mockGt).toHaveBeenCalledWith(ReservationTable.returnDate, mockDate);
//   //     expect(result).toEqual(currentlyReservedData);
//   //   });
//
//   //   it('should return empty array when no cars are currently reserved', async () => {
//   //     // Arrange
//   //     const mockSelect = {
//   //       from: jest.fn().mockReturnThis(),
//   //       rightJoin: jest.fn().mockReturnThis(),
//   //       where: jest.fn().mockResolvedValue([])
//   //     };
//
//   //     mockDb.select = jest.fn().mockReturnValue(mockSelect);
//
//   //     // Act
//   //     const result = await getCurrentlyReservedCarsService();
//
//   //     // Assert
//   //     expect(result).toEqual([]);
//   //   });
//
//   //   it('should handle database errors', async () => {
//   //     // Arrange
//   //     const dbError = new Error('Connection lost');
//
//   //     const mockSelect = {
//   //       from: jest.fn().mockReturnThis(),
//   //       rightJoin: jest.fn().mockReturnThis(),
//   //       where: jest.fn().mockRejectedValue(dbError)
//   //     };
//
//   //     mockDb.select = jest.fn().mockReturnValue(mockSelect);
//
//   //     // Act & Assert
//   //     await expect(getCurrentlyReservedCarsService()).rejects.toThrow('Connection lost');
//   //   });
//
//   //   it('should use current date for comparison', async () => {
//   //     // Arrange
//   //     const mockSelect = {
//   //       from: jest.fn().mockReturnThis(),
//   //       rightJoin: jest.fn().mockReturnThis(),
//   //       where: jest.fn().mockResolvedValue([])
//   //     };
//
//   //     mockDb.select = jest.fn().mockReturnValue(mockSelect);
//
//   //     // Act
//   //     await getCurrentlyReservedCarsService();
//
//   //     // Assert
//   //     expect(mockToISOString).toHaveBeenCalled();
//   //     expect(mockLte).toHaveBeenCalledWith(ReservationTable.pickupDate, mockDate);
//   //     expect(mockGt).toHaveBeenCalledWith(ReservationTable.returnDate, mockDate);
//   //   });
//   // });
//
//   describe('getCurrentlyReservedCarsByCustomerService', () => {
//     it('should return currently reserved cars for a specific customer', async () => {
//       // Arrange
//       const customerName = 'John';
//       const mockCustomer = {
//         userID: 1,
//         firstName: 'John',
//         lastName: 'Doe',
//         email: 'john.doe@example.com'
//       };
//
//       const mockQuery = {
//         UsersTable: {
//           findFirst: jest.fn().mockResolvedValue(mockCustomer)
//         }
//       };
//
//       mockDb.query = mockQuery as any;
//
//       const mockSelect = {
//         from: jest.fn().mockReturnThis(),
//         rightJoin: jest.fn().mockReturnThis(),
//         where: jest.fn().mockResolvedValue(mockReservationData)
//       };
//
//       mockDb.select = jest.fn().mockReturnValue(mockSelect);
//
//       // Act
//       const result = await getCurrentlyReservedCarsByCustomerService(customerName);
//
//       // Assert
//       expect(mockConsoleLog).toHaveBeenCalledWith(mockCustomer);
//       expect(mockQuery.UsersTable.findFirst).toHaveBeenCalledWith({
//         where: 'eq_condition'
//       });
//       expect(mockEq).toHaveBeenCalledWith(UsersTable.firstName, customerName);
//       expect(mockDb.select).toHaveBeenCalled();
//       expect(mockSelect.from).toHaveBeenCalledWith(ReservationTable);
//       expect(mockSelect.rightJoin).toHaveBeenCalledTimes(3);
//       expect(mockSelect.where).toHaveBeenCalledWith('and_condition');
//       expect(mockAnd).toHaveBeenCalledWith('eq_condition', 'or_condition');
//       expect(mockEq).toHaveBeenCalledWith(ReservationTable.customerID, mockCustomer.userID);
//       expect(mockOr).toHaveBeenCalledWith('isNull_condition');
//       expect(mockIsNull).toHaveBeenCalledWith(ReservationTable.returnDate);
//       expect(result).toEqual(mockReservationData);
//     });
//
//     it('should throw error when customer is not found', async () => {
//       // Arrange
//       const customerName = 'NonExistent';
//
//       const mockQuery = {
//         UsersTable: {
//           findFirst: jest.fn().mockResolvedValue(null)
//         }
//       };
//
//       mockDb.query = mockQuery as any;
//
//       // Act & Assert
//       await expect(getCurrentlyReservedCarsByCustomerService(customerName))
//         .rejects.toThrow('Customer not found');
//
//       expect(mockQuery.UsersTable.findFirst).toHaveBeenCalledWith({
//         where: 'eq_condition'
//       });
//       expect(mockEq).toHaveBeenCalledWith(UsersTable.firstName, customerName);
//     });
//
//     it('should handle database errors when finding customer', async () => {
//       // Arrange
//       const customerName = 'John';
//       const dbError = new Error('Database query failed');
//
//       const mockQuery = {
//         UsersTable: {
//           findFirst: jest.fn().mockRejectedValue(dbError)
//         }
//       };
//
//       mockDb.query = mockQuery as any;
//
//       // Act & Assert
//       await expect(getCurrentlyReservedCarsByCustomerService(customerName))
//         .rejects.toThrow('Database query failed');
//     });
//
//     it('should handle database errors when getting reservations', async () => {
//       // Arrange
//       const customerName = 'John';
//       const mockCustomer = {
//         userID: 1,
//         firstName: 'John',
//         lastName: 'Doe',
//         email: 'john.doe@example.com'
//       };
//
//       const mockQuery = {
//         UsersTable: {
//           findFirst: jest.fn().mockResolvedValue(mockCustomer)
//         }
//       };
//
//       mockDb.query = mockQuery as any;
//
//       const mockSelect = {
//         from: jest.fn().mockReturnThis(),
//         rightJoin: jest.fn().mockReturnThis(),
//         where: jest.fn().mockRejectedValue(new Error('Reservation query failed'))
//       };
//
//       mockDb.select = jest.fn().mockReturnValue(mockSelect);
//
//       // Act & Assert
//       await expect(getCurrentlyReservedCarsByCustomerService(customerName))
//         .rejects.toThrow('Reservation query failed');
//     });
//
//     it('should handle empty customer name', async () => {
//       // Arrange
//       const customerName = '';
//
//       const mockQuery = {
//         UsersTable: {
//           findFirst: jest.fn().mockResolvedValue(null)
//         }
//       };
//
//       mockDb.query = mockQuery as any;
//
//       // Act & Assert
//       await expect(getCurrentlyReservedCarsByCustomerService(customerName))
//         .rejects.toThrow('Customer not found');
//
//       expect(mockEq).toHaveBeenCalledWith(UsersTable.firstName, '');
//     });
//
//     it('should handle whitespace-only customer name', async () => {
//       // Arrange
//       const customerName = '   ';
//
//       const mockQuery = {
//         UsersTable: {
//           findFirst: jest.fn().mockResolvedValue(null)
//         }
//       };
//
//       mockDb.query = mockQuery as any;
//
//       // Act & Assert
//       await expect(getCurrentlyReservedCarsByCustomerService(customerName))
//         .rejects.toThrow('Customer not found');
//
//       expect(mockEq).toHaveBeenCalledWith(UsersTable.firstName, '   ');
//     });
//
//     it('should return empty array when customer has no current reservations', async () => {
//       // Arrange
//       const customerName = 'John';
//       const mockCustomer = {
//         userID: 1,
//         firstName: 'John',
//         lastName: 'Doe',
//         email: 'john.doe@example.com'
//       };
//
//       const mockQuery = {
//         UsersTable: {
//           findFirst: jest.fn().mockResolvedValue(mockCustomer)
//         }
//       };
//
//       mockDb.query = mockQuery as any;
//
//       const mockSelect = {
//         from: jest.fn().mockReturnThis(),
//         rightJoin: jest.fn().mockReturnThis(),
//         where: jest.fn().mockResolvedValue([])
//       };
//
//       mockDb.select = jest.fn().mockReturnValue(mockSelect);
//
//       // Act
//       const result = await getCurrentlyReservedCarsByCustomerService(customerName);
//
//       // Assert
//       expect(result).toEqual([]);
//     });
//   });
//
//   describe('createReservationService', () => {
//     it('should create a reservation successfully', async () => {
//       // Arrange
//       const mockReservation = {
//         reservationID: 1,
//         customerID: 1,
//         carID: 1,
//         reservationDate: '2024-01-10',
//         pickupDate: '2024-01-12',
//         returnDate: '2024-01-20'
//       };
//
//       const mockInsertResult = [mockReservation];
//
//       const mockInsert = {
//         values: jest.fn().mockReturnThis(),
//         returning: jest.fn().mockResolvedValue(mockInsertResult)
//       };
//
//       mockDb.insert = jest.fn().mockReturnValue(mockInsert);
//
//       // Act
//       const result = await createReservationService(mockReservation);
//
//       // Assert
//       expect(mockDb.insert).toHaveBeenCalledWith(ReservationTable);
//       expect(mockInsert.values).toHaveBeenCalledWith(mockReservation);
//       expect(mockInsert.returning).toHaveBeenCalled();
//       expect(result).toEqual(mockInsertResult);
//     });
//
//     it('should handle database errors during reservation creation', async () => {
//       // Arrange
//       const mockReservation = {
//         reservationID: 1,
//         customerID: 1,
//         carID: 1,
//         reservationDate: '2024-01-10',
//         pickupDate: '2024-01-12',
//         returnDate: '2024-01-20'
//       };
//
//       const mockInsert = {
//         values: jest.fn().mockReturnThis(),
//         returning: jest.fn().mockRejectedValue(new Error('Constraint violation'))
//       };
//
//       mockDb.insert = jest.fn().mockReturnValue(mockInsert);
//
//       // Act & Assert
//       await expect(createReservationService(mockReservation)).rejects.toThrow('Constraint violation');
//     });
//
//     it('should create reservation with minimal required data', async () => {
//       // Arrange
//       const minimalReservation = {
//         customerID: 1,
//         carID: 1,
//         reservationDate: '2024-01-10',
//         pickupDate: '2024-01-12'
//       };
//
//       const mockInsertResult = [{ ...minimalReservation, reservationID: 1 }];
//
//       const mockInsert = {
//         values: jest.fn().mockReturnThis(),
//         returning: jest.fn().mockResolvedValue(mockInsertResult)
//       };
//
//       mockDb.insert = jest.fn().mockReturnValue(mockInsert);
//
//       // Act
//       const result = await createReservationService(minimalReservation);
//
//       // Assert
//       expect(mockDb.insert).toHaveBeenCalledWith(ReservationTable);
//       expect(mockInsert.values).toHaveBeenCalledWith(minimalReservation);
//       expect(result).toEqual(mockInsertResult);
//     });
//
//     it('should handle foreign key constraint errors', async () => {
//       // Arrange
//       const invalidReservation = {
//         customerID: 999, // Non-existent customer
//         carID: 1,
//         reservationDate: '2024-01-10',
//         pickupDate: '2024-01-12'
//       };
//
//       const mockInsert = {
//         values: jest.fn().mockReturnThis(),
//         returning: jest.fn().mockRejectedValue(new Error('Foreign key constraint violation'))
//       };
//
//       mockDb.insert = jest.fn().mockReturnValue(mockInsert);
//
//       // Act & Assert
//       await expect(createReservationService(invalidReservation))
//         .rejects.toThrow('Foreign key constraint violation');
//     });
//
//     it('should handle null or undefined reservation data', async () => {
//       // Arrange
//       const nullReservation = null as any;
//
//       const mockInsert = {
//         values: jest.fn().mockReturnThis(),
//         returning: jest.fn().mockRejectedValue(new Error('Invalid reservation data'))
//       };
//
//       mockDb.insert = jest.fn().mockReturnValue(mockInsert);
//
//       // Act & Assert
//       await expect(createReservationService(nullReservation))
//         .rejects.toThrow('Invalid reservation data');
//     });
//   });
//
//   describe('Edge Cases and Input Validation', () => {
//     it('should handle very large customer ID values', async () => {
//       // Arrange
//       const largeCustomerId = Number.MAX_SAFE_INTEGER;
//
//       const mockSelect = {
//         from: jest.fn().mockReturnThis(),
//         rightJoin: jest.fn().mockReturnThis(),
//         where: jest.fn().mockResolvedValue([])
//       };
//
//       mockDb.select = jest.fn().mockReturnValue(mockSelect);
//
//       // Act
//       const result = await getReservationByCustomerIdService(largeCustomerId);
//
//       // Assert
//       expect(mockEq).toHaveBeenCalledWith(ReservationTable.customerID, largeCustomerId);
//       expect(result).toEqual([]);
//     });
//
//     it('should handle very large car ID values', async () => {
//       // Arrange
//       const largeCarId = Number.MAX_SAFE_INTEGER;
//
//       const mockSelect = {
//         from: jest.fn().mockReturnThis(),
//         rightJoin: jest.fn().mockReturnThis(),
//         where: jest.fn().mockResolvedValue([])
//       };
//
//       mockDb.select = jest.fn().mockReturnValue(mockSelect);
//
//       // Act
//       const result = await getReservationByCarIdService(largeCarId);
//
//       // Assert
//       expect(mockEq).toHaveBeenCalledWith(ReservationTable.carID, largeCarId);
//       expect(result).toEqual([]);
//     });
//
//     it('should handle special characters in customer name', async () => {
//       // Arrange
//       const customerName = "O'Neil-Smith";
//
//       const mockQuery = {
//         UsersTable: {
//           findFirst: jest.fn().mockResolvedValue(null)
//         }
//       };
//
//       mockDb.query = mockQuery as any;
//
//       // Act & Assert
//       await expect(getCurrentlyReservedCarsByCustomerService(customerName))
//         .rejects.toThrow('Customer not found');
//
//       expect(mockEq).toHaveBeenCalledWith(UsersTable.firstName, customerName);
//     });
//
//   });
// })