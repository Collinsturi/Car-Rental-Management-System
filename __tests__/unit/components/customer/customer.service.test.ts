import {
  createCustomerService,
  getCustomerByEmailService,
  getCustomerByIdService,
  getAllCustomersService,
  deleteCustomerService,
  updateCustomerService,
} from '../../../../src/components/customer/customer.service'; // Adjust the import path as needed

import db from '../../../../src/Drizzle/db';
import { eq } from 'drizzle-orm';
import { CustomerTable, UsersTable, CustomerEntity } from '../../../../src/Drizzle/schema';

// Mock the database and drizzle-orm
jest.mock('../../../../src/Drizzle/db');
jest.mock('drizzle-orm', () => ({
  eq: jest.fn(),
}));

// Mock the schema tables
jest.mock('../../../../src/Drizzle/schema', () => ({
  CustomerTable: {
    customerID: 'customerID',
    userID: 'userID',
  },
  UsersTable: {
    userID: 'userID',
    email: 'email',
  },
}));

describe('Customer Service', () => {
  // Mock database operations
  const mockInsert = jest.fn();
  const mockSelect = jest.fn();
  const mockDelete = jest.fn();
  const mockUpdate = jest.fn();
  const mockValues = jest.fn();
  const mockReturning = jest.fn();
  const mockFrom = jest.fn();
  const mockLeftJoin = jest.fn();
  const mockWhere = jest.fn();
  const mockSet = jest.fn();

  // Mock eq function
  const mockEq = eq as jest.MockedFunction<typeof eq>;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup database mock chain
    (db as any).insert = mockInsert;
    (db as any).select = mockSelect;
    (db as any).delete = mockDelete;
    (db as any).update = mockUpdate;

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
    
    mockDelete.mockReturnValue({ where: mockWhere });
    
    mockUpdate.mockReturnValue({ 
      set: mockSet,
    });
    
    mockSet.mockReturnValue({ 
      where: mockWhere,
    });
    
    mockWhere.mockReturnValue({ 
      returning: mockReturning,
    });

    // Mock eq function
    mockEq.mockReturnValue('mocked_eq_condition' as any);
  });

  describe('createCustomerService', () => {
    it('should create a customer successfully', async () => {
      const customerData = { userID: 1 };
      const expectedResult = [{ customerID: 1, userID: 1 }];
      
      mockReturning.mockResolvedValue(expectedResult);

      const result = await createCustomerService(customerData);

      expect(db.insert).toHaveBeenCalledWith(CustomerTable);
      expect(mockValues).toHaveBeenCalledWith(customerData);
      expect(mockReturning).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('should handle database errors during customer creation', async () => {
      const customerData = { userID: 1 };
      const error = new Error('Database connection failed');
      
      mockReturning.mockRejectedValue(error);

      await expect(createCustomerService(customerData)).rejects.toThrow('Database connection failed');
    });
  });

  describe('getCustomerByEmailService', () => {
    it('should get customer by email successfully', async () => {
      const email = 'test@example.com';
      const expectedResult = [{
        users: { userID: 1, email: 'test@example.com', firstName: 'John' },
        customer: { customerID: 1, userID: 1 }
      }];
      
      mockWhere.mockResolvedValue(expectedResult);

      const result = await getCustomerByEmailService(email);

      expect(db.select).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(UsersTable);
      expect(mockLeftJoin).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith(UsersTable.email, email);
      expect(mockWhere).toHaveBeenCalledWith('mocked_eq_condition');
      expect(result).toEqual(expectedResult);
    });

    it('should return empty array when customer not found by email', async () => {
      const email = 'nonexistent@example.com';
      
      mockWhere.mockResolvedValue([]);

      const result = await getCustomerByEmailService(email);

      expect(result).toEqual([]);
    });

    it('should handle database errors during email lookup', async () => {
      const email = 'test@example.com';
      const error = new Error('Database query failed');
      
      mockWhere.mockRejectedValue(error);

      await expect(getCustomerByEmailService(email)).rejects.toThrow('Database query failed');
    });
  });

  describe('getCustomerByIdService', () => {
    it('should get customer by ID successfully', async () => {
      const customerId = 1;
      const expectedResult = [{
        customer: { customerID: 1, userID: 1 },
        users: { userID: 1, email: 'test@example.com', firstName: 'John' }
      }];
      
      mockWhere.mockResolvedValue(expectedResult);

      const result = await getCustomerByIdService(customerId);

      expect(db.select).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(CustomerTable);
      expect(mockLeftJoin).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith(CustomerTable.customerID, customerId);
      expect(mockWhere).toHaveBeenCalledWith('mocked_eq_condition');
      expect(result).toEqual(expectedResult);
    });

    it('should return empty array when customer not found by ID', async () => {
      const customerId = 999;
      
      mockWhere.mockResolvedValue([]);

      const result = await getCustomerByIdService(customerId);

      expect(result).toEqual([]);
    });

    it('should handle database errors during ID lookup', async () => {
      const customerId = 1;
      const error = new Error('Database connection timeout');
      
      mockWhere.mockRejectedValue(error);

      await expect(getCustomerByIdService(customerId)).rejects.toThrow('Database connection timeout');
    });
  });

  describe('getAllCustomersService', () => {
    it('should get all customers successfully', async () => {
      const expectedResult = [
        {
          customer: { customerID: 1, userID: 1 },
          users: { userID: 1, email: 'test1@example.com', firstName: 'John' }
        },
        {
          customer: { customerID: 2, userID: 2 },
          users: { userID: 2, email: 'test2@example.com', firstName: 'Jane' }
        }
      ];
      
      mockLeftJoin.mockResolvedValue(expectedResult);

      const result = await getAllCustomersService();

      expect(db.select).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(CustomerTable);
      expect(mockLeftJoin).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('should return empty array when no customers exist', async () => {
      mockLeftJoin.mockResolvedValue([]);

      const result = await getAllCustomersService();

      expect(result).toEqual([]);
    });

    it('should handle database errors during get all customers', async () => {
      const error = new Error('Database server error');
      
      mockLeftJoin.mockRejectedValue(error);

      await expect(getAllCustomersService()).rejects.toThrow('Database server error');
    });
  });

  describe('deleteCustomerService', () => {
    it('should delete customer successfully', async () => {
      const customerId = 1;
      const expectedResult = { affectedRows: 1 };
      
      mockWhere.mockResolvedValue(expectedResult);

      const result = await deleteCustomerService(customerId);

      expect(db.delete).toHaveBeenCalledWith(CustomerTable);
      expect(mockEq).toHaveBeenCalledWith(CustomerTable.customerID, customerId);
      expect(mockWhere).toHaveBeenCalledWith('mocked_eq_condition');
      expect(result).toEqual(expectedResult);
    });

    it('should handle deletion of non-existent customer', async () => {
      const customerId = 999;
      const expectedResult = { affectedRows: 0 };
      
      mockWhere.mockResolvedValue(expectedResult);

      const result = await deleteCustomerService(customerId);

      expect(result).toEqual(expectedResult);
    });

    it('should handle database errors during deletion', async () => {
      const customerId = 1;
      const error = new Error('Foreign key constraint violation');
      
      mockWhere.mockRejectedValue(error);

      await expect(deleteCustomerService(customerId)).rejects.toThrow('Foreign key constraint violation');
    });
  });

  describe('updateCustomerService', () => {
    it('should update customer successfully', async () => {
      const customerData: CustomerEntity = {
        customerID: 1,
        userID: 1,
      };
      const expectedResult = [{ customerID: 1, userID: 1 }];
      
      mockReturning.mockResolvedValue(expectedResult);

      const result = await updateCustomerService(customerData);

      expect(db.update).toHaveBeenCalledWith(CustomerTable);
      expect(mockSet).toHaveBeenCalledWith(customerData);
      expect(mockEq).toHaveBeenCalledWith(CustomerTable.customerID, customerData.customerID);
      expect(mockWhere).toHaveBeenCalledWith('mocked_eq_condition');
      expect(mockReturning).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('should handle update of non-existent customer', async () => {
      const customerData: CustomerEntity = {
        customerID: 999,
        userID: 1,
      };
      
      mockReturning.mockResolvedValue([]);

      const result = await updateCustomerService(customerData);

      expect(result).toEqual([]);
    });

    it('should handle database errors during update', async () => {
      const customerData: CustomerEntity = {
        customerID: 1,
        userID: 1,
      };
      const error = new Error('Validation constraint failed');
      
      mockReturning.mockRejectedValue(error);

      await expect(updateCustomerService(customerData)).rejects.toThrow('Validation constraint failed');
    });
  });
});

// Additional integration-style tests for edge cases
describe('Customer Service Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle null/undefined input gracefully', async () => {
    const mockReturning = jest.fn();
    (db as any).insert = jest.fn().mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: mockReturning
      })
    });

    mockReturning.mockResolvedValue([]);

    const result = await createCustomerService(null);
    expect(result).toEqual([]);
  });

  it('should handle empty string email in getCustomerByEmailService', async () => {
    const mockWhere = jest.fn();
    (db as any).select = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        leftJoin: jest.fn().mockReturnValue({
          where: mockWhere
        })
      })
    });

    mockWhere.mockResolvedValue([]);

    const result = await getCustomerByEmailService('');
    expect(result).toEqual([]);
  });

  it('should handle negative ID in getCustomerByIdService', async () => {
    const mockWhere = jest.fn();
    (db as any).select = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        leftJoin: jest.fn().mockReturnValue({
          where: mockWhere
        })
      })
    });

    mockWhere.mockResolvedValue([]);

    const result = await getCustomerByIdService(-1);
    expect(result).toEqual([]);
  });
});