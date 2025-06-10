import { eq } from 'drizzle-orm';
import db from '../../../../src/Drizzle/db';
import { CarTable, MaintenanceTable, MaintenanceEntity } from '../../../../src/Drizzle/schema';
import {
    createMaintenanceService,
    getMaintenanceByIdService,
    getMaintenanceByCarIdService
} from '../../../../src/components/maintainance/maintainance.service';

// Mocks
jest.mock('../../../../src/Drizzle/db', () => {
    const selectChain = {
        from: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn()
    };

    const insertChain = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn()
    };

    return {
        default: {
            select: jest.fn(() => selectChain),
            insert: jest.fn(() => insertChain)
        }
    };
});

jest.mock('drizzle-orm', () => ({
    eq: jest.fn(() => 'mocked-eq-condition')
}));

describe('Maintenance Service', () => {
    const mockDb = db as any;
    const mockEq = eq as jest.Mock;

    const selectChain = mockDb.select();
    const insertChain = mockDb.insert();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createMaintenanceService', () => {
        it('should create a new maintenance record successfully', async () => {
            const mockMaintenance: MaintenanceEntity = {
                maintenanceID: 1,
                carID: 1,
                maintenanceDate: '2024-01-15',
                description: 'Oil change',
                cost: '100.00'
            };

            insertChain.returning.mockResolvedValue([mockMaintenance]);

            const result = await createMaintenanceService(mockMaintenance);

            expect(mockDb.insert).toHaveBeenCalledWith(MaintenanceTable);
            expect(insertChain.values).toHaveBeenCalledWith(mockMaintenance);
            expect(insertChain.returning).toHaveBeenCalled();
            expect(result).toEqual([mockMaintenance]);
        });

        it('should throw on insert error', async () => {
            const error = new Error('DB failure');
            insertChain.returning.mockRejectedValue(error);

            await expect(createMaintenanceService({
                maintenanceID: 1,
                carID: 1,
                maintenanceDate: '2024-01-15',
                description: 'Test',
                cost: '0'
            })).rejects.toThrow('DB failure');
        });
    });

    describe('getMaintenanceByIdService', () => {
        it('should return maintenance with car info', async () => {
            const data = [{
                maintenance: {
                    maintenanceID: 1,
                    carID: 1,
                    maintenanceDate: new Date('2024-01-15'),
                    description: 'Checkup',
                    cost: '80'
                },
                car: {
                    carID: 1,
                    carModel: 'Tesla',
                    year: new Date('2022-01-01'),
                    color: 'White',
                    rentalRate: '100',
                    availability: true,
                    locationID: 1
                }
            }];

            selectChain.where.mockResolvedValue(data);

            const result = await getMaintenanceByIdService(1);
            expect(result).toEqual(data);
        });

        it('should return null if not found', async () => {
            selectChain.where.mockResolvedValue(null);

            const result = await getMaintenanceByIdService(999);
            expect(result).toBeNull();
        });

        it('should handle DB error', async () => {
            const error = new Error('Timeout');
            selectChain.where.mockRejectedValue(error);

            await expect(getMaintenanceByIdService(1))
                .rejects.toThrow('Get maintenance by ID error: Timeout');
        });
    });

    describe('getMaintenanceByCarIdService', () => {
        it('should return multiple records', async () => {
            const records = [
                {
                    maintenance: {
                        maintenanceID: 1,
                        carID: 1,
                        maintenanceDate: new Date(),
                        description: 'X',
                        cost: '10'
                    },
                    car: {
                        carID: 1,
                        carModel: 'X',
                        year: new Date(),
                        color: 'Red',
                        rentalRate: '100',
                        availability: true,
                        locationID: 1
                    }
                }
            ];

            selectChain.where.mockResolvedValue(records);

            const result = await getMaintenanceByCarIdService(1);
            expect(result).toEqual(records);
        });

        it('should return [] if null', async () => {
            selectChain.where.mockResolvedValue(null);

            const result = await getMaintenanceByCarIdService(1);
            expect(result).toEqual([]);
        });

        it('should return [] if []', async () => {
            selectChain.where.mockResolvedValue([]);

            const result = await getMaintenanceByCarIdService(1);
            expect(result).toEqual([]);
        });

        it('should throw DB error', async () => {
            const error = new Error('DB fail');
            selectChain.where.mockRejectedValue(error);

            await expect(getMaintenanceByCarIdService(1))
                .rejects.toThrow('Get maintenance by car ID error: DB fail');
        });
    });

    describe('Edge cases', () => {
        it('should create record with null cost', async () => {
            const mockMaintenance = {
                maintenanceID: 2,
                carID: 1,
                maintenanceDate: '2024-02-01',
                description: 'Test',
                cost: null
            };

            insertChain.returning.mockResolvedValue([mockMaintenance]);

            const result = await createMaintenanceService(mockMaintenance as MaintenanceEntity);
            expect(result[0].cost).toBeNull();
        });

        it('should create record with null description', async () => {
            const mockMaintenance = {
                maintenanceID: 3,
                carID: 1,
                maintenanceDate: '2024-02-01',
                description: null,
                cost: '50'
            };

            insertChain.returning.mockResolvedValue([mockMaintenance]);

            const result = await createMaintenanceService(mockMaintenance as MaintenanceEntity);
            expect(result[0].description).toBeNull();
        });
    });
});
