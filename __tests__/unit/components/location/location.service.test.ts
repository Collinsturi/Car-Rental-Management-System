import {
  getAllLocationsService,
  createLocationService,
} from '../../../../src/components/location/location.service'; // Adjust the import path as needed

import db from '../../../../src/Drizzle/db';
import { LocationEntity, LocationTable } from '../../../../src/Drizzle/schema';

// Mock the database and schema
jest.mock('../../../../src/Drizzle/db');
jest.mock('../../../../src/Drizzle/schema', () => ({
  LocationTable: {
    locationID: 'locationID',
    locationName: 'locationName',
    address: 'address',
    contactNumber: 'contactNumber',
  },
}));

// Mock console.log to suppress log output during tests
const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Location Service', () => {
  // Mock database operations
  const mockFindMany = jest.fn();
  const mockInsert = jest.fn();
  const mockValues = jest.fn();
  const mockReturning = jest.fn();

  // Sample test data
  const sampleLocationData: LocationEntity = {
    locationID: 1,
    locationName: 'Downtown Branch',
    address: '123 Main Street, City, State 12345',
    contactNumber: '+1-555-123-4567',
  };

  const sampleLocations: LocationEntity[] = [
    sampleLocationData,
    {
      locationID: 2,
      locationName: 'Airport Branch',
      address: '456 Airport Blvd, City, State 12346',
      contactNumber: '+1-555-987-6543',
    },
    {
      locationID: 3,
      locationName: 'Mall Branch',
      address: '789 Shopping Center Dr, City, State 12347',
      contactNumber: '+1-555-456-7890',
    },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    consoleSpy.mockClear();

    // Setup database mock structure
    (db as any).query = {
      LocationTable: {
        findMany: mockFindMany,
      },
    };
    (db as any).insert = mockInsert;

    // Setup method chaining for insert operations
    mockInsert.mockReturnValue({ values: mockValues });
    mockValues.mockReturnValue({ returning: mockReturning });
  });

  afterAll(() => {
    // Restore console.log after all tests
    consoleSpy.mockRestore();
  });

  describe('getAllLocationsService', () => {
    it('should get all locations successfully', async () => {
      mockFindMany.mockResolvedValue(sampleLocations);

      const result = await getAllLocationsService();

      expect(db.query.LocationTable.findMany).toHaveBeenCalled();
      expect(result).toEqual(sampleLocations);
      expect(result).toHaveLength(3);
    });

    it('should return locations when findMany returns data', async () => {
      const singleLocation = [sampleLocationData];
      mockFindMany.mockResolvedValue(singleLocation);

      const result = await getAllLocationsService();

      expect(result).toEqual(singleLocation);
      expect(result).toHaveLength(1);
    });

    it('should handle empty locations array', async () => {
      mockFindMany.mockResolvedValue([]);

      const result = await getAllLocationsService();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle null/undefined response from database', async () => {
      mockFindMany.mockResolvedValue(null);

      const result = await getAllLocationsService();

      // Since the function doesn't handle null properly, it will return undefined
      // This test documents the current behavior
      expect(result).toBeUndefined();
      expect(console.log).toHaveBeenCalled();
    });

    it('should handle database errors and log them', async () => {
      const dbError = new Error('Database connection failed');
      mockFindMany.mockRejectedValue(dbError);

      const result = await getAllLocationsService();

      expect(console.log).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should handle database timeout errors', async () => {
      const timeoutError = new Error('Query timeout');
      mockFindMany.mockRejectedValue(timeoutError);

      const result = await getAllLocationsService();

      expect(console.log).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should handle network connectivity issues', async () => {
      const networkError = new Error('Network unreachable');
      mockFindMany.mockRejectedValue(networkError);

      const result = await getAllLocationsService();

      expect(console.log).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should call findMany without any parameters', async () => {
      mockFindMany.mockResolvedValue(sampleLocations);

      await getAllLocationsService();

      expect(db.query.LocationTable.findMany).toHaveBeenCalledWith();
      expect(db.query.LocationTable.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('createLocationService', () => {
    it('should create location successfully', async () => {
      const expectedResult = [sampleLocationData];
      mockReturning.mockResolvedValue(expectedResult);

      const result = await createLocationService(sampleLocationData);

      expect(db.insert).toHaveBeenCalledWith(LocationTable);
      expect(mockValues).toHaveBeenCalledWith(sampleLocationData);
      expect(mockReturning).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('should handle successful creation with complete location data', async () => {
      const completeLocationData: LocationEntity = {
        locationID: 4,
        locationName: 'Suburban Branch',
        address: '321 Suburban Ave, Suburb, State 12348',
        contactNumber: '+1-555-111-2222',
      };
      const expectedResult = [completeLocationData];
      mockReturning.mockResolvedValue(expectedResult);

      const result = await createLocationService(completeLocationData);

      expect(result).toEqual(expectedResult);
    });

    it('should handle location data without optional fields', async () => {
      const minimalLocationData = {
        locationID: 5,
        locationName: 'Minimal Branch',
        address: '999 Minimal St, City, State 12349',
        contactNumber: null,
      } as LocationEntity;
      const expectedResult = [minimalLocationData];
      mockReturning.mockResolvedValue(expectedResult);

      const result = await createLocationService(minimalLocationData);

      expect(mockValues).toHaveBeenCalledWith(minimalLocationData);
      expect(result).toEqual(expectedResult);
    });

    it('should return empty array when creation fails', async () => {
      mockReturning.mockResolvedValue(null);

      const result = await createLocationService(sampleLocationData);

      expect(result).toEqual([]);
      expect(console.log).toHaveBeenCalled();
    });

    // it('should return empty array when creation returns empty array', async () => {
    //   mockReturning.mockResolvedValue([]);

    //   const result = await createLocationService(sampleLocationData);

    //   expect(result).toEqual([]);
    //   expect(console.log).toHaveBeenCalled();
    // });

    it('should handle database constraint violations', async () => {
      const constraintError = new Error('UNIQUE constraint failed: location.locationName');
      mockReturning.mockRejectedValue(constraintError);

      const result = await createLocationService(sampleLocationData);

      expect(console.log).toHaveBeenCalledWith(constraintError);
      expect(result).toEqual([]);
    });

    it('should handle database connection errors', async () => {
      const connectionError = new Error('Database connection lost');
      mockReturning.mockRejectedValue(connectionError);

      const result = await createLocationService(sampleLocationData);

      expect(console.log).toHaveBeenCalledWith(connectionError);
      expect(result).toEqual([]);
    });

    it('should handle invalid location data', async () => {
      const invalidLocationData = {
        locationName: '', // Empty required field
        address: null,
        contactNumber: 'invalid-phone',
      } as any;
      const validationError = new Error('NOT NULL constraint failed: location.address');
      mockReturning.mockRejectedValue(validationError);

      const result = await createLocationService(invalidLocationData);

      expect(console.log).toHaveBeenCalledWith(validationError);
      expect(result).toEqual([]);
    });

    it('should handle insertion with duplicate location names', async () => {
      const duplicateLocationData = {
        ...sampleLocationData,
        locationID: 6,
      };
      const duplicateError = new Error('Duplicate entry for locationName');
      mockReturning.mockRejectedValue(duplicateError);

      const result = await createLocationService(duplicateLocationData);

      expect(console.log).toHaveBeenCalledWith(duplicateError);
      expect(result).toEqual([]);
    });

    it('should handle network timeout during creation', async () => {
      const timeoutError = new Error('Query execution timeout');
      mockReturning.mockRejectedValue(timeoutError);

      const result = await createLocationService(sampleLocationData);

      expect(console.log).toHaveBeenCalledWith(timeoutError);
      expect(result).toEqual([]);
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    it('should handle null location data in create', async () => {
      const nullError = new Error('Cannot read properties of null');
      mockReturning.mockRejectedValue(nullError);

      const result = await createLocationService(null as any);

      expect(console.log).toHaveBeenCalledWith(nullError);
      expect(result).toEqual([]);
    });

    it('should handle undefined location data in create', async () => {
      const undefinedError = new Error('Cannot read properties of undefined');
      mockReturning.mockRejectedValue(undefinedError);

      const result = await createLocationService(undefined as any);

      expect(console.log).toHaveBeenCalledWith(undefinedError);
      expect(result).toEqual([]);
    });

    it('should handle very long location names', async () => {
      const longNameLocation = {
        ...sampleLocationData,
        locationName: 'A'.repeat(1000), // Very long name
      };
      const lengthError = new Error('Data too long for column locationName');
      mockReturning.mockRejectedValue(lengthError);

      const result = await createLocationService(longNameLocation);

      expect(console.log).toHaveBeenCalledWith(lengthError);
      expect(result).toEqual([]);
    });

    it('should handle special characters in location data', async () => {
      const specialCharLocation = {
        locationID: 7,
        locationName: "O'Reilly's Auto Parts & Services",
        address: '123 Main St. #456, City "Quotes", State <Tags>',
        contactNumber: '+1-555-123-4567 ext. 890',
      };
      const expectedResult = [specialCharLocation];
      mockReturning.mockResolvedValue(expectedResult);

      const result = await createLocationService(specialCharLocation);

      expect(result).toEqual(expectedResult);
    });

    it('should handle international addresses and phone numbers', async () => {
      const internationalLocation = {
        locationID: 8,
        locationName: 'International Branch',
        address: '123 Rue de la Paix, 75001 Paris, France',
        contactNumber: '+33-1-42-86-87-88',
      };
      const expectedResult = [internationalLocation];
      mockReturning.mockResolvedValue(expectedResult);

      const result = await createLocationService(internationalLocation);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('Service Behavior Analysis', () => {
    it('should document that getAllLocations does not handle errors properly', async () => {
      // This test documents the current problematic behavior
      const dbError = new Error('Database error');
      mockFindMany.mockRejectedValue(dbError);

      const result = await getAllLocationsService();

      // The function catches the error but returns undefined instead of throwing or returning a proper error response
      expect(result).toBeUndefined();
      expect(console.log).toHaveBeenCalled();
    });

    it('should document that createLocation always returns empty array on error', async () => {
      // This test documents the current behavior
      const dbError = new Error('Any database error');
      mockReturning.mockRejectedValue(dbError);

      const result = await createLocationService(sampleLocationData);

      // The function always returns empty array on error, which might not be ideal
      expect(result).toEqual([]);
      expect(console.log).toHaveBeenCalledWith(dbError);
    });

    it('should verify that errors are logged but not re-thrown', async () => {
      const getAllError = new Error('Get all error');
      const createError = new Error('Create error');
      
      mockFindMany.mockRejectedValue(getAllError);
      mockReturning.mockRejectedValue(createError);

      // Both functions should not throw errors
      const getAllResult = await getAllLocationsService();
      const createResult = await createLocationService(sampleLocationData);

      expect(getAllResult).toBeUndefined();
      expect(createResult).toEqual([]);
      expect(console.log).toHaveBeenCalledTimes(2);
    });
  });

  describe('Database Integration Patterns', () => {
    it('should use correct Drizzle query pattern for findMany', async () => {
      mockFindMany.mockResolvedValue(sampleLocations);

      await getAllLocationsService();

      expect(db.query.LocationTable.findMany).toHaveBeenCalled();
      // Verify it's using Drizzle's query API pattern
      expect(db.query).toBeDefined();
      expect(db.query.LocationTable).toBeDefined();
      expect(db.query.LocationTable.findMany).toBeDefined();
    });

    it('should use correct Drizzle insert pattern', async () => {
      const expectedResult = [sampleLocationData];
      mockReturning.mockResolvedValue(expectedResult);

      await createLocationService(sampleLocationData);

      expect(db.insert).toHaveBeenCalledWith(LocationTable);
      expect(mockValues).toHaveBeenCalledWith(sampleLocationData);
      expect(mockReturning).toHaveBeenCalled();
    });

    it('should handle concurrent operations', async () => {
      mockFindMany.mockResolvedValue(sampleLocations);
      mockReturning.mockResolvedValue([sampleLocationData]);

      const promises = [
        getAllLocationsService(),
        createLocationService(sampleLocationData),
        getAllLocationsService(),
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      expect(results[0]).toEqual(sampleLocations);
      expect(results[1]).toEqual([sampleLocationData]);
      expect(results[2]).toEqual(sampleLocations);
    });
  });
});