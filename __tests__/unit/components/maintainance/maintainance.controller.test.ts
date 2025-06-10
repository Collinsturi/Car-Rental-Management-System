import {
  createMaintenanceController,
  getMaintenanceByIdController,
  getMaintenanceByCarIdController
} from '../../../../src/components/maintainance/maintainance.controller';

import * as maintenanceService from '../../../../src/components/maintainance/maintainance.service';
import { Request, Response } from 'express';

describe('Maintenance Controller', () => {
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

  describe('createMaintenanceController', () => {
    it('should return 200 on successful creation', async () => {
      const mockMaintenance = { id: 1, task: 'Oil change' };
      req.body = mockMaintenance;

      jest.spyOn(maintenanceService, 'createMaintenanceService').mockResolvedValue(mockMaintenance);

      await createMaintenanceController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Maintainance created',
        payload: mockMaintenance
      });
    });

    it('should return 500 if creation fails', async () => {
      req.body = { task: 'Replace tires' };
      jest.spyOn(maintenanceService, 'createMaintenanceService').mockResolvedValue(null);

      await createMaintenanceController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'There was an error creating a maintainance entry.'
      });
    });

    it('should return 500 if service throws', async () => {
      req.body = { task: 'Brake check' };
      jest.spyOn(maintenanceService, 'createMaintenanceService').mockRejectedValue(new Error('DB error'));

      await createMaintenanceController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'There was an error creating a maintainance entry.'
      });
    });
  });

  describe('getMaintenanceByIdController', () => {
    it('should return 200 if found', async () => {
      req.params = { maintenanceId: '1' };
      const mockData = { id: 1, task: 'Check engine' };

      jest.spyOn(maintenanceService, 'getMaintenanceByIdService').mockResolvedValue(mockData);

      await getMaintenanceByIdController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Maintenance found',
        data: mockData
      });
    });

    it('should return 404 if not found', async () => {
      req.params = { maintenanceId: '2' };
      jest.spyOn(maintenanceService, 'getMaintenanceByIdService').mockResolvedValue(null);

      await getMaintenanceByIdController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Maintenance record with ID 2 not found'
      });
    });

    it('should return 500 on error', async () => {
      req.params = { maintenanceId: '3' };
      jest.spyOn(maintenanceService, 'getMaintenanceByIdService').mockRejectedValue(new Error('Crash'));

      await getMaintenanceByIdController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to fetch maintenance by ID',
        message: 'Crash'
      });
    });
  });

  describe('getMaintenanceByCarIdController', () => {
    it('should return 200 with maintenance list', async () => {
      req.params = { carId: '5' };
      const maintenances = [{ id: 1 }, { id: 2 }];

      jest.spyOn(maintenanceService, 'getMaintenanceByCarIdService').mockResolvedValue(maintenances);

      await getMaintenanceByCarIdController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Maintenances for car ID 5',
        data: maintenances
      });
    });

    it('should return 500 on error', async () => {
      req.params = { carId: '9' };
      jest.spyOn(maintenanceService, 'getMaintenanceByCarIdService').mockRejectedValue(new Error('Fail'));

      await getMaintenanceByCarIdController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to fetch maintenances by car ID',
        message: 'Fail'
      });
    });
  });
});
