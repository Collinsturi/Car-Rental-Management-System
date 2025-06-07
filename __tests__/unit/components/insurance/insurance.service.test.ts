import {
  createInsuranceService,
  getInsuranceByIdService,
  getInsurancesByCarIdService,
  getInsurancesByProviderService,
  getAllInsurancesService,
} from '../../../../src/components/Insurance/insurance.service'; // Adjust the import path as needed

import db from '../../../../src/Drizzle/db';
import { eq, ilike } from 'drizzle-orm';
import { InsuranceTable, InsuranceEntity, CarTable } from '../../../../src/Drizzle/schema';

// Mock the database and drizzle-orm
jest.mock('../../../../src/Drizzle/db');
jest.mock('drizzle-orm', () => ({
  eq: jest.fn(),
  ilike: jest.fn(),
}));

// Mock the schema tables
jest.mock('../../../../src/Drizzle/schema', () => ({
  InsuranceTable: {
    insuranceID: 'insuranceID',
    carID: 'carID',
    insuranceProvider: 'insuranceProvider',
    policyNumber: 'policyNumber',
    startDate: 'startDate',
    endDate: 'endDate',
  },
  CarTable: {
    carID: 'carID',
    carModel: 'carModel',
    year: 'year',
    color: 'color',
  },
}));

describe('Insurance Service', () => {
  // Mock database operations
  const mockInsert = jest.fn();
  const mockSelect = jest.fn();
  const mockValues = jest.fn();
  const mockReturning = jest.fn();
  const mockFrom = jest.fn();
  const mockLeftJoin = jest.fn();
  const mockWhere = jest.fn();

  // Mock drizzle-orm functions
  const mockEq = eq as jest.MockedFunction<typeof eq>;
  const mockIlike = ilike as jest.MockedFunction<typeof ilike>;

  // Sample test data
  const sampleInsuranceData: InsuranceEntity = {
    insuranceID: 1,
    carID: 1,
    insuranceProvider: 'State Farm',
    policyNumber: 'SF123456789',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
  };

  const sampleInsuranceWithCar = {
    insurance: sampleInsuranceData,
    car: {
      carID: 1,
      carModel: 'Toyota Camry',
      year: new Date('2023-01-01'),
      color: 'Blue',
    },
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup database mock chain
    (db as any).insert = mockInsert;
    (db as any).select = mockSelect;

    // Setup method chaining
    mockInsert.mockReturnValue({ values: mockValues });
    mockValues.mockReturnValue({ returning: mockReturning });
    
    mockSelect.mockReturnValue({ 
      from: mockFrom,
    });
    
    mockFrom.mockReturnValue({ 
      leftJoin: mockLeftJoin,
      where: mockWhere,
    });
    
    mockLeftJoin.mockReturnValue({ 
      where: mockWhere,
    });

    // Mock drizzle-orm functions
    mockEq.mockReturnValue('mocked_eq_condition' as any);
    mockIlike.mockReturnValue('mocked_ilike_condition' as any);
  });

  describe('createInsuranceService', () => {
    it('should create insurance successfully', async () => {
      const expectedResult = sampleInsuranceData;
      
      mockReturning.mockResolvedValue([expectedResult]);

      const result = await createInsuranceService(sampleInsuranceData);

      expect(db.insert).toHaveBeenCalledWith(InsuranceTable);
      expect(mockValues).toHaveBeenCalledWith(sampleInsuranceData);
      expect(mockReturning).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('should throw error when insurance creation fails', async () => {
      mockReturning.mockResolvedValue([]);

      await expect(createInsuranceService(sampleInsuranceData))
        .rejects.toThrow('Create insurance error: Failed to create insurance.');
    });

    it('should handle database errors during insurance creation', async () => {
      const dbError = new Error('Database connection failed');
      mockReturning.mockRejectedValue(dbError);

      await expect(createInsuranceService(sampleInsuranceData))
        .rejects.toThrow('Create insurance error: Database connection failed');
    });

    it('should handle invalid insurance data', async () => {
      const invalidData = { ...sampleInsuranceData, carID: null } as any;
      const dbError = new Error('NOT NULL constraint failed');
      mockReturning.mockRejectedValue(dbError);

      await expect(createInsuranceService(invalidData))
        .rejects.toThrow('Create insurance error: NOT NULL constraint failed');
    });
  });

  describe('getInsuranceByIdService', () => {
    it('should get insurance by ID successfully', async () => {
      const insuranceId = 1;
      const expectedResult = [sampleInsuranceWithCar];
      
      mockWhere.mockResolvedValue(expectedResult);

      const result = await getInsuranceByIdService(insuranceId);

      expect(db.select).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(InsuranceTable);
      expect(mockLeftJoin).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith(InsuranceTable.insuranceID, insuranceId);
      expect(mockWhere).toHaveBeenCalledWith('mocked_eq_condition');
      expect(result).toEqual(expectedResult);
    });

    it('should return null when insurance not found', async () => {
      const insuranceId = 999;
      mockWhere.mockResolvedValue(null);

      const result = await getInsuranceByIdService(insuranceId);

      expect(result).toBeNull();
    });

    it('should handle database errors during ID lookup', async () => {
      const insuranceId = 1;
      const dbError = new Error('Database query failed');
      mockWhere.mockRejectedValue(dbError);

      await expect(getInsuranceByIdService(insuranceId))
        .rejects.toThrow('Get insurance by ID error: Database query failed');
    });

    it('should handle invalid insurance ID', async () => {
      const invalidId = -1;
      mockWhere.mockResolvedValue([]);

      const result = await getInsuranceByIdService(invalidId);

      expect(result).toEqual([]);
    });
  });

  describe('getInsurancesByCarIdService', () => {
    it('should get insurances by car ID successfully', async () => {
      const carId = 1;
      const expectedResult = [sampleInsuranceWithCar];
      
      mockWhere.mockResolvedValue(expectedResult);

      const result = await getInsurancesByCarIdService(carId);

      expect(db.select).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(InsuranceTable);
      expect(mockLeftJoin).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith(InsuranceTable.carID, carId);
      expect(mockWhere).toHaveBeenCalledWith('mocked_eq_condition');
      expect(result).toEqual(expectedResult);
    });

    it('should return empty array when no insurances found for car', async () => {
      const carId = 999;
      mockWhere.mockResolvedValue(null);

      const result = await getInsurancesByCarIdService(carId);

      expect(result).toEqual([]);
    });

    it('should handle database errors during car ID lookup', async () => {
      const carId = 1;
      const dbError = new Error('Database connection timeout');
      mockWhere.mockRejectedValue(dbError);

      await expect(getInsurancesByCarIdService(carId))
        .rejects.toThrow('Get insurances by car ID error: Database connection timeout');
    });

    it('should handle multiple insurances for same car', async () => {
      const carId = 1;
      const multipleInsurances = [
        sampleInsuranceWithCar,
        {
          insurance: { ...sampleInsuranceData, insuranceID: 2, insuranceProvider: 'Geico' },
          car: sampleInsuranceWithCar.car,
        },
      ];
      
      mockWhere.mockResolvedValue(multipleInsurances);

      const result = await getInsurancesByCarIdService(carId);

      expect(result).toEqual(multipleInsurances);
      expect(result).toHaveLength(2);
    });
  });

  describe('getInsurancesByProviderService', () => {
    it('should get insurances by provider successfully', async () => {
      const provider = 'State Farm';
      const expectedResult = [sampleInsuranceWithCar];
      
      mockWhere.mockResolvedValue(expectedResult);

      const result = await getInsurancesByProviderService(provider);

      expect(db.select).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(InsuranceTable);
      expect(mockLeftJoin).toHaveBeenCalled();
      expect(mockIlike).toHaveBeenCalledWith(InsuranceTable.insuranceProvider, `%${provider}%`);
      expect(mockWhere).toHaveBeenCalledWith('mocked_ilike_condition');
      expect(result).toEqual(expectedResult);
    });

    it('should perform case-insensitive search', async () => {
      const provider = 'state farm';
      const expectedResult = [sampleInsuranceWithCar];
      
      mockWhere.mockResolvedValue(expectedResult);

      const result = await getInsurancesByProviderService(provider);

      expect(mockIlike).toHaveBeenCalledWith(InsuranceTable.insuranceProvider, `%${provider}%`);
      expect(result).toEqual(expectedResult);
    });

    it('should return empty array when no insurances found for provider', async () => {
      const provider = 'Non-existent Provider';
      mockWhere.mockResolvedValue(null);

      const result = await getInsurancesByProviderService(provider);

      expect(result).toEqual([]);
    });

    it('should handle database errors during provider lookup', async () => {
      const provider = 'State Farm';
      const dbError = new Error('Database server error');
      mockWhere.mockRejectedValue(dbError);

      await expect(getInsurancesByProviderService(provider))
        .rejects.toThrow('Get insurances by provider error: Database server error');
    });

    it('should handle partial provider name matching', async () => {
      const partialProvider = 'State';
      const expectedResult = [sampleInsuranceWithCar];
      
      mockWhere.mockResolvedValue(expectedResult);

      const result = await getInsurancesByProviderService(partialProvider);

      expect(mockIlike).toHaveBeenCalledWith(InsuranceTable.insuranceProvider, `%${partialProvider}%`);
      expect(result).toEqual(expectedResult);
    });

    it('should handle empty provider string', async () => {
      const emptyProvider = '';
      const expectedResult = [sampleInsuranceWithCar];
      
      mockWhere.mockResolvedValue(expectedResult);

      const result = await getInsurancesByProviderService(emptyProvider);

      expect(mockIlike).toHaveBeenCalledWith(InsuranceTable.insuranceProvider, '%%');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAllInsurancesService', () => {
    it('should get all insurances successfully', async () => {
      const expectedResult = [
        sampleInsuranceWithCar,
        {
          insurance: { ...sampleInsuranceData, insuranceID: 2, insuranceProvider: 'Geico' },
          car: { ...sampleInsuranceWithCar.car, carID: 2, carModel: 'Honda Civic' },
        },
      ];
      
      mockLeftJoin.mockResolvedValue(expectedResult);

      const result = await getAllInsurancesService();

      expect(db.select).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(InsuranceTable);
      expect(mockLeftJoin).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('should return empty array when no insurances exist', async () => {
      mockLeftJoin.mockResolvedValue(null);

      const result = await getAllInsurancesService();

      expect(result).toEqual([]);
    });

    it('should handle database errors during get all insurances', async () => {
      const dbError = new Error('Database connection lost');
      mockLeftJoin.mockRejectedValue(dbError);

      await expect(getAllInsurancesService())
        .rejects.toThrow('Get all insurances error: Database connection lost');
    });

    it('should handle large datasets', async () => {
      const largeDataset = Array.from({ length: 1000 }, (_, index) => ({
        insurance: { ...sampleInsuranceData, insuranceID: index + 1 },
        car: { ...sampleInsuranceWithCar.car, carID: index + 1 },
      }));
      
      mockLeftJoin.mockResolvedValue(largeDataset);

      const result = await getAllInsurancesService();

      expect(result).toEqual(largeDataset);
      expect(result).toHaveLength(1000);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null insurance data in create', async () => {
      const dbError = new Error('Invalid input data');
      mockReturning.mockRejectedValue(dbError);

      await expect(createInsuranceService(null as any))
        .rejects.toThrow('Create insurance error: Invalid input data');
    });

    it('should handle zero as valid ID', async () => {
      const zeroId = 0;
      mockWhere.mockResolvedValue([]);

      const result = await getInsuranceByIdService(zeroId);

      expect(mockEq).toHaveBeenCalledWith(InsuranceTable.insuranceID, zeroId);
      expect(result).toEqual([]);
    });

    it('should handle special characters in provider search', async () => {
      const providerWithSpecialChars = "O'Reilly Insurance & Co.";
      const expectedResult = [sampleInsuranceWithCar];
      
      mockWhere.mockResolvedValue(expectedResult);

      const result = await getInsurancesByProviderService(providerWithSpecialChars);

      expect(mockIlike).toHaveBeenCalledWith(
        InsuranceTable.insuranceProvider, 
        `%${providerWithSpecialChars}%`
      );
      expect(result).toEqual(expectedResult);
    });

    it('should handle network timeout errors', async () => {
      const timeoutError = new Error('Network timeout');
      mockLeftJoin.mockRejectedValue(timeoutError);

      await expect(getAllInsurancesService())
        .rejects.toThrow('Get all insurances error: Network timeout');
    });

    it('should handle SQL injection attempts in provider search', async () => {
      const maliciousInput = "'; DROP TABLE insurances; --";
      const expectedResult = [];
      
      mockWhere.mockResolvedValue(expectedResult);

      const result = await getInsurancesByProviderService(maliciousInput);

      expect(mockIlike).toHaveBeenCalledWith(
        InsuranceTable.insuranceProvider, 
        `%${maliciousInput}%`
      );
      expect(result).toEqual(expectedResult);
    });
  });

//   describe('Service Function Integration', () => {
//     it('should maintain consistent error message format across all functions', () => {
//       const errorMessage = 'Database error';
//       const expectedErrorPatterns = [
//         'Create insurance error:',
//         'Get insurance by ID error:',
//         'Get insurances by car ID error:',
//         'Get insurances by provider error:',
//         'Get all insurances error:',
//       ];

//       expectedErrorPatterns.forEach(pattern => {
//         expect(pattern).toMatch(/^[A-Z][a-z\s]+error:$/);
//       });
//     });

//     it('should handle concurrent database operations', async () => {
//       const promises = [
//         createInsuranceService(sampleInsuranceData),
//         getInsuranceByIdService(1),
//         getAllInsurancesService(),
//       ];

//       // Mock all operations to succeed
//       mockReturning.mockResolvedValue([sampleInsuranceData]);
//       mockWhere.mockResolvedValue([sampleInsuranceWithCar]);
//       mockLeftJoin.mockResolvedValue([sampleInsuranceWithCar]);

//       const results = await Promise.all(promises);

//       expect(results).toHaveLength(3);
//       expect(results[0]).toEqual(sampleInsuranceData);
//       expect(results[1]).toEqual([sampleInsuranceWithCar]);
//       expect(results[2]).toEqual([sampleInsuranceWithCar]);
//     });
//   });
});