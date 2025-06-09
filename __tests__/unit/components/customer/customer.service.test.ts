import {
  createCustomerService,
  getCustomerByEmailService,
  getCustomerByIdService,
  getAllCustomersService,
  deleteCustomerService,
  updateCustomerService,
} from '../../../../src/components/customer/customer.service';

import db from '../../../../src/Drizzle/db';
import { eq } from 'drizzle-orm';
import { CustomerTable, UsersTable, CustomerEntity } from '../../../../src/Drizzle/schema';

// Mock database and ORM
jest.mock('../../../../src/Drizzle/db', () => ({
  __esModule: true,
  default: {},
}));
jest.mock('drizzle-orm', () => ({
  eq: jest.fn(),
}));
jest.mock('../../../../src/Drizzle/schema', () => ({
  CustomerTable: { customerID: 'customerID', userID: 'userID' },
  UsersTable: { userID: 'userID', email: 'email' },
}));

describe('Customer Service', () => {
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

  const mockEq = eq as jest.MockedFunction<typeof eq>;

  beforeEach(() => {
    jest.clearAllMocks();

    (db as any).insert = mockInsert;
    (db as any).select = mockSelect;
    (db as any).delete = mockDelete;
    (db as any).update = mockUpdate;

    mockInsert.mockReturnValue({ values: mockValues });
    mockValues.mockReturnValue({ returning: mockReturning });

    mockSelect.mockReturnValue({ from: mockFrom });
    mockFrom.mockReturnValue({ leftJoin: mockLeftJoin, where: mockWhere });
    mockLeftJoin.mockReturnValue({ where: mockWhere });

    mockDelete.mockReturnValue({ where: mockWhere });
    mockUpdate.mockReturnValue({ set: mockSet });
    mockSet.mockReturnValue({ where: mockWhere });

    mockWhere.mockReturnValue({ returning: mockReturning });

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

    it('should handle database errors during creation', async () => {
      mockReturning.mockRejectedValue(new Error('DB fail'));
      await expect(createCustomerService({ userID: 1 })).rejects.toThrow('DB fail');
    });
  });

  describe('getCustomerByEmailService', () => {
    it('should return customer by email', async () => {
      const email = 'test@example.com';
      const expected = [{
        users: { userID: 1, email, firstName: 'John' },
        customer: { customerID: 1, userID: 1 }
      }];
      mockWhere.mockResolvedValue(expected);

      const result = await getCustomerByEmailService(email);

      expect(mockEq).toHaveBeenCalledWith(UsersTable.email, email);
      expect(mockWhere).toHaveBeenCalledWith('mocked_eq_condition');
      expect(result).toEqual(expected);
    });

    it('should return empty when not found', async () => {
      mockWhere.mockResolvedValue([]);
      const result = await getCustomerByEmailService('nope@example.com');
      expect(result).toEqual([]);
    });
  });

  describe('getCustomerByIdService', () => {
    it('should return customer by ID', async () => {
      const expected = [{
        customer: { customerID: 1, userID: 1 },
        users: { userID: 1, email: 'test@example.com', firstName: 'John' }
      }];
      mockWhere.mockResolvedValue(expected);
      const result = await getCustomerByIdService(1);
      expect(result).toEqual(expected);
    });
  });

  describe('getAllCustomersService', () => {
    it('should return all customers', async () => {
      const expected = [
        { customer: { customerID: 1, userID: 1 }, users: { userID: 1, email: 'a@test.com', firstName: 'A' } },
        { customer: { customerID: 2, userID: 2 }, users: { userID: 2, email: 'b@test.com', firstName: 'B' } }
      ];
      mockLeftJoin.mockResolvedValue(expected);
      const result = await getAllCustomersService();
      expect(result).toEqual(expected);
    });
  });

  describe('deleteCustomerService', () => {
    it('should delete customer by ID', async () => {
      const expected = { affectedRows: 1 };
      mockWhere.mockResolvedValue(expected);
      const result = await deleteCustomerService(1);
      expect(result).toEqual(expected);
    });
  });

  describe('updateCustomerService', () => {
    it('should update customer info', async () => {
      const customerData: CustomerEntity = { customerID: 1, userID: 1 };
      const expected = [customerData];
      mockReturning.mockResolvedValue(expected);
      const result = await updateCustomerService(customerData);
      expect(result).toEqual(expected);
    });
  });

  describe('Edge cases', () => {
    it('should return empty when null passed to create', async () => {
      mockReturning.mockResolvedValue([]);
      const result = await createCustomerService(null);
      expect(result).toEqual([]);
    });

    it('should return empty for blank email', async () => {
      mockWhere.mockResolvedValue([]);
      const result = await getCustomerByEmailService('');
      expect(result).toEqual([]);
    });

    it('should return empty for negative ID', async () => {
      mockWhere.mockResolvedValue([]);
      const result = await getCustomerByIdService(-5);
      expect(result).toEqual([]);
    });
  });

  afterAll(() => {
   
  });
});
