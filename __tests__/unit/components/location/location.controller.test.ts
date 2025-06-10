import {
  createLocationController,
  getAllLocationsController
} from '../../../../src/components/location/location.controller';

import * as locationService from '../../../../src/components/location/location.service';
import { Request, Response } from 'express';

describe('Location Controller', () => {
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

  describe('createLocationController', () => {
    it('should return 201 if location is created', async () => {
      req.body = { name: 'Nairobi' };
      const mockLocation = { id: 1, name: 'Nairobi' };

      jest.spyOn(locationService, 'createLocationService').mockResolvedValue(mockLocation);

      await createLocationController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Location created successfully.',
        payload: mockLocation
      });
    });

    it('should return 500 if location creation fails', async () => {
      req.body = { name: 'Mombasa' };
      jest.spyOn(locationService, 'createLocationService').mockResolvedValue(null);

      await createLocationController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'There was an error with creating a location'
      });
    });
  });

  describe('getAllLocationsController', () => {
    it('should return 200 with all locations', async () => {
      const locations = [{ id: 1, name: 'Nairobi' }];
      jest.spyOn(locationService, 'getAllLocationsService').mockResolvedValue(locations);

      await getAllLocationsController({} as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'List of all locations',
        data: locations
      });
    });

    it('should return 500 if service fails', async () => {
      jest.spyOn(locationService, 'getAllLocationsService').mockRejectedValue(new Error('Network error'));

      await getAllLocationsController({} as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'There was an error in getting all the available locations.'
      });
    });
  });
});
