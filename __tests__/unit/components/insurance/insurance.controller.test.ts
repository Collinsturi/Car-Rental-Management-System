import {
  createInsuranceController,
  getInsuranceByIdController,
  getInsurancesByCarIdController,
  getInsurancesByProviderController,
  getAllInsurancesController,
} from '../../../../src/components/Insurance/insurance.controller';

import * as insuranceService from '../../../../src/components/Insurance/insurance.service';
import { Request, Response } from 'express';

describe('Insurance Controller', () => {
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

  describe('createInsuranceController', () => {
    it('should return 201 and insurance data on success', async () => {
      const mockInsurance = { id: 1, policyNumber: 'ABC123' };
      req.body = mockInsurance;

      jest
        .spyOn(insuranceService, 'createInsuranceService')
        .mockResolvedValue(mockInsurance);

      await createInsuranceController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Insurance created',
        data: mockInsurance,
      });
    });

    it('should return 500 on failure', async () => {
      req.body = { policyNumber: 'XYZ' };
      jest
        .spyOn(insuranceService, 'createInsuranceService')
        .mockRejectedValue(new Error('DB fail'));

      await createInsuranceController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to create insurance',
        message: 'DB fail',
      });
    });
  });

  describe('getInsuranceByIdController', () => {
    it('should return 200 if insurance is found', async () => {
      req.params = { insuranceId: '1' };
      const mockInsurance = { id: 1, policyNumber: 'DEF456' };

      jest
        .spyOn(insuranceService, 'getInsuranceByIdService')
        .mockResolvedValue(mockInsurance);

      await getInsuranceByIdController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Insurance found',
        data: mockInsurance,
      });
    });

    it('should return 404 if insurance not found', async () => {
      req.params = { insuranceId: '2' };
      jest
        .spyOn(insuranceService, 'getInsuranceByIdService')
        .mockResolvedValue(null);

      await getInsuranceByIdController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Insurance with ID 2 not found',
      });
    });

    it('should return 500 on error', async () => {
      req.params = { insuranceId: '3' };
      jest
        .spyOn(insuranceService, 'getInsuranceByIdService')
        .mockRejectedValue(new Error('Error'));

      await getInsuranceByIdController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to get insurance',
        message: 'Error',
      });
    });
  });

  describe('getInsurancesByCarIdController', () => {
    it('should return 200 and list of insurances for car ID', async () => {
      req.params = { carId: '1' };
      const insurances = [{ id: 1 }, { id: 2 }];
      jest
        .spyOn(insuranceService, 'getInsurancesByCarIdService')
        .mockResolvedValue(insurances);

      await getInsurancesByCarIdController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Insurances for car ID 1',
        data: insurances,
      });
    });

    it('should return 500 on service failure', async () => {
      req.params = { carId: '5' };
      jest
        .spyOn(insuranceService, 'getInsurancesByCarIdService')
        .mockRejectedValue(new Error('Fail'));

      await getInsurancesByCarIdController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to get insurances by car ID',
        message: 'Fail',
      });
    });
  });

  describe('getInsurancesByProviderController', () => {
    it('should return 200 and list of insurances for provider', async () => {
      req.params = { provider: 'Axa' };
      const insurances = [{ id: 1 }, { id: 2 }];
      jest
        .spyOn(insuranceService, 'getInsurancesByProviderService')
        .mockResolvedValue(insurances);

      await getInsurancesByProviderController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Insurances from provider: Axa',
        data: insurances,
      });
    });

    it('should return 500 on failure', async () => {
      req.params = { provider: 'Allianz' };
      jest
        .spyOn(insuranceService, 'getInsurancesByProviderService')
        .mockRejectedValue(new Error('DB crash'));

      await getInsurancesByProviderController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to get insurances by provider',
        message: 'DB crash',
      });
    });
  });

  describe('getAllInsurancesController', () => {
    it('should return 200 and all insurances', async () => {
      const allInsurances = [{ id: 1 }, { id: 2 }, { id: 3 }];
      jest
        .spyOn(insuranceService, 'getAllInsurancesService')
        .mockResolvedValue(allInsurances);

      await getAllInsurancesController({} as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'All insurances',
        data: allInsurances,
      });
    });

    it('should return 500 on failure', async () => {
      jest
        .spyOn(insuranceService, 'getAllInsurancesService')
        .mockRejectedValue(new Error('Down'));

      await getAllInsurancesController({} as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to get all insurances',
        message: 'Down',
      });
    });
  });
});
