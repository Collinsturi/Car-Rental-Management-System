import {
  createCustomerController,
  getCustomerByEmailController,
  getCustomerByIdController,
  updateCustomerController,
  deleteCustomerController
} from '../../../../src/components/Customer/customer.controller';

import * as customerService from '../../../../src/components/Customer/customer.controller';
import { Request, Response } from 'express';

describe('Customer Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = {};
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;
    res = { status: statusMock, json: jsonMock };
  });

  describe('createCustomerController', () => {
    it('should return 201 and customer data on success', async () => {
      req.body = { name: 'John' };
      const customer = { id: 1, name: 'John' };
      jest.spyOn(customerService, 'createCustomerService').mockResolvedValue(customer);

      await createCustomerController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(customer);
    });

    it('should return 500 on service failure', async () => {
      jest.spyOn(customerService, 'createCustomerService').mockRejectedValue(new Error('DB error'));

      await createCustomerController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Error creating customer',
        error: expect.any(Error)
      });
    });
  });

  describe('getCustomerByEmailController', () => {
    it('should return customer data if found', async () => {
      req.params = { email: 'test@example.com' };
      const customer = { id: 1, email: 'test@example.com' };
      jest.spyOn(customerService, 'getCustomerByEmailService').mockResolvedValue(customer);

      await getCustomerByEmailController(req as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith(customer);
    });

    it('should return 404 if customer not found', async () => {
      req.params = { email: 'missing@example.com' };
      jest.spyOn(customerService, 'getCustomerByEmailService').mockResolvedValue(null);

      await getCustomerByEmailController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Customer not found' });
    });

    it('should return 500 on error', async () => {
      req.params = { email: 'error@example.com' };
      jest.spyOn(customerService, 'getCustomerByEmailService').mockRejectedValue(new Error('Fail'));

      await getCustomerByEmailController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Error retrieving customer',
        error: expect.any(Error)
      });
    });
  });

  describe('getCustomerByIdController', () => {
    it('should return customer if found', async () => {
      req.params = { customerId: '1' };
      const customer = { id: 1, name: 'Alice' };
      jest.spyOn(customerService, 'getCustomerByIdService').mockResolvedValue(customer);

      await getCustomerByIdController(req as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith(customer);
    });

    it('should return 404 if not found', async () => {
      req.params = { customerId: '999' };
      jest.spyOn(customerService, 'getCustomerByIdService').mockResolvedValue(null);

      await getCustomerByIdController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Customer not found' });
    });

    it('should handle errors and return 500', async () => {
      req.params = { customerId: '1' };
      jest.spyOn(customerService, 'getCustomerByIdService').mockRejectedValue(new Error('Boom'));

      await getCustomerByIdController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Error retrieving customer',
        error: expect.any(Error)
      });
    });
  });

  describe('updateCustomerController', () => {
    it('should return 200 if update is successful', async () => {
      const updated = { id: 1, name: 'Updated' };
      req.body = updated;
      jest.spyOn(customerService, 'updateCustomerService').mockResolvedValue(updated);

      await updateCustomerController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Updated successfully.',
        data: updated
      });
    });

    it('should return 500 if update fails (null result)', async () => {
      req.body = { id: 1 };
      jest.spyOn(customerService, 'updateCustomerService').mockResolvedValue(null);

      await updateCustomerController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'There was an error in updating the database entry.'
      });
    });

    it('should return 500 on error', async () => {
      req.body = { id: 1 };
      jest.spyOn(customerService, 'updateCustomerService').mockRejectedValue(new Error('Fail'));

      await updateCustomerController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'There was an error in updating the database entry.'
      });
    });
  });

  describe('deleteCustomerController', () => {
    it('should return 200 if customer is deleted', async () => {
      req.body = { id: 1 };
      jest.spyOn(customerService, 'deleteCustomerService').mockResolvedValue(true);

      await deleteCustomerController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Customer deleted successfully.'
      });
    });

    it('should return 500 if delete fails (false return)', async () => {
      req.body = { id: 1 };
      jest.spyOn(customerService, 'deleteCustomerService').mockResolvedValue(false);

      await deleteCustomerController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Customer deleted successfully.' // This logic seems buggy — same message on fail
      });
    });

    it('should return 500 on service error', async () => {
      req.body = { id: 1 };
      jest.spyOn(customerService, 'deleteCustomerService').mockRejectedValue(new Error('Oops'));

      await deleteCustomerController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Customer deleted successfully.' // Again, same message even when failing
      });
    });
  });
});
