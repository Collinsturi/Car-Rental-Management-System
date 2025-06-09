import { eq } from 'drizzle-orm';
import db from '../../../../src/Drizzle/db';
import { CarTable, MaintenanceTable, MaintenanceEntity } from '../../../../src/Drizzle/schema';
import {
    createMaintenanceService,
    getMaintenanceByIdService,
    getMaintenanceByCarIdService
} from '../../../../src/components/maintainance/maintainance.service';

// Mock the database
jest.mock('../../../../src/Drizzle/db', () => ({
    default: {
        insert: jest.fn(),
        select: jest.fn()
    }
}));

// Mock drizzle-orm
jest.mock('drizzle-orm', () => ({
    eq: jest.fn()
}));

describe('Maintenance Service', () => {
    const mockDb = db as any;
    const mockEq = eq as any;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('createMaintenanceService', () => {
        it('should create a new maintenance record successfully', async () => {
            // Arrange
            const mockMaintenance: MaintenanceEntity = {
                maintenanceID: 1,
                carID: 1,
                maintenanceDate: '2024-01-15',
                description: 'Oil change and tire rotation',
                cost: '150.00'
            };

            const mockInsertChain = {
                values: jest.fn().mockReturnThis(),
                returning: jest.fn().mockResolvedValue([mockMaintenance])
            };

            mockDb.insert.mockReturnValue(mockInsertChain);

            // Act
            const result = await createMaintenanceService(mockMaintenance);

            // Assert
            expect(mockDb.insert).toHaveBeenCalledWith(MaintenanceTable);
            expect(mockInsertChain.values).toHaveBeenCalledWith(mockMaintenance);
            expect(mockInsertChain.returning).toHaveBeenCalled();
            expect(result).toEqual([mockMaintenance]);
        });

        it('should handle database errors during creation', async () => {
            // Arrange
            const mockMaintenance: MaintenanceEntity = {
                maintenanceID: 1,
                carID: 1,
                maintenanceDate: '2024-01-15',
                description: 'Oil change',
                cost: '100.00'
            };

            const mockInsertChain = {
                values: jest.fn().mockReturnThis(),
                returning: jest.fn().mockRejectedValue(new Error('Database connection failed'))
            };

            mockDb.insert.mockReturnValue(mockInsertChain);

            // Act & Assert
            await expect(createMaintenanceService(mockMaintenance))
                .rejects.toThrow('Database connection failed');
        });
    });

    describe('getMaintenanceByIdService', () => {
        it('should return maintenance record with car details when found', async () => {
            // Arrange
            const maintenanceId = 1;
            const mockMaintenanceWithCar = [{
                maintenance: {
                    maintenanceID: 1,
                    carID: 1,
                    maintenanceDate: new Date('2024-01-15'),
                    description: 'Oil change',
                    cost: '100.00'
                },
                car: {
                    carID: 1,
                    carModel: 'Toyota Camry',
                    year: new Date('2022-01-01'),
                    color: 'Silver',
                    rentalRate: '50.00',
                    availability: true,
                    locationID: 1
                }
            }];

            const mockSelectChain = {
                from: jest.fn().mockReturnThis(),
                leftJoin: jest.fn().mockReturnThis(),
                where: jest.fn().mockResolvedValue(mockMaintenanceWithCar)
            };

            mockDb.select.mockReturnValue(mockSelectChain);
            mockEq.mockReturnValue('mocked-eq-condition');

            // Act
            const result = await getMaintenanceByIdService(maintenanceId);

            // Assert
            expect(mockDb.select).toHaveBeenCalled();
            expect(mockSelectChain.from).toHaveBeenCalledWith(MaintenanceTable);
            expect(mockSelectChain.leftJoin).toHaveBeenCalled();
            expect(mockSelectChain.where).toHaveBeenCalledWith('mocked-eq-condition');
            expect(mockEq).toHaveBeenCalledWith(MaintenanceTable.maintenanceID, maintenanceId);
            expect(result).toEqual(mockMaintenanceWithCar);
        });

        it('should return null when maintenance record is not found', async () => {
            // Arrange
            const maintenanceId = 999;
            
            const mockSelectChain = {
                from: jest.fn().mockReturnThis(),
                leftJoin: jest.fn().mockReturnThis(),
                where: jest.fn().mockResolvedValue(null)
            };

            mockDb.select.mockReturnValue(mockSelectChain);
            mockEq.mockReturnValue('mocked-eq-condition');

            // Act
            const result = await getMaintenanceByIdService(maintenanceId);

            // Assert
            expect(result).toBeNull();
        });

        it('should handle database errors and throw custom error', async () => {
            // Arrange
            const maintenanceId = 1;
            const dbError = new Error('Connection timeout');

            const mockSelectChain = {
                from: jest.fn().mockReturnThis(),
                leftJoin: jest.fn().mockReturnThis(),
                where: jest.fn().mockRejectedValue(dbError)
            };

            mockDb.select.mockReturnValue(mockSelectChain);

            // Act & Assert
            await expect(getMaintenanceByIdService(maintenanceId))
                .rejects.toThrow('Get maintenance by ID error: Connection timeout');
        });
    });

    describe('getMaintenanceByCarIdService', () => {
        it('should return maintenance records for a specific car', async () => {
            // Arrange
            const carId = 1;
            const mockMaintenanceRecords = [
                {
                    maintenance: {
                        maintenanceID: 1,
                        carID: 1,
                        maintenanceDate: new Date('2024-01-15'),
                        description: 'Oil change',
                        cost: '100.00'
                    },
                    car: {
                        carID: 1,
                        carModel: 'Toyota Camry',
                        year: new Date('2022-01-01'),
                        color: 'Silver',
                        rentalRate: '50.00',
                        availability: true,
                        locationID: 1
                    }
                },
                {
                    maintenance: {
                        maintenanceID: 2,
                        carID: 1,
                        maintenanceDate: new Date('2024-02-15'),
                        description: 'Brake inspection',
                        cost: '75.00'
                    },
                    car: {
                        carID: 1,
                        carModel: 'Toyota Camry',
                        year: new Date('2022-01-01'),
                        color: 'Silver',
                        rentalRate: '50.00',
                        availability: true,
                        locationID: 1
                    }
                }
            ];

            const mockSelectChain = {
                from: jest.fn().mockReturnThis(),
                leftJoin: jest.fn().mockReturnThis(),
                where: jest.fn().mockResolvedValue(mockMaintenanceRecords)
            };

            mockDb.select.mockReturnValue(mockSelectChain);
            mockEq.mockReturnValue('mocked-eq-condition');

            // Act
            const result = await getMaintenanceByCarIdService(carId);

            // Assert
            expect(mockDb.select).toHaveBeenCalled();
            expect(mockSelectChain.from).toHaveBeenCalledWith(MaintenanceTable);
            expect(mockSelectChain.leftJoin).toHaveBeenCalled();
            expect(mockSelectChain.where).toHaveBeenCalledWith('mocked-eq-condition');
            expect(mockEq).toHaveBeenCalledWith(MaintenanceTable.carID, carId);
            expect(result).toEqual(mockMaintenanceRecords);
            expect(result).toHaveLength(2);
        });

        it('should return empty array when no maintenance records found for car', async () => {
            // Arrange
            const carId = 999;
            
            const mockSelectChain = {
                from: jest.fn().mockReturnThis(),
                leftJoin: jest.fn().mockReturnThis(),
                where: jest.fn().mockResolvedValue(null)
            };

            mockDb.select.mockReturnValue(mockSelectChain);
            mockEq.mockReturnValue('mocked-eq-condition');

            // Act
            const result = await getMaintenanceByCarIdService(carId);

            // Assert
            expect(result).toEqual([]);
        });

        it('should handle database errors and throw custom error', async () => {
            // Arrange
            const carId = 1;
            const dbError = new Error('Database unavailable');

            const mockSelectChain = {
                from: jest.fn().mockReturnThis(),
                leftJoin: jest.fn().mockReturnThis(),
                where: jest.fn().mockRejectedValue(dbError)
            };

            mockDb.select.mockReturnValue(mockSelectChain);

            // Act & Assert
            await expect(getMaintenanceByCarIdService(carId))
                .rejects.toThrow('Get maintenance by car ID error: Database unavailable');
        });

        it('should return empty array when maintenance records array is empty', async () => {
            // Arrange
            const carId = 1;
            
            const mockSelectChain = {
                from: jest.fn().mockReturnThis(),
                leftJoin: jest.fn().mockReturnThis(),
                where: jest.fn().mockResolvedValue([])
            };

            mockDb.select.mockReturnValue(mockSelectChain);

            // Act
            const result = await getMaintenanceByCarIdService(carId);

            // Assert
            expect(result).toEqual([]);
        });
    });

    describe('Edge Cases', () => {
        it('should handle maintenance record with null cost', async () => {
            // Arrange
            const mockMaintenance: MaintenanceEntity = {
                maintenanceID: 1,
                carID: 1,
                maintenanceDate: '2024-01-15',
                description: 'Inspection only',
                cost: null
            };

            const mockInsertChain = {
                values: jest.fn().mockReturnThis(),
                returning: jest.fn().mockResolvedValue([mockMaintenance])
            };

            mockDb.insert.mockReturnValue(mockInsertChain);

            // Act
            const result = await createMaintenanceService(mockMaintenance);

            // Assert
            expect(result).toEqual([mockMaintenance]);
            expect(result[0].cost).toBeNull();
        });

        it('should handle maintenance record with null description', async () => {
            // Arrange
            const mockMaintenance: MaintenanceEntity = {
                maintenanceID: 1,
                carID: 1,
                maintenanceDate: '2024-01-15',
                description: null,
                cost: '100.00'
            };

            const mockInsertChain = {
                values: jest.fn().mockReturnThis(),
                returning: jest.fn().mockResolvedValue([mockMaintenance])
            };

            mockDb.insert.mockReturnValue(mockInsertChain);

            // Act
            const result = await createMaintenanceService(mockMaintenance);

            // Assert
            expect(result).toEqual([mockMaintenance]);
            expect(result[0].description).toBeNull();
        });
    });
});