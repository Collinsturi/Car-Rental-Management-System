import {
  createCarController,
  getCarByIdController,
  getCarByModel,
  getAllAvailableCars,
  getCarsByLocation,
  updateCarsController
} from '../../../../src/components/car/car.controller';

import * as carService from '../../../../src/components/car/car.service';
import { Request, Response } from 'express';

describe('Car Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;
    req = {};
    res = {
      status: statusMock,
      json: jsonMock
    };
  });

  describe('createCarController', () => {
    it('should return 201 when car is created successfully', async () => {
      req.body = { make: 'Toyota' };
      jest.spyOn(carService, 'createCarService').mockResolvedValue({ id: 1, make: 'Toyota' });

      await createCarController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Car created successfully',
        data: { id: 1, make: 'Toyota' }
      });
    });

    it('should return 400 when service returns an array', async () => {
      req.body = {};
      jest.spyOn(carService, 'createCarService').mockResolvedValue([]);

      await createCarController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Car was not created.' });
    });

    it('should handle errors and return 500', async () => {
      req.body = {};
      jest.spyOn(carService, 'createCarService').mockRejectedValue(new Error('DB Error'));

      await createCarController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to create car',
        message: 'DB Error'
      });
    });
  });

  describe('getCarByIdController', () => {
    it('should return 200 if car is found', async () => {
      req.params = { carId: '1' };
      jest.spyOn(carService, 'getCarByIdService').mockResolvedValue({ id: 1 });

      await getCarByIdController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Car details for ID: 1',
        data: { id: 1 }
      });
    });

    it('should return 404 if car is not found', async () => {
      req.params = { carId: '2' };
      jest.spyOn(carService, 'getCarByIdService').mockResolvedValue(null);

      await getCarByIdController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        message: `Car with ID '2' not found.`
      });
    });

    it('should handle errors and return 500', async () => {
      req.params = { carId: '1' };
      jest.spyOn(carService, 'getCarByIdService').mockRejectedValue(new Error('Service failed'));

      await getCarByIdController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to retrieve car',
        message: 'Service failed'
      });
    });
  });

  describe('getCarByModel', () => {
    it('should return 200 when cars are found', async () => {
      req.params = { model: 'Civic' };
      jest.spyOn(carService, 'getCarsByCarModelService').mockResolvedValue([{ id: 1, model: 'Civic' }]);

      await getCarByModel(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Cars with model: Civic',
        data: [{ id: 1, model: 'Civic' }]
      });
    });

    it('should return 404 when no cars are found', async () => {
      req.params = { model: 'Unknown' };
      jest.spyOn(carService, 'getCarsByCarModelService').mockResolvedValue([]);

      await getCarByModel(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'There was no cars with model: Unknown'
      });
    });

    it('should handle error', async () => {
      req.params = { model: 'Tesla' };
      jest.spyOn(carService, 'getCarsByCarModelService').mockRejectedValue(new Error('Fail'));

      await getCarByModel(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to retrieve cars by model',
        message: 'Fail'
      });
    });
  });

  describe('getAllAvailableCars', () => {
    it('should return 200 with cars', async () => {
      jest.spyOn(carService, 'getAllAvailableCarsService').mockResolvedValue([{ id: 1 }]);

      await getAllAvailableCars(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'List of all available cars',
        data: [{ id: 1 }]
      });
    });

    it('should return 200 with no cars', async () => {
      jest.spyOn(carService, 'getAllAvailableCarsService').mockResolvedValue([]);

      await getAllAvailableCars(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'No cars are available.'
      });
    });

    it('should handle error', async () => {
      jest.spyOn(carService, 'getAllAvailableCarsService').mockRejectedValue(new Error('DB Error'));

      await getAllAvailableCars(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to retrieve available cars',
        message: 'DB Error'
      });
    });
  });

  describe('getCarsByLocation', () => {
    it('should return 200 with data', async () => {
      req.params = { location: 'Nairobi' };
      jest.spyOn(carService, 'getAllCarsInACertainLocationService').mockResolvedValue([{ id: 1 }]);

      await getCarsByLocation(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'List of all cars in location: Nairobi',
        data: [{ id: 1 }]
      });
    });

    it('should return 200 with empty list', async () => {
      req.params = { location: 'Mars' };
      jest.spyOn(carService, 'getAllCarsInACertainLocationService').mockResolvedValue([]);

      await getCarsByLocation(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'There are no cars that exist in location Mars'
      });
    });

    it('should handle error', async () => {
      req.params = { location: 'Nairobi' };
      jest.spyOn(carService, 'getAllCarsInACertainLocationService').mockRejectedValue(new Error('DB Fail'));

      await getCarsByLocation(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to retrieve cars by location',
        message: 'DB Fail'
      });
    });
  });

  describe('updateCarsController', () => {
    it('should return 200 on successful update', async () => {
      req.body = { id: 1, make: 'Ford' };
      jest.spyOn(carService, 'updateCarsService').mockReturnValue({ id: 1, make: 'Ford' });

      await updateCarsController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Car updated successfully.',
        data: { id: 1, make: 'Ford' }
      });
    });

    it('should return 500 if update fails', async () => {
      req.body = { id: 1 };
      jest.spyOn(carService, 'updateCarsService').mockReturnValue(null);

      await updateCarsController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'There was an error in updating the car'
      });
    });
  });
});
