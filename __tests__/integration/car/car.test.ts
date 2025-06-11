import request from 'supertest';
import app from '../../../src/index'; 
import * as carService from '../../../src/components/car/car.service'; 

// Mock the entire car.service module to prevent actual database calls.
// This ensures that our integration tests for routes only test the Express layer (routes, controllers)
// and not the data access layer.
jest.mock('../../../src/components/car/car.service');

const mockedCarService = carService as jest.Mocked<typeof carService>;

describe('Car API Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test suite for POST /cars (Create Car)
    describe('POST /cars', () => {
        it('should create a new car successfully', async () => {
            const newCarData = {
                carModel: 'Toyota Camry',
                year: '2022-01-01',
                color: 'Blue',
                rentalRate: '50.00',
                availability: true,
                locationID: 1
            };
            const createdCar = { carID: 1, ...newCarData };

            mockedCarService.createCarService.mockResolvedValue(createdCar);

            //Act
            const res = await request(app)
                .post('/cars')
                .send(newCarData);

            //Assert
            expect(res.statusCode).toEqual(201);
            expect(res.body.message).toEqual('Car created successfully');
            expect(res.body.data).toEqual(createdCar);
            expect(mockedCarService.createCarService).toHaveBeenCalledWith(newCarData);
        });

        // it('should return 400 if car creation fails (e.g., service returns empty array)', async () => {
        //     const newCarData = {
        //         carModel: 'Toyota Camry',
        //         year: '2022-01-01',
        //         rentalRate: '50.00',
        //     };
        //     // Mock the service to return an empty array, as per controller logic for failure
        //     mockedCarService.createCarService.mockResolvedValue([]);

        //     //Act
        //     const res = await request(app)
        //         .post('/cars')
        //         .send(newCarData);

        //     //Assert
        //     expect(res.statusCode).toEqual(400);
        //     expect(res.body.message).toEqual('Car was not created.');
        //     expect(mockedCarService.createCarService).toHaveBeenCalledWith(newCarData);
        // });

        it('should return 500 if an error occurs during car creation', async () => {
            const newCarData = {
                carModel: 'Toyota Camry',
                year: '2022-01-01',
                rentalRate: '50.00',
            };
            const errorMessage = 'Database error during car creation';
            // Mock the service to throw an error
            mockedCarService.createCarService.mockRejectedValue(new Error(errorMessage));

            //Act
            const res = await request(app)
                .post('/cars')
                .send(newCarData);

            //Assert
            expect(res.statusCode).toEqual(500);
            expect(res.body.error).toEqual('Failed to create car');
            expect(res.body.message).toEqual(errorMessage);
        });
    });

    // Test suite for GET /cars/find/:carId (Get Car by ID)
    describe('GET /cars/find/:carId', () => {
        it('should return a car by ID', async () => {
            const carId = 1;
            const mockCar = {
                carID: carId,
                carModel: 'Honda Civic',
                year: '2020-01-01',
                color: 'Red',
                rentalRate: '40.00',
                availability: true,
                locationID: 1
            };
            mockedCarService.getCarByIdService.mockResolvedValue(mockCar);

            //Act
            const res = await request(app).get(`/cars/find/${carId}`);

            //Assert
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual(`Car details for ID: ${carId}`);
            expect(res.body.data).toEqual(mockCar);
            expect(mockedCarService.getCarByIdService).toHaveBeenCalledWith(carId);
        });

        it('should return 404 if car is not found by ID', async () => {
            const carId = 999;
            mockedCarService.getCarByIdService.mockResolvedValue(null);

            //Act
            const res = await request(app).get(`/cars/find/${carId}`);

            //Assert
            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toEqual(`Car with ID '${carId}' not found.`);
            expect(mockedCarService.getCarByIdService).toHaveBeenCalledWith(carId);
        });

        it('should return 500 if an error occurs while getting car by ID', async () => {
            const carId = 1;
            const errorMessage = 'Database error getting car by ID';
            mockedCarService.getCarByIdService.mockRejectedValue(new Error(errorMessage));

            //Act
            const res = await request(app).get(`/cars/find/${carId}`);

            //Assert
            expect(res.statusCode).toEqual(500);
            expect(res.body.error).toEqual('Failed to retrieve car');
            expect(res.body.message).toEqual(errorMessage);
        });
    });

    // Test suite for GET /cars/model/:model (Get Car by Model)
    describe('GET /cars/model/:model', () => {
        it('should return cars by model', async () => {
            const model = 'Ford Focus';
            const mockCars = [
                { carID: 2, carModel: model, year: '2019-01-01', color: 'Black', rentalRate: '35.00', availability: true, locationID: 2 },
                { carID: 3, carModel: model, year: '2021-01-01', color: 'White', rentalRate: '45.00', availability: true, locationID: 1 },
            ];
            mockedCarService.getCarsByCarModelService.mockResolvedValue(mockCars);

            //Act
            const res = await request(app).get(`/cars/model/${model}`);

            //Assert
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual(`Cars with model: ${model}`);
            expect(res.body.data).toEqual(mockCars);
            expect(mockedCarService.getCarsByCarModelService).toHaveBeenCalledWith(model);
        });

        it('should return 404 if no cars found for the model', async () => {
            const model = 'NonExistentModel';
            mockedCarService.getCarsByCarModelService.mockResolvedValue([]);

            //Act
            const res = await request(app).get(`/cars/model/${model}`);

            //Arrange
            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toEqual(`There was no cars with model: ${model}`);
            expect(mockedCarService.getCarsByCarModelService).toHaveBeenCalledWith(model);
        });

        it('should return 500 if an error occurs while getting cars by model', async () => {
            const model = 'Ford Focus';
            const errorMessage = 'Database error getting cars by model';
            mockedCarService.getCarsByCarModelService.mockRejectedValue(new Error(errorMessage));

            //Act
            const res = await request(app).get(`/cars/model/${model}`);

            //Assert
            expect(res.statusCode).toEqual(500);
            expect(res.body.error).toEqual('Failed to retrieve cars by model');
            expect(res.body.message).toEqual(errorMessage);
        });
    });

    // Test suite for GET /cars/available (Get All Available Cars)
    describe('GET /cars/available', () => {
        it('should return all available cars', async () => {
            const mockAvailableCars = [
                { carID: 1, carModel: 'Honda Civic', year: '2020-01-01', color: 'Red', rentalRate: '40.00', availability: true, locationID: 1 },
                { carID: 3, carModel: 'Ford Focus', year: '2021-01-01', color: 'White', rentalRate: '45.00', availability: true, locationID: 1 },
            ];
            mockedCarService.getAllAvailableCarsService.mockResolvedValue(mockAvailableCars);

            //Act
            const res = await request(app).get('/cars/available');

            //Assert
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('List of all available cars');
            expect(res.body.data).toEqual(mockAvailableCars);
            expect(mockedCarService.getAllAvailableCarsService).toHaveBeenCalledTimes(1);
        });

        it('should return 200 with message if no cars are available', async () => {
            mockedCarService.getAllAvailableCarsService.mockResolvedValue([]);

            //Act
            const res = await request(app).get('/cars/available');

            //Assert
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('No cars are available.');
            expect(res.body.data).toBeUndefined(); // Data should be undefined if message is present
            expect(mockedCarService.getAllAvailableCarsService).toHaveBeenCalledTimes(1);
        });

        it('should return 500 if an error occurs while getting available cars', async () => {
            const errorMessage = 'Database error getting available cars';
            mockedCarService.getAllAvailableCarsService.mockRejectedValue(new Error(errorMessage));

            //Act
            const res = await request(app).get('/cars/available');

            //Assert
            expect(res.statusCode).toEqual(500);
            expect(res.body.error).toEqual('Failed to retrieve available cars');
            expect(res.body.message).toEqual(errorMessage);
        });
    });

    // Test suite for GET /cars/location/:location (Get Cars by Location)
    describe('GET /cars/location/:location', () => {
        it('should return cars for a specific location', async () => {
            const location = 'Nairobi';
            const mockCarsInLocation = [
                { carID: 1, carModel: 'Honda Civic', year: '2020-01-01', color: 'Red', rentalRate: '40.00', availability: true, locationID: 1 },
                { carID: 5, carModel: 'BMW X5', year: '2023-01-01', color: 'Gray', rentalRate: '100.00', availability: true, locationID: 1 },
            ];
            mockedCarService.getAllCarsInACertainLocationService.mockResolvedValue(mockCarsInLocation);

            //Act
            const res = await request(app).get(`/cars/location/${location}`);

            //Assert
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual(`List of all cars in location: ${location}`);
            expect(res.body.data).toEqual(mockCarsInLocation);
            expect(mockedCarService.getAllCarsInACertainLocationService).toHaveBeenCalledWith(location);
        });

        it('should return 200 with message if no cars found for the location', async () => {
            const location = 'NonExistentLocation';
            mockedCarService.getAllCarsInACertainLocationService.mockResolvedValue([]);

            //Act
            const res = await request(app).get(`/cars/location/${location}`);

            //Assert
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual(`There are no cars that exist in location ${location}`);
            expect(res.body.data).toBeUndefined(); // Data should be undefined if message is present
            expect(mockedCarService.getAllCarsInACertainLocationService).toHaveBeenCalledWith(location);
        });

        it('should return 500 if an error occurs while getting cars by location', async () => {
            const location = 'Nairobi';
            const errorMessage = 'Database error getting cars by location';
            mockedCarService.getAllCarsInACertainLocationService.mockRejectedValue(new Error(errorMessage));

            //Act
            const res = await request(app).get(`/cars/location/${location}`);

            //Assert
            expect(res.statusCode).toEqual(500);
            expect(res.body.error).toEqual('Failed to retrieve cars by location');
            expect(res.body.message).toEqual(errorMessage);
        });
    });

    // Test suite for PATCH /cars/ (Update Cars)
    describe('PATCH /cars/', () => {
        it('should update a car successfully', async () => {
            const updateData = {
                carID: 1,
                color: 'Dark Blue',
                rentalRate: '55.00'
            };
            const updatedCarResult = { carID: 1, carModel: 'Honda Civic', year: '2020-01-01', color: 'Dark Blue', rentalRate: '55.00', availability: true, locationID: 1 };
            // Mock the service to return the updated car data
            mockedCarService.updateCarsService.mockReturnValue(updatedCarResult);

            //Act
            const res = await request(app)
                .patch('/cars/')
                .send(updateData);


            //Assert
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('Car updated successfully.');
            expect(res.body.data).toEqual(updatedCarResult);
            expect(mockedCarService.updateCarsService).toHaveBeenCalledWith(updateData);
        });

        it('should return 500 if car update fails', async () => {
            const updateData = {
                carID: 1,
                color: 'Dark Blue',
            };
            // Mock the service to return a falsy value (null or undefined)
            mockedCarService.updateCarsService.mockReturnValue(null);

            //Act
            const res = await request(app)
                .patch('/cars/')
                .send(updateData);

            //Assert
            expect(res.statusCode).toEqual(500);
            expect(res.body.message).toEqual('There was an error in updating the car');
            expect(mockedCarService.updateCarsService).toHaveBeenCalledWith(updateData);
        });
    });
});
