import { eq } from "drizzle-orm";
import {
  createCarService,
  getCarByIdService,
  getCarsByCarModelService,
  getAllAvailableCarsService,
  getAllCarsInACertainLocationService,
  updateCarsService,
} from "../../../../src/components/Car/car.service";
import db from "../../../../src/Drizzle/db";
import {
  CarTable,
  CarEntity,
  LocationTable,
} from "../../../../src/Drizzle/schema";

// Mock the database
jest.mock("../../../../src/Drizzle/db", () => ({
  insert: jest.fn(),
  select: jest.fn(),
  update: jest.fn(),
  query: {
    LocationTable: {
      findFirst: jest.fn(),
    },
    CarTable: {
      findMany: jest.fn(),
    },
  },
}));

// Mock console.log to prevent test output noise
const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

// Create a properly typed mock for the db
const mockDb = db as jest.Mocked<typeof db>;

describe("Car Service", () => {
  const mockCar: CarEntity = {
    carID: 1,
    carModel: "Toyota Camry",
    year: "2023-01-01",
    color: "Blue",
    rentalRate: "150.00",
    availability: true,
    locationID: 1,
  };

  const mockLocation = {
    locationID: 1,
    locationName: "Downtown Branch",
    address: "123 Main St",
    contactNumber: "555-0123",
  };

  const mockJoinedCar = {
    car: mockCar,
    location: mockLocation,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe("createCarService", () => {
    it("should return created car on success", async () => {
      const mockValues = jest.fn().mockReturnThis();
      const mockReturning = jest.fn().mockResolvedValue([mockCar]);
      
      mockDb.insert.mockReturnValue({
        values: mockValues,
        returning: mockReturning,
      } as any);

      const result = await createCarService(mockCar);
      
      expect(result).toEqual(mockCar);
      expect(mockDb.insert).toHaveBeenCalledWith(CarTable);
      expect(mockValues).toHaveBeenCalledWith(mockCar);
      expect(mockReturning).toHaveBeenCalled();
    });

    it("should return empty array if car creation fails (no returned value)", async () => {
      const mockValues = jest.fn().mockReturnThis();
      const mockReturning = jest.fn().mockResolvedValue([]);
      
      mockDb.insert.mockReturnValue({
        values: mockValues,
        returning: mockReturning,
      } as any);

      const result = await createCarService(mockCar);
      
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      expect(mockDb.insert).toHaveBeenCalledWith(CarTable);
      expect(mockValues).toHaveBeenCalledWith(mockCar);
      expect(mockReturning).toHaveBeenCalled();
    });

    it("should return empty array on database exception", async () => {
      mockDb.insert.mockImplementation(() => {
        throw new Error("Database connection failed");
      });

      const result = await createCarService(mockCar);
      
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      expect(mockDb.insert).toHaveBeenCalledWith(CarTable);
    });

    it("should handle insert operation exception", async () => {
      const mockValues = jest.fn().mockReturnThis();
      const mockReturning = jest.fn().mockRejectedValue(new Error("Insert failed"));
      
      mockDb.insert.mockReturnValue({
        values: mockValues,
        returning: mockReturning,
      } as any);

      const result = await createCarService(mockCar);
      
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should handle undefined car creation", async () => {
      const mockValues = jest.fn().mockReturnThis();
      const mockReturning = jest.fn().mockResolvedValue([undefined]);
      
      mockDb.insert.mockReturnValue({
        values: mockValues,
        returning: mockReturning,
      } as any);

      const result = await createCarService(mockCar);
      
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("getCarByIdService", () => {
    it("should return car details if found", async () => {
      const mockWhere = jest.fn().mockResolvedValue([mockJoinedCar]);
      const mockRightJoin = jest.fn(() => ({ where: mockWhere }));
      const mockFrom = jest.fn(() => ({ rightJoin: mockRightJoin }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getCarByIdService(1);
      
      expect(result).toEqual([mockJoinedCar]);
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(CarTable);
      expect(mockRightJoin).toHaveBeenCalledWith(LocationTable, expect.any(Function));
      expect(mockWhere).toHaveBeenCalledWith(eq(CarTable.carID, 1));
    });

    // it("should return empty array if car not found", async () => {
    //   const mockWhere = jest.fn().mockResolvedValue([]);
    //   const mockRightJoin = jest.fn(() => ({ where: mockWhere }));
    //   const mockFrom = jest.fn(() => ({ rightJoin: mockRightJoin }));
      
    //   mockDb.select.mockReturnValue({
    //     from: mockFrom,
    //   } as any);

    //   const result = await getCarByIdService(999);
      
    //   expect(result).toEqual([]);
    //   expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    //   expect(mockWhere).toHaveBeenCalledWith(eq(CarTable.carID, 999));
    // });

    it("should return empty array on database failure", async () => {
      const mockWhere = jest.fn().mockRejectedValue(new Error("Database error"));
      const mockRightJoin = jest.fn(() => ({ where: mockWhere }));
      const mockFrom = jest.fn(() => ({ rightJoin: mockRightJoin }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getCarByIdService(1);
      
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should handle select operation exception", async () => {
      mockDb.select.mockImplementation(() => {
        throw new Error("Select operation failed");
      });

      const result = await getCarByIdService(1);
      
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should handle zero as valid ID", async () => {
      const mockWhere = jest.fn().mockResolvedValue([]);
      const mockRightJoin = jest.fn(() => ({ where: mockWhere }));
      const mockFrom = jest.fn(() => ({ rightJoin: mockRightJoin }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getCarByIdService(0);
      
      expect(result).toEqual([]);
      expect(mockWhere).toHaveBeenCalledWith(eq(CarTable.carID, 0));
    });
  });

  describe("getCarsByCarModelService", () => {
    it("should return cars for specific model", async () => {
      const mockWhere = jest.fn().mockResolvedValue([mockJoinedCar]);
      const mockRightJoin = jest.fn(() => ({ where: mockWhere }));
      const mockFrom = jest.fn(() => ({ rightJoin: mockRightJoin }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getCarsByCarModelService("Toyota Camry");
      
      expect(result).toEqual([mockJoinedCar]);
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(CarTable);
      expect(mockRightJoin).toHaveBeenCalledWith(LocationTable, expect.any(Function));
      expect(mockWhere).toHaveBeenCalledWith(eq(CarTable.carModel, "Toyota Camry"));
    });

    // it("should return empty array if no cars found for model", async () => {
    //   const mockWhere = jest.fn().mockResolvedValue([]);
    //   const mockRightJoin = jest.fn(() => ({ where: mockWhere }));
    //   const mockFrom = jest.fn(() => ({ rightJoin: mockRightJoin }));
      
    //   mockDb.select.mockReturnValue({
    //     from: mockFrom,
    //   } as any);

    //   const result = await getCarsByCarModelService("NonExistent Model");
      
    //   expect(result).toEqual([]);
    //   expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    //   expect(mockWhere).toHaveBeenCalledWith(eq(CarTable.carModel, "NonExistent Model"));
    // });

    it("should handle multiple cars with same model", async () => {
      const multipleCars = [
        mockJoinedCar,
        { ...mockJoinedCar, car: { ...mockCar, carID: 2, color: "Red" } }
      ];
      
      const mockWhere = jest.fn().mockResolvedValue(multipleCars);
      const mockRightJoin = jest.fn(() => ({ where: mockWhere }));
      const mockFrom = jest.fn(() => ({ rightJoin: mockRightJoin }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getCarsByCarModelService("Toyota Camry");
      
      expect(result).toEqual(multipleCars);
      expect(result).toHaveLength(2);
    });

    it("should return empty array on database failure", async () => {
      const mockWhere = jest.fn().mockRejectedValue(new Error("Connection timeout"));
      const mockRightJoin = jest.fn(() => ({ where: mockWhere }));
      const mockFrom = jest.fn(() => ({ rightJoin: mockRightJoin }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getCarsByCarModelService("Toyota Camry");
      
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should handle empty string model", async () => {
      const mockWhere = jest.fn().mockResolvedValue([]);
      const mockRightJoin = jest.fn(() => ({ where: mockWhere }));
      const mockFrom = jest.fn(() => ({ rightJoin: mockRightJoin }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getCarsByCarModelService("");
      
      expect(result).toEqual([]);
      expect(mockWhere).toHaveBeenCalledWith(eq(CarTable.carModel, ""));
    });
  });

  describe("getAllAvailableCarsService", () => {
    it("should return all available cars", async () => {
      const mockWhere = jest.fn().mockResolvedValue([mockJoinedCar]);
      const mockRightJoin = jest.fn(() => ({ where: mockWhere }));
      const mockFrom = jest.fn(() => ({ rightJoin: mockRightJoin }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getAllAvailableCarsService();
      
      expect(result).toEqual([mockJoinedCar]);
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(CarTable);
      expect(mockRightJoin).toHaveBeenCalledWith(LocationTable, expect.any(Function));
      expect(mockWhere).toHaveBeenCalledWith(eq(CarTable.availability, true));
    });

    // it("should return empty array if no available cars", async () => {
    //   const mockWhere = jest.fn().mockResolvedValue([]);
    //   const mockRightJoin = jest.fn(() => ({ where: mockWhere }));
    //   const mockFrom = jest.fn(() => ({ rightJoin: mockRightJoin }));
      
    //   mockDb.select.mockReturnValue({
    //     from: mockFrom,
    //   } as any);

    //   const result = await getAllAvailableCarsService();
      
    //   expect(result).toEqual([]);
    //   expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    // });

    it("should handle multiple available cars", async () => {
      const multipleCars = [
        mockJoinedCar,
        { ...mockJoinedCar, car: { ...mockCar, carID: 2, carModel: "Honda Civic" } },
        { ...mockJoinedCar, car: { ...mockCar, carID: 3, carModel: "Ford Focus" } }
      ];
      
      const mockWhere = jest.fn().mockResolvedValue(multipleCars);
      const mockRightJoin = jest.fn(() => ({ where: mockWhere }));
      const mockFrom = jest.fn(() => ({ rightJoin: mockRightJoin }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getAllAvailableCarsService();
      
      expect(result).toEqual(multipleCars);
      expect(result).toHaveLength(3);
    });

    // it("should return empty array on database failure", async () => {
    //   const mockWhere = jest.fn().mockRejectedValue(new Error("Server error"));
    //   const mockRightJoin = jest.fn(() => ({ where: mockWhere }));
    //   const mockFrom = jest.fn(() => ({ rightJoin: mockRightJoin }));
      
    //   mockDb.select.mockReturnValue({
    //     from: mockFrom,
    //   } as any);

    //   const result = await getAllAvailableCarsService();
      
    //   expect(result).toEqual([]);
    //   expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    // });

    it("should handle null availability check", async () => {
      const mockWhere = jest.fn().mockResolvedValue(null);
      const mockRightJoin = jest.fn(() => ({ where: mockWhere }));
      const mockFrom = jest.fn(() => ({ rightJoin: mockRightJoin }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getAllAvailableCarsService();
      
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("getAllCarsInACertainLocationService", () => {
    it("should return cars for specific location", async () => {
      const mockLocationFindFirst = jest.fn().mockResolvedValue(mockLocation);
      const mockCarFindMany = jest.fn().mockResolvedValue([mockCar]);
      
      mockDb.query.LocationTable.findFirst = mockLocationFindFirst;
      mockDb.query.CarTable.findMany = mockCarFindMany;

      const result = await getAllCarsInACertainLocationService("Downtown Branch");
      
      expect(result).toEqual([mockCar]);
      expect(mockLocationFindFirst).toHaveBeenCalledWith({
        where: eq(LocationTable.locationName, "Downtown Branch"),
      });
      expect(mockCarFindMany).toHaveBeenCalledWith({
        where: eq(CarTable.locationID, 1),
      });
    });

    // it("should return empty array if location not found", async () => {
    //   const mockLocationFindFirst = jest.fn().mockResolvedValue(null);
      
    //   mockDb.query.LocationTable.findFirst = mockLocationFindFirst;

    //   const result = await getAllCarsInACertainLocationService("NonExistent Location");
      
    //   expect(result).toEqual([]);
    //   expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    //   expect(mockLocationFindFirst).toHaveBeenCalledWith({
    //     where: eq(LocationTable.locationName, "NonExistent Location"),
    //   });
    // });

    // it("should return empty array if no cars in location", async () => {
    //   const mockLocationFindFirst = jest.fn().mockResolvedValue(mockLocation);
    //   const mockCarFindMany = jest.fn().mockResolvedValue([]);
      
    //   mockDb.query.LocationTable.findFirst = mockLocationFindFirst;
    //   mockDb.query.CarTable.findMany = mockCarFindMany;

    //   const result = await getAllCarsInACertainLocationService("Downtown Branch");
      
    //   expect(result).toEqual([]);
    //   expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    //   expect(mockLocationFindFirst).toHaveBeenCalledWith({
    //     where: eq(LocationTable.locationName, "Downtown Branch"),
    //   });
    //   expect(mockCarFindMany).toHaveBeenCalledWith({
    //     where: eq(CarTable.locationID, 1),
    //   });
    // });

    it("should handle multiple cars in same location", async () => {
      const multipleCars = [
        mockCar,
        { ...mockCar, carID: 2, carModel: "Honda Civic" },
        { ...mockCar, carID: 3, carModel: "Ford Focus" }
      ];
      
      const mockLocationFindFirst = jest.fn().mockResolvedValue(mockLocation);
      const mockCarFindMany = jest.fn().mockResolvedValue(multipleCars);
      
      mockDb.query.LocationTable.findFirst = mockLocationFindFirst;
      mockDb.query.CarTable.findMany = mockCarFindMany;

      const result = await getAllCarsInACertainLocationService("Downtown Branch");
      
      expect(result).toEqual(multipleCars);
      expect(result).toHaveLength(3);
    });

    it("should return empty array on location query failure", async () => {
      const mockLocationFindFirst = jest.fn().mockRejectedValue(new Error("Location query failed"));
      
      mockDb.query.LocationTable.findFirst = mockLocationFindFirst;

      const result = await getAllCarsInACertainLocationService("Downtown Branch");
      
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should return empty array on car query failure", async () => {
      const mockLocationFindFirst = jest.fn().mockResolvedValue(mockLocation);
      const mockCarFindMany = jest.fn().mockRejectedValue(new Error("Car query failed"));
      
      mockDb.query.LocationTable.findFirst = mockLocationFindFirst;
      mockDb.query.CarTable.findMany = mockCarFindMany;

      const result = await getAllCarsInACertainLocationService("Downtown Branch");
      
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should handle empty location name", async () => {
      const mockLocationFindFirst = jest.fn().mockResolvedValue(null);
      
      mockDb.query.LocationTable.findFirst = mockLocationFindFirst;

      const result = await getAllCarsInACertainLocationService("");
      
      expect(result).toEqual([]);
      expect(mockLocationFindFirst).toHaveBeenCalledWith({
        where: eq(LocationTable.locationName, ""),
      });
    });

    // it("should handle location with undefined locationID", async () => {
    //   const locationWithoutID = { ...mockLocation, locationID: undefined };
    //   const mockLocationFindFirst = jest.fn().mockResolvedValue(locationWithoutID);
    //   const mockCarFindMany = jest.fn().mockResolvedValue([]);
      
    //   mockDb.query.LocationTable.findFirst = mockLocationFindFirst;
    //   mockDb.query.CarTable.findMany = mockCarFindMany;

    //   const result = await getAllCarsInACertainLocationService("Downtown Branch");
      
    //   expect(result).toEqual([]);
    //   expect(mockCarFindMany).toHaveBeenCalledWith({
    //     where: eq(CarTable.locationID, undefined),
    //   });
    // });
  });

  describe("updateCarsService", () => {
    it("should update car successfully", async () => {
      const updatedCar = { ...mockCar, color: "Red" };
      const mockWhere = jest.fn().mockResolvedValue([updatedCar]);
      const mockReturning = jest.fn(() => mockWhere);
      const mockSet = jest.fn(() => ({ where: jest.fn(() => ({ returning: mockReturning })) }));
      
      mockDb.update.mockReturnValue({
        set: mockSet,
      } as any);

      const result = await updateCarsService(updatedCar);
      
      expect(mockDb.update).toHaveBeenCalledWith(CarTable);
      expect(mockSet).toHaveBeenCalledWith(updatedCar);
      // Note: The actual where and returning calls would need to be tested based on the full chain
    });

    it("should handle update with partial car data", async () => {
      const partialCar = { carID: 1, color: "Green" } as CarEntity;
      const mockWhere = jest.fn().mockResolvedValue([partialCar]);
      const mockReturning = jest.fn(() => mockWhere);
      const mockSet = jest.fn(() => ({ where: jest.fn(() => ({ returning: mockReturning })) }));
      
      mockDb.update.mockReturnValue({
        set: mockSet,
      } as any);

      const result = await updateCarsService(partialCar);
      
      expect(mockDb.update).toHaveBeenCalledWith(CarTable);
      expect(mockSet).toHaveBeenCalledWith(partialCar);
    });

    it("should handle update operation failure", async () => {
      mockDb.update.mockImplementation(() => {
        throw new Error("Update failed");
      });

      await expect(updateCarsService(mockCar)).rejects.toThrow("Update failed");
      expect(mockDb.update).toHaveBeenCalledWith(CarTable);
    });

    it("should handle car with invalid ID", async () => {
      const invalidCar = { ...mockCar, carID: -1 };
      const mockWhere = jest.fn().mockResolvedValue([]);
      const mockReturning = jest.fn(() => mockWhere);
      const mockSet = jest.fn(() => ({ where: jest.fn(() => ({ returning: mockReturning })) }));
      
      mockDb.update.mockReturnValue({
        set: mockSet,
      } as any);

      const result = await updateCarsService(invalidCar);
      
      expect(mockDb.update).toHaveBeenCalledWith(CarTable);
      expect(mockSet).toHaveBeenCalledWith(invalidCar);
    });
  });

  describe("Edge Cases", () => {
    it("should handle null car data in createCarService", async () => {
      const mockValues = jest.fn().mockReturnThis();
      const mockReturning = jest.fn().mockResolvedValue([null]);
      
      mockDb.insert.mockReturnValue({
        values: mockValues,
        returning: mockReturning,
      } as any);

      const result = await createCarService(mockCar);
      
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should handle very long car model names", async () => {
      const longModelName = "A".repeat(1000);
      const mockWhere = jest.fn().mockResolvedValue([]);
      const mockRightJoin = jest.fn(() => ({ where: mockWhere }));
      const mockFrom = jest.fn(() => ({ rightJoin: mockRightJoin }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getCarsByCarModelService(longModelName);
      
      expect(result).toEqual([]);
      expect(mockWhere).toHaveBeenCalledWith(eq(CarTable.carModel, longModelName));
    });

    it("should handle special characters in location names", async () => {
      const specialLocationName = "Branch & Co. (Downtown) - #1";
      const mockLocationFindFirst = jest.fn().mockResolvedValue(null);
      
      mockDb.query.LocationTable.findFirst = mockLocationFindFirst;

      const result = await getAllCarsInACertainLocationService(specialLocationName);
      
      expect(result).toEqual([]);
      expect(mockLocationFindFirst).toHaveBeenCalledWith({
        where: eq(LocationTable.locationName, specialLocationName),
      });
    });

    it("should handle database timeout scenarios", async () => {
      jest.setTimeout(10000); //Ensure test timeout to be about 13s
      
      const mockWhere = jest.fn().mockImplementation(() => {
        return new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Query timeout")), 100);
        });
      });
      const mockRightJoin = jest.fn(() => ({ where: mockWhere }));
      const mockFrom = jest.fn(() => ({ rightJoin: mockRightJoin }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getCarByIdService(1);
      
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });
  });
  
});
