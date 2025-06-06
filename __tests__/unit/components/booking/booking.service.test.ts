import { eq } from "drizzle-orm";
import {
  createBookingService,
  getBookingByIdService,
  getBookingsByCarIdService,
  getBookingsByCustomerIdService,
  getAllBookingsService,
} from "../../../../src/components/Booking/booking.service";
import db from "../../../../src/Drizzle/db";
import {
  BookingsTable,
  BookingEntity,
  CarTable,
  CustomerTable,
  UsersTable,
} from "../../../../src/Drizzle/schema";

// Mock the database
jest.mock("../../../../src/Drizzle/db", () => ({
  insert: jest.fn(),
  select: jest.fn(),
}));

// Create a properly typed mock for the db
const mockDb = db as jest.Mocked<typeof db>;

describe("Booking Service", () => {
  const mockBooking: BookingEntity = {
    bookingID: 1,
    carID: 101,
    customerID: 202,
    rentalStartDate: "2025-01-01",
    rentalEndDate: "2025-01-05",
    totalAmount: "3000",
  };

  const mockJoinedBooking = {
    bookings: mockBooking,
    car: {
      carID: 101,
      carModel: "Toyota Camry",
      year: "2020-01-01",
      color: "Blue",
      rentalRate: "500",
      availability: true,
      locationID: 1,
    },
    customer: {
      customerID: 202,
      userID: 1,
    },
    users: {
      userID: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
      address: "123 Main St",
      password: "hashedpassword",
      role: "user" as const,
      createdAt: "2024-01-01",
      isVerified: true,
      verificationCode: "123456",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createBookingService", () => {
    it("should return created booking on success", async () => {
      const mockValues = jest.fn().mockReturnThis();
      const mockReturning = jest.fn().mockResolvedValue([mockBooking]);
      
      mockDb.insert.mockReturnValue({
        values: mockValues,
        returning: mockReturning,
      } as any);

      const result = await createBookingService(mockBooking);
      
      expect(result).toEqual(mockBooking);
      expect(mockDb.insert).toHaveBeenCalledWith(BookingsTable);
      expect(mockValues).toHaveBeenCalledWith(mockBooking);
      expect(mockReturning).toHaveBeenCalled();
    });

    it("should throw error if booking creation fails (no returned value)", async () => {
      const mockValues = jest.fn().mockReturnThis();
      const mockReturning = jest.fn().mockResolvedValue([]);
      
      mockDb.insert.mockReturnValue({
        values: mockValues,
        returning: mockReturning,
      } as any);

      await expect(createBookingService(mockBooking)).rejects.toThrow(
        "There was an error creating the booking."
      );
      
      expect(mockDb.insert).toHaveBeenCalledWith(BookingsTable);
      expect(mockValues).toHaveBeenCalledWith(mockBooking);
      expect(mockReturning).toHaveBeenCalled();
    });

    it("should throw wrapped error on database exception", async () => {
      mockDb.insert.mockImplementation(() => {
        throw new Error("Database connection failed");
      });

      await expect(createBookingService(mockBooking)).rejects.toThrow(
        "Failed to create booking: Database connection failed"
      );
      
      expect(mockDb.insert).toHaveBeenCalledWith(BookingsTable);
    });

    it("should handle insert operation exception", async () => {
      const mockValues = jest.fn().mockReturnThis();
      const mockReturning = jest.fn().mockRejectedValue(new Error("Insert failed"));
      
      mockDb.insert.mockReturnValue({
        values: mockValues,
        returning: mockReturning,
      } as any);

      await expect(createBookingService(mockBooking)).rejects.toThrow(
        "Failed to create booking: Insert failed"
      );
    });
  });

  describe("getBookingByIdService", () => {
    it("should return booking if found", async () => {
      const mockWhere = jest.fn().mockResolvedValue([mockJoinedBooking]);
      const mockLeftJoin3 = jest.fn(() => ({ where: mockWhere }));
      const mockLeftJoin2 = jest.fn(() => ({ leftJoin: mockLeftJoin3 }));
      const mockLeftJoin1 = jest.fn(() => ({ leftJoin: mockLeftJoin2 }));
      const mockFrom = jest.fn(() => ({ leftJoin: mockLeftJoin1 }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getBookingByIdService(1);
      
      expect(result).toEqual([mockJoinedBooking]);
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(BookingsTable);
      expect(mockLeftJoin1).toHaveBeenCalledWith(CarTable, eq(BookingsTable.carID, CarTable.carID));
      expect(mockLeftJoin2).toHaveBeenCalledWith(CustomerTable, eq(BookingsTable.customerID, CustomerTable.customerID));
      expect(mockLeftJoin3).toHaveBeenCalledWith(UsersTable, eq(UsersTable.userID, CustomerTable.userID));
      expect(mockWhere).toHaveBeenCalledWith(eq(BookingsTable.bookingID, 1));
    });

    it("should return empty array if booking not found", async () => {
      const mockWhere = jest.fn().mockResolvedValue([]);
      const mockLeftJoin3 = jest.fn(() => ({ where: mockWhere }));
      const mockLeftJoin2 = jest.fn(() => ({ leftJoin: mockLeftJoin3 }));
      const mockLeftJoin1 = jest.fn(() => ({ leftJoin: mockLeftJoin2 }));
      const mockFrom = jest.fn(() => ({ leftJoin: mockLeftJoin1 }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getBookingByIdService(999);
      
      expect(result).toEqual([]);
      expect(mockWhere).toHaveBeenCalledWith(eq(BookingsTable.bookingID, 999));
    });

    it("should throw error on database failure", async () => {
      const mockWhere = jest.fn().mockRejectedValue(new Error("Database error"));
      const mockLeftJoin3 = jest.fn(() => ({ where: mockWhere }));
      const mockLeftJoin2 = jest.fn(() => ({ leftJoin: mockLeftJoin3 }));
      const mockLeftJoin1 = jest.fn(() => ({ leftJoin: mockLeftJoin2 }));
      const mockFrom = jest.fn(() => ({ leftJoin: mockLeftJoin1 }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      await expect(getBookingByIdService(1)).rejects.toThrow(
        "Failed to get booking by ID: Database error"
      );
    });

    it("should handle select operation exception", async () => {
      mockDb.select.mockImplementation(() => {
        throw new Error("Select operation failed");
      });

      await expect(getBookingByIdService(1)).rejects.toThrow(
        "Failed to get booking by ID: Select operation failed"
      );
    });
  });

  describe("getBookingsByCarIdService", () => {
    it("should return bookings for specific car ID", async () => {
      const mockWhere = jest.fn().mockResolvedValue([mockJoinedBooking]);
      const mockLeftJoin3 = jest.fn(() => ({ where: mockWhere }));
      const mockLeftJoin2 = jest.fn(() => ({ leftJoin: mockLeftJoin3 }));
      const mockLeftJoin1 = jest.fn(() => ({ leftJoin: mockLeftJoin2 }));
      const mockFrom = jest.fn(() => ({ leftJoin: mockLeftJoin1 }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getBookingsByCarIdService(101);
      
      expect(result).toEqual([mockJoinedBooking]);
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(BookingsTable);
      expect(mockLeftJoin1).toHaveBeenCalledWith(CarTable, eq(BookingsTable.carID, CarTable.carID));
      expect(mockLeftJoin2).toHaveBeenCalledWith(CustomerTable, eq(BookingsTable.customerID, CustomerTable.customerID));
      expect(mockLeftJoin3).toHaveBeenCalledWith(UsersTable, eq(UsersTable.userID, CustomerTable.userID));
      expect(mockWhere).toHaveBeenCalledWith(eq(BookingsTable.carID, 101));
    });

    it("should return empty array if no bookings found for car ID", async () => {
      const mockWhere = jest.fn().mockResolvedValue([]);
      const mockLeftJoin3 = jest.fn(() => ({ where: mockWhere }));
      const mockLeftJoin2 = jest.fn(() => ({ leftJoin: mockLeftJoin3 }));
      const mockLeftJoin1 = jest.fn(() => ({ leftJoin: mockLeftJoin2 }));
      const mockFrom = jest.fn(() => ({ leftJoin: mockLeftJoin1 }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getBookingsByCarIdService(999);
      
      expect(result).toEqual([]);
      expect(mockWhere).toHaveBeenCalledWith(eq(BookingsTable.carID, 999));
    });

    it("should throw error on database failure", async () => {
      const mockWhere = jest.fn().mockRejectedValue(new Error("Connection timeout"));
      const mockLeftJoin3 = jest.fn(() => ({ where: mockWhere }));
      const mockLeftJoin2 = jest.fn(() => ({ leftJoin: mockLeftJoin3 }));
      const mockLeftJoin1 = jest.fn(() => ({ leftJoin: mockLeftJoin2 }));
      const mockFrom = jest.fn(() => ({ leftJoin: mockLeftJoin1 }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      await expect(getBookingsByCarIdService(101)).rejects.toThrow(
        "Failed to get bookings by car ID: Connection timeout"
      );
    });

    it("should handle multiple bookings for the same car", async () => {
      const multipleBookings = [mockJoinedBooking, { ...mockJoinedBooking, bookings: { ...mockBooking, bookingID: 2 } }];
      
      const mockWhere = jest.fn().mockResolvedValue(multipleBookings);
      const mockLeftJoin3 = jest.fn(() => ({ where: mockWhere }));
      const mockLeftJoin2 = jest.fn(() => ({ leftJoin: mockLeftJoin3 }));
      const mockLeftJoin1 = jest.fn(() => ({ leftJoin: mockLeftJoin2 }));
      const mockFrom = jest.fn(() => ({ leftJoin: mockLeftJoin1 }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getBookingsByCarIdService(101);
      
      expect(result).toEqual(multipleBookings);
      expect(result).toHaveLength(2);
    });
  });

  describe("getBookingsByCustomerIdService", () => {
    it("should return bookings for specific customer ID", async () => {
      const mockWhere = jest.fn().mockResolvedValue([mockJoinedBooking]);
      const mockLeftJoin3 = jest.fn(() => ({ where: mockWhere }));
      const mockLeftJoin2 = jest.fn(() => ({ leftJoin: mockLeftJoin3 }));  
      const mockLeftJoin1 = jest.fn(() => ({ leftJoin: mockLeftJoin2 }));
      const mockFrom = jest.fn(() => ({ leftJoin: mockLeftJoin1 }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getBookingsByCustomerIdService(202);
      
      expect(result).toEqual([mockJoinedBooking]);
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(BookingsTable);
      expect(mockLeftJoin1).toHaveBeenCalledWith(CarTable, eq(BookingsTable.carID, CarTable.carID));
      expect(mockLeftJoin2).toHaveBeenCalledWith(CustomerTable, eq(BookingsTable.customerID, CustomerTable.customerID));
      expect(mockLeftJoin3).toHaveBeenCalledWith(UsersTable, eq(UsersTable.userID, CustomerTable.userID));
      expect(mockWhere).toHaveBeenCalledWith(eq(BookingsTable.customerID, 202));
    });

    it("should return empty array if no bookings found for customer ID", async () => {
      const mockWhere = jest.fn().mockResolvedValue([]);
      const mockLeftJoin3 = jest.fn(() => ({ where: mockWhere }));
      const mockLeftJoin2 = jest.fn(() => ({ leftJoin: mockLeftJoin3 }));
      const mockLeftJoin1 = jest.fn(() => ({ leftJoin: mockLeftJoin2 }));
      const mockFrom = jest.fn(() => ({ leftJoin: mockLeftJoin1 }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getBookingsByCustomerIdService(999);
      
      expect(result).toEqual([]);
      expect(mockWhere).toHaveBeenCalledWith(eq(BookingsTable.customerID, 999));
    });

    it("should throw error on database failure", async () => {
      const mockWhere = jest.fn().mockRejectedValue(new Error("Query failed"));
      const mockLeftJoin3 = jest.fn(() => ({ where: mockWhere }));
      const mockLeftJoin2 = jest.fn(() => ({ leftJoin: mockLeftJoin3 }));
      const mockLeftJoin1 = jest.fn(() => ({ leftJoin: mockLeftJoin2 }));
      const mockFrom = jest.fn(() => ({ leftJoin: mockLeftJoin1 }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      await expect(getBookingsByCustomerIdService(202)).rejects.toThrow(
        "Failed to get bookings by customer ID: Query failed"
      );
    });

    it("should handle customer with multiple bookings", async () => {
      const multipleBookings = [
        mockJoinedBooking,
        { ...mockJoinedBooking, bookings: { ...mockBooking, bookingID: 2, carID: 102 } }
      ];
      
      const mockWhere = jest.fn().mockResolvedValue(multipleBookings);
      const mockLeftJoin3 = jest.fn(() => ({ where: mockWhere }));
      const mockLeftJoin2 = jest.fn(() => ({ leftJoin: mockLeftJoin3 }));
      const mockLeftJoin1 = jest.fn(() => ({ leftJoin: mockLeftJoin2 }));
      const mockFrom = jest.fn(() => ({ leftJoin: mockLeftJoin1 }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getBookingsByCustomerIdService(202);
      
      expect(result).toEqual(multipleBookings);
      expect(result).toHaveLength(2);
    });
  });

  describe("getAllBookingsService", () => {
    it("should return all bookings", async () => {
      const mockLeftJoin3 = jest.fn().mockResolvedValue([mockJoinedBooking]);
      const mockLeftJoin2 = jest.fn(() => ({ leftJoin: mockLeftJoin3 }));
      const mockLeftJoin1 = jest.fn(() => ({ leftJoin: mockLeftJoin2 }));
      const mockFrom = jest.fn(() => ({ leftJoin: mockLeftJoin1 }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getAllBookingsService();
      
      expect(result).toEqual([mockJoinedBooking]);
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(BookingsTable);
      expect(mockLeftJoin1).toHaveBeenCalledWith(CarTable, eq(BookingsTable.carID, CarTable.carID));
      expect(mockLeftJoin2).toHaveBeenCalledWith(CustomerTable, eq(BookingsTable.customerID, CustomerTable.customerID));
      expect(mockLeftJoin3).toHaveBeenCalledWith(UsersTable, eq(UsersTable.userID, CustomerTable.userID));
    });

    it("should return empty array if no bookings exist", async () => {
      const mockLeftJoin3 = jest.fn().mockResolvedValue([]);
      const mockLeftJoin2 = jest.fn(() => ({ leftJoin: mockLeftJoin3 }));
      const mockLeftJoin1 = jest.fn(() => ({ leftJoin: mockLeftJoin2 }));
      const mockFrom = jest.fn(() => ({ leftJoin: mockLeftJoin1 }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getAllBookingsService();
      
      expect(result).toEqual([]);
    });

    it("should throw error on database failure", async () => {
      const mockLeftJoin3 = jest.fn().mockRejectedValue(new Error("Server error"));
      const mockLeftJoin2 = jest.fn(() => ({ leftJoin: mockLeftJoin3 }));
      const mockLeftJoin1 = jest.fn(() => ({ leftJoin: mockLeftJoin2 }));
      const mockFrom = jest.fn(() => ({ leftJoin: mockLeftJoin1 }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      await expect(getAllBookingsService()).rejects.toThrow(
        "Failed to get all bookings: Server error"
      );
    });

    it("should handle large dataset", async () => {
      const largeBookingSet = Array.from({ length: 100 }, (_, i) => ({
        ...mockJoinedBooking,
        bookings: { ...mockBooking, bookingID: i + 1 }
      }));
      
      const mockLeftJoin3 = jest.fn().mockResolvedValue(largeBookingSet);
      const mockLeftJoin2 = jest.fn(() => ({ leftJoin: mockLeftJoin3 }));
      const mockLeftJoin1 = jest.fn(() => ({ leftJoin: mockLeftJoin2 }));
      const mockFrom = jest.fn(() => ({ leftJoin: mockLeftJoin1 }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getAllBookingsService();
      
      expect(result).toEqual(largeBookingSet);
      expect(result).toHaveLength(100);
    });

    it("should handle select operation exception", async () => {
      mockDb.select.mockImplementation(() => {
        throw new Error("Memory allocation failed");
      });

      await expect(getAllBookingsService()).rejects.toThrow(
        "Failed to get all bookings: Memory allocation failed"
      );
    });
  });

  // Edge cases and additional scenarios
  describe("Edge Cases", () => {
    it("should handle undefined booking data in createBookingService", async () => {
      const mockValues = jest.fn().mockReturnThis();
      const mockReturning = jest.fn().mockResolvedValue([undefined]);
      
      mockDb.insert.mockReturnValue({
        values: mockValues,
        returning: mockReturning,
      } as any);

      await expect(createBookingService(mockBooking)).rejects.toThrow(
        "There was an error creating the booking."
      );
    });

    it("should handle null values in query results", async () => {
      const bookingWithNulls = {
        ...mockJoinedBooking,
        car: null,
        customer: null,
        users: null,
      };
      
      const mockWhere = jest.fn().mockResolvedValue([bookingWithNulls]);
      const mockLeftJoin3 = jest.fn(() => ({ where: mockWhere }));
      const mockLeftJoin2 = jest.fn(() => ({ leftJoin: mockLeftJoin3 }));
      const mockLeftJoin1 = jest.fn(() => ({ leftJoin: mockLeftJoin2 }));
      const mockFrom = jest.fn(() => ({ leftJoin: mockLeftJoin1 }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getBookingByIdService(1);
      
      expect(result).toEqual([bookingWithNulls]);
      expect(result[0].car).toBeNull();
      expect(result[0].customer).toBeNull();
      expect(result[0].users).toBeNull();
    });

    it("should handle zero as valid ID", async () => {
      const mockWhere = jest.fn().mockResolvedValue([]);
      const mockLeftJoin3 = jest.fn(() => ({ where: mockWhere }));
      const mockLeftJoin2 = jest.fn(() => ({ leftJoin: mockLeftJoin3 }));
      const mockLeftJoin1 = jest.fn(() => ({ leftJoin: mockLeftJoin2 }));
      const mockFrom = jest.fn(() => ({ leftJoin: mockLeftJoin1 }));
      
      mockDb.select.mockReturnValue({
        from: mockFrom,
      } as any);

      const result = await getBookingByIdService(0);
      
      expect(result).toEqual([]);
      expect(mockWhere).toHaveBeenCalledWith(eq(BookingsTable.bookingID, 0));
    });
  });
});