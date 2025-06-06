import db from '../../../../src/Drizzle/db';
import { CarTable, LocationTable } from '../../../../src/Drizzle/schema';
import * as carService from '../../../../src/components/car/car.service';
import { eq, and } from 'drizzle-orm'; // Import eq and and for building queries

jest.mock('../../../../src/Drizzle/db', () => ({
  __esModule: true,
  default: {
    insert: jest.fn(() => ({
      values: jest.fn(() => ({
        returning: jest.fn(),
      })),
    })),
    update: jest.fn(() => ({
      set: jest.fn(() => ({
        where: jest.fn(() => ({
          returning: jest.fn(),
        })),
      })),
    })),
    query: {
      CarTable: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
      LocationTable: {
        findFirst: jest.fn(),
      },
    },
  },
}));

describe('Car Service', () => {
  afterEach(() => jest.clearAllMocks());

  it('should create a car', async () => {
    const car = {
      carID: 1,
      carModel: 'Toyota',
      year: '2021-01-01', 
      color: 'Red',
      rentalRate: '2000.00',
      availability: true,
      locationID: 1,
    };

    // Mock the entire chain of calls for an insert operation
    (db.insert(CarTable).values as jest.Mock).mockReturnValue({
      returning: jest.fn().mockResolvedValue([car]),
    });

    const result = await carService.createCarService(car);
    expect(result).toEqual(car);
    expect(db.insert).toHaveBeenCalledWith(CarTable);
    expect(db.insert(CarTable).values).toHaveBeenCalledWith(car);
  });

  it('should return car by ID', async () => {
    const car = { carID: 1, carModel: 'Toyota', year: new Date('2020-01-01'), rentalRate: '1500.00' };
    (db.query.CarTable.findFirst as jest.Mock).mockResolvedValue(car);

    const result = await carService.getCarByIdService(1);
    expect(result).toEqual(car);
    expect(db.query.CarTable.findFirst).toHaveBeenCalledWith({
      where: expect.any(Function), // We expect a function that creates the 'eq' condition
    });
    // To be more precise, you could mock the 'eq' function if you want to verify the exact where clause.
  });

  it('should return cars by model', async () => {
    const cars = [
      { carID: 1, carModel: 'Toyota', year: new Date('2020-01-01'), rentalRate: '1500.00' },
      { carID: 2, carModel: 'Toyota', year: new Date('2022-01-01'), rentalRate: '1800.00' },
    ];
    (db.query.CarTable.findMany as jest.Mock).mockResolvedValue(cars);

    const result = await carService.getCarsByCarModelService('Toyota');
    expect(result).toEqual(cars);
    expect(db.query.CarTable.findMany).toHaveBeenCalledWith({
      where: expect.any(Function), // Again, expecting a function for the 'like' condition
    });
  });

  it('should return all available cars', async () => {
    const cars = [
      { carID: 1, carModel: 'Toyota', availability: true, year: new Date('2020-01-01'), rentalRate: '1500.00' },
      { carID: 2, carModel: 'Honda', availability: true, year: new Date('2021-01-01'), rentalRate: '1700.00' },
    ];
    (db.query.CarTable.findMany as jest.Mock).mockResolvedValue(cars);

    const result = await carService.getAllAvailableCarsService();
    expect(result).toEqual(cars);
    expect(db.query.CarTable.findMany).toHaveBeenCalledWith({
      where: expect.any(Function), // Expecting a function for the 'eq' condition
    });
  });

  it('should return cars by location name', async () => {
    const location = { locationID: 101, locationName: 'Nairobi', address: '123 Main St', contactNumber: '1234567890' };
    const cars = [
      { carID: 1, carModel: 'Toyota', locationID: 101, year: new Date('2020-01-01'), rentalRate: '1500.00' },
      { carID: 2, carModel: 'Honda', locationID: 101, year: new Date('2021-01-01'), rentalRate: '1700.00' },
    ];

    (db.query.LocationTable.findFirst as jest.Mock).mockResolvedValue(location);
    (db.query.CarTable.findMany as jest.Mock).mockResolvedValue(cars);

    const result = await carService.getAllCarsInACertainLocationService('Nairobi');
    expect(result).toEqual(cars);
    expect(db.query.LocationTable.findFirst).toHaveBeenCalledWith({
      where: expect.any(Function), // Expecting a function for the 'eq' condition
    });
    expect(db.query.CarTable.findMany).toHaveBeenCalledWith({
      where: expect.any(Function), // Expecting a function for the 'eq' condition on locationID
    });
  });

  it('should update a car', async () => {
    const updatedCar = { carID: 1, carModel: 'Honda', year: new Date('2023-01-01'), rentalRate: '2500.00', color: 'Blue' };
    const updatePayload = { carID:1, carModel: 'Honda', color: 'Blue', rentalRate: '2500.00', year: '2021-01-01',    availability: true,
      locationID: 1};


    // Mock the entire chain for an update operation
    (db.update(CarTable).set as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([updatedCar]),
      }),
    });

    const result = await carService.updateCarsService(updatePayload); // Assuming updateCarsService takes ID and payload
    expect(result).toEqual(updatedCar);
    expect(db.update).toHaveBeenCalledWith(CarTable);
    expect(db.update(CarTable).set).toHaveBeenCalledWith(updatePayload);
    // You might want to refine the where clause check depending on how updateCarsService is implemented.
    // For example, if it uses eq(CarTable.carID, id), you'd check for that.
  });

  // Example of a test for an update that returns null/empty array if not found
  it('should return null for update if car not found', async () => {
   const updatePayload = { carID:1, carModel: 'Honda', color: 'Blue', rentalRate: '2500.00', year: '2021-01-01',    availability: true,
      locationID: 1};

    (db.update(CarTable).set as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([]), // Simulate no rows updated
      }),
    });

    const result = await carService.updateCarsService(updatePayload);
    expect(result).toBeUndefined(); // Or null, depending on service implementation
  });

  // Add more tests for error handling and edge cases
});