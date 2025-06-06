// import db from '../../../../src/Drizzle/db';
// import * as carService from '../../../../src/components/car/car.service';

// jest.mock('../../../../src/Drizzle/db');

// describe('Car Service', () => {
//   afterEach(() => jest.clearAllMocks());

//   it('should create a car', async () => {
//     const car = { carID: 1, carModel: 'Toyota' };
//     db.insert().returning.mockResolvedValue([car]);

//     const result = await carService.createCarService(car);
//     expect(result).toEqual(car);
//   });

//   it('should return car by ID', async () => {
//     const car = { carID: 1, carModel: 'Toyota' };
//     db.query.CarTable.findFirst.mockResolvedValue(car);

//     const result = await carService.getCarByIdService(1);
//     expect(result).toEqual(car);
//   });

//   it('should return cars by model', async () => {
//     const cars = [{ carModel: 'Toyota' }];
//     db.query.CarTable.findMany.mockResolvedValue(cars);

//     const result = await carService.getCarsByCarModelService('Toyota');
//     expect(result).toEqual(cars);
//   });

//   it('should return all available cars', async () => {
//     const cars = [{ availability: true }];
//     db.query.CarTable.findMany.mockResolvedValue(cars);

//     const result = await carService.getAllAvailableCarsService();
//     expect(result).toEqual(cars);
//   });

//   it('should return cars by location name', async () => {
//     const location = { locationID: 101, locationName: 'Nairobi' };
//     const cars = [{ carID: 1, locationID: 101 }];
//     db.query.LocationTable.findFirst.mockResolvedValue(location);
//     db.query.CarTable.findMany.mockResolvedValue(cars);

//     const result = await carService.getAllCarsInACertainLocationService('Nairobi');
//     expect(result).toEqual(cars);
//   });

//   it('should update a car', async () => {
//     const car = { carID: 1, carModel: 'Honda' };
//     db.update().returning.mockResolvedValue([car]);

//     const result = await carService.updateCarsService(car);
//     expect(result).toEqual([car]);
//   });
// });
