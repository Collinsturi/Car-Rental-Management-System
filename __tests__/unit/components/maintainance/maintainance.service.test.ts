// import { createMaintenanceService, getMaintenanceByIdService, getMaintenanceByCarIdService } from '../../../../src/components/maintainance/maintainance.service';
// import db from '../../../../src/Drizzle/db';
// import { MaintenanceTable, CarTable } from '../../../../src/Drizzle/schema';
// import { eq } from 'drizzle-orm';
//
// // Mock the database and drizzle-orm
// jest.mock('../../../../src/Drizzle/db');
// jest.mock('drizzle-orm', () => ({
//   eq: jest.fn()
// }));
//
// // Mock the schema tables
// jest.mock('../../../../src/Drizzle/schema', () => ({
//   MaintenanceTable: {
//     maintenanceID: 'maintenanceID',
//     carID: 'carID'
//   },
//   CarTable: {
//     carID: 'carID'
//   }
// }));
//
// describe('Maintenance Service', () => {
//   const mockDb = db as jest.Mocked<typeof db>;
//   const mockEq = eq as jest.MockedFunction<typeof eq>;
//
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });
//
//   describe('createMaintenanceService', () => {
//     it('should create a new maintenance record successfully', async () => {
//       // Arrange
//       const mockMaintenance = {
//         maintenanceID: 1,
//         carID: 1,
//         serviceType: 'Oil Change',
//         serviceDate: new Date('2024-01-15'),
//         cost: 50.00,
//         description: 'Regular oil change service'
//       };
//
//       const mockReturning = jest.fn().mockResolvedValue([mockMaintenance]);
//       const mockValues = jest.fn().mockReturnValue({ returning: mockReturning });
//       const mockInsert = jest.fn().mockReturnValue({ values: mockValues });
//
//       mockDb.insert = mockInsert;
//
//       // Act
//       const result = await createMaintenanceService(mockMaintenance);
//
//       // Assert
//       expect(mockDb.insert).toHaveBeenCalledWith(MaintenanceTable);
//       expect(mockValues).toHaveBeenCalledWith(mockMaintenance);
//       expect(mockReturning).toHaveBeenCalled();
//       expect(result).toEqual([mockMaintenance]);
//     });
//
//     it('should handle database errors during creation', async () => {
//       // Arrange
//       const mockMaintenance = {
//         maintenanceID: 1,
//         carID: 1,
//         serviceType: 'Oil Change',
//         serviceDate: new Date('2024-01-15'),
//         cost: 50.00,
//         description: 'Regular oil change service'
//       };
//
//       const mockReturning = jest.fn().mockRejectedValue(new Error('Database connection failed'));
//       const mockValues = jest.fn().mockReturnValue({ returning: mockReturning });
//       const mockInsert = jest.fn().mockReturnValue({ values: mockValues });
//
//       mockDb.insert = mockInsert;
//
//       // Act & Assert
//       await expect(createMaintenanceService(mockMaintenance)).rejects.toThrow('Database connection failed');
//     });
//   });
//
//   describe('getMaintenanceByIdService', () => {
//     it('should return maintenance record with car details when found', async () => {
//       // Arrange
//       const maintenanceId = 1;
//       const mockMaintenanceWithCar = [{
//         maintenance: {
//           maintenanceID: 1,
//           carID: 1,
//           serviceType: 'Oil Change',
//           serviceDate: new Date('2024-01-15'),
//           cost: 50.00,
//           description: 'Regular oil change service'
//         },
//         car: {
//           carID: 1,
//           make: 'Toyota',
//           model: 'Camry',
//           year: 2020
//         }
//       }];
//
//       const mockWhere = jest.fn().mockResolvedValue(mockMaintenanceWithCar);
//       const mockLeftJoin = jest.fn().mockReturnValue({ where: mockWhere });
//       const mockFrom = jest.fn().mockReturnValue({ leftJoin: mockLeftJoin });
//       const mockSelect = jest.fn().mockReturnValue({ from: mockFrom });
//
//       mockDb.select = mockSelect;
//       mockEq.mockReturnValue('eq_condition' as any);
//
//       // Act
//       const result = await getMaintenanceByIdService(maintenanceId);
//
//       // Assert
//       expect(mockDb.select).toHaveBeenCalled();
//       expect(mockFrom).toHaveBeenCalledWith(MaintenanceTable);
//       expect(mockLeftJoin).toHaveBeenCalled();
//       expect(mockEq).toHaveBeenCalledWith(MaintenanceTable.maintenanceID, maintenanceId);
//       expect(mockWhere).toHaveBeenCalledWith('eq_condition');
//       expect(result).toEqual(mockMaintenanceWithCar);
//     });
//
//     it('should return null when maintenance record is not found', async () => {
//       // Arrange
//       const maintenanceId = 999;
//
//       const mockWhere = jest.fn().mockResolvedValue(null);
//       const mockLeftJoin = jest.fn().mockReturnValue({ where: mockWhere });
//       const mockFrom = jest.fn().mockReturnValue({ leftJoin: mockLeftJoin });
//       const mockSelect = jest.fn().mockReturnValue({ from: mockFrom });
//
//       mockDb.select = mockSelect;
//       mockEq.mockReturnValue('eq_condition' as any);
//
//       // Act
//       const result = await getMaintenanceByIdService(maintenanceId);
//
//       // Assert
//       expect(result).toBeNull();
//     });
//
//     it('should throw an error when database operation fails', async () => {
//       // Arrange
//       const maintenanceId = 1;
//       const dbError = new Error('Connection timeout');
//
//       const mockWhere = jest.fn().mockRejectedValue(dbError);
//       const mockLeftJoin = jest.fn().mockReturnValue({ where: mockWhere });
//       const mockFrom = jest.fn().mockReturnValue({ leftJoin: mockLeftJoin });
//       const mockSelect = jest.fn().mockReturnValue({ from: mockFrom });
//
//       mockDb.select = mockSelect;
//       mockEq.mockReturnValue('eq_condition' as any);
//
//       // Act & Assert
//       await expect(getMaintenanceByIdService(maintenanceId)).rejects.toThrow('Get maintenance by ID error: Connection timeout');
//     });
//   });
//
//   describe('getMaintenanceByCarIdService', () => {
//     it('should return maintenance records for a specific car', async () => {
//       // Arrange
//       const carId = 1;
//       const mockMaintenanceRecords = [
//         {
//           maintenance: {
//             maintenanceID: 1,
//             carID: 1,
//             serviceType: 'Oil Change',
//             serviceDate: new Date('2024-01-15'),
//             cost: 50.00,
//             description: 'Regular oil change service'
//           },
//           car: {
//             carID: 1,
//             make: 'Toyota',
//             model: 'Camry',
//             year: 2020
//           }
//         },
//         {
//           maintenance: {
//             maintenanceID: 2,
//             carID: 1,
//             serviceType: 'Tire Rotation',
//             serviceDate: new Date('2024-02-20'),
//             cost: 30.00,
//             description: 'Tire rotation and inspection'
//           },
//           car: {
//             carID: 1,
//             make: 'Toyota',
//             model: 'Camry',
//             year: 2020
//           }
//         }
//       ];
//
//       const mockWhere = jest.fn().mockResolvedValue(mockMaintenanceRecords);
//       const mockLeftJoin = jest.fn().mockReturnValue({ where: mockWhere });
//       const mockFrom = jest.fn().mockReturnValue({ leftJoin: mockLeftJoin });
//       const mockSelect = jest.fn().mockReturnValue({ from: mockFrom });
//
//       mockDb.select = mockSelect;
//       mockEq.mockReturnValue('eq_condition' as any);
//
//       // Act
//       const result = await getMaintenanceByCarIdService(carId);
//
//       // Assert
//       expect(mockDb.select).toHaveBeenCalled();
//       expect(mockFrom).toHaveBeenCalledWith(MaintenanceTable);
//       expect(mockLeftJoin).toHaveBeenCalled();
//       expect(mockEq).toHaveBeenCalledWith(MaintenanceTable.carID, carId);
//       expect(mockWhere).toHaveBeenCalledWith('eq_condition');
//       expect(result).toEqual(mockMaintenanceRecords);
//     });
//
//     it('should return empty array when no maintenance records found for car', async () => {
//       // Arrange
//       const carId = 999;
//
//       const mockWhere = jest.fn().mockResolvedValue(null);
//       const mockLeftJoin = jest.fn().mockReturnValue({ where: mockWhere });
//       const mockFrom = jest.fn().mockReturnValue({ leftJoin: mockLeftJoin });
//       const mockSelect = jest.fn().mockReturnValue({ from: mockFrom });
//
//       mockDb.select = mockSelect;
//       mockEq.mockReturnValue('eq_condition' as any);
//
//       // Act
//       const result = await getMaintenanceByCarIdService(carId);
//
//       // Assert
//       expect(result).toEqual([]);
//     });
//
//     it('should throw an error when database operation fails', async () => {
//       // Arrange
//       const carId = 1;
//       const dbError = new Error('Database timeout');
//
//       const mockWhere = jest.fn().mockRejectedValue(dbError);
//       const mockLeftJoin = jest.fn().mockReturnValue({ where: mockWhere });
//       const mockFrom = jest.fn().mockReturnValue({ leftJoin: mockLeftJoin });
//       const mockSelect = jest.fn().mockReturnValue({ from: mockFrom });
//
//       mockDb.select = mockSelect;
//       mockEq.mockReturnValue('eq_condition' as any);
//
//       // Act & Assert
//       await expect(getMaintenanceByCarIdService(carId)).rejects.toThrow('Get maintenance by car ID error: Database timeout');
//     });
//   });
// });
//
// // Additional integration-style tests (optional)
// describe('Maintenance Service Integration Tests', () => {
//   // These tests would run against a test database
//   // Uncomment and modify based on your test setup
//
//   /*
//   beforeAll(async () => {
//     // Setup test database
//   });
//
//   afterAll(async () => {
//     // Cleanup test database
//   });
//
//   beforeEach(async () => {
//     // Clear test data
//   });
//
//   it('should create and retrieve maintenance record', async () => {
//     // Integration test example
//     const newMaintenance = {
//       carID: 1,
//       serviceType: 'Oil Change',
//       serviceDate: new Date('2024-01-15'),
//       cost: 50.00,
//       description: 'Regular oil change service'
//     };
//
//     const created = await createMaintenanceService(newMaintenance);
//     const retrieved = await getMaintenanceByIdService(created[0].maintenanceID);
//
//     expect(retrieved).toBeTruthy();
//     expect(retrieved[0].maintenance.serviceType).toBe(newMaintenance.serviceType);
//   });
//   */
// });