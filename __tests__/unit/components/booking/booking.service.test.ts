import {
  createBookingService,
  getBookingByIdService,
  getBookingsByCarIdService,
  getBookingsByCustomerIdService,
  getAllBookingsService,
} from "../../../../src/components/Booking/booking.service";
import db from "../../../../src/Drizzle/db";
import { BookingsTable, BookingEntity } from "../../../../src/Drizzle/schema";

// Mocks
jest.mock("../../../../src/Drizzle/db", () => ({
  insert: jest.fn(),
  query: {
    BookingsTable: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe("Booking Service", () => {
  const mockBooking: BookingEntity = {
    bookingID: 1,
    carID: 101,
    customerID: 202,
    rentalStartDate: "2025-01-01",
    rentalEndDate: "2025-01-05",
    totalAmount: "3000"
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createBookingService", () => {
    it("should return created booking on success", async () => {
      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockBooking]),
        }),
      });

      const result = await createBookingService(mockBooking);
      expect(result).toEqual(mockBooking);
      expect(db.insert).toHaveBeenCalledWith(BookingsTable);
    });

    it("should throw error if booking creation fails", async () => {
      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([]),
        }),
      });

      await expect(createBookingService(mockBooking)).rejects.toThrow(
        "There was an error creating the booking."
      );
    });

    it("should throw wrapped error on exception", async () => {
      (db.insert as jest.Mock).mockImplementation(() => {
        throw new Error("DB failure");
      });

      await expect(createBookingService(mockBooking)).rejects.toThrow(
        "Failed to create booking: DB failure"
      );
    });
  });

  describe("getBookingByIdService", () => {
    it("should return booking if found", async () => {
      (db.query.BookingsTable.findFirst as jest.Mock).mockResolvedValue(mockBooking);
      const result = await getBookingByIdService(1);
      expect(result).toEqual(mockBooking);
    });

    it("should return null if booking not found", async () => {
      (db.query.BookingsTable.findFirst as jest.Mock).mockResolvedValue(null);
      const result = await getBookingByIdService(999);
      expect(result).toBeNull();
    });

    it("should throw error on failure", async () => {
      (db.query.BookingsTable.findFirst as jest.Mock).mockRejectedValue(new Error("DB error"));
      await expect(getBookingByIdService(1)).rejects.toThrow("Failed to get booking by ID: DB error");
    });
  });

  describe("getBookingsByCarIdService", () => {
    it("should return bookings for car ID", async () => {
      (db.query.BookingsTable.findMany as jest.Mock).mockResolvedValue([mockBooking]);
      const result = await getBookingsByCarIdService(101);
      expect(result).toEqual([mockBooking]);
    });

    it("should return empty array if no bookings", async () => {
      (db.query.BookingsTable.findMany as jest.Mock).mockResolvedValue([]);
      const result = await getBookingsByCarIdService(999);
      expect(result).toEqual([]);
    });

    it("should throw error on failure", async () => {
      (db.query.BookingsTable.findMany as jest.Mock).mockRejectedValue(new Error("DB failure"));
      await expect(getBookingsByCarIdService(101)).rejects.toThrow(
        "Failed to get bookings by car ID: DB failure"
      );
    });
  });

  describe("getBookingsByCustomerIdService", () => {
    it("should return bookings for customer ID", async () => {
      (db.query.BookingsTable.findMany as jest.Mock).mockResolvedValue([mockBooking]);
      const result = await getBookingsByCustomerIdService(202);
      expect(result).toEqual([mockBooking]);
    });

    it("should return empty array if no bookings", async () => {
      (db.query.BookingsTable.findMany as jest.Mock).mockResolvedValue([]);
      const result = await getBookingsByCustomerIdService(999);
      expect(result).toEqual([]);
    });

    it("should throw error on failure", async () => {
      (db.query.BookingsTable.findMany as jest.Mock).mockRejectedValue(new Error("DB failure"));
      await expect(getBookingsByCustomerIdService(202)).rejects.toThrow(
        "Failed to get bookings by customer ID: DB failure"
      );
    });
  });

  describe("getAllBookingsService", () => {
    it("should return all bookings", async () => {
      (db.query.BookingsTable.findMany as jest.Mock).mockResolvedValue([mockBooking]);
      const result = await getAllBookingsService();
      expect(result).toEqual([mockBooking]);
    });

    it("should return empty array if no bookings", async () => {
      (db.query.BookingsTable.findMany as jest.Mock).mockResolvedValue([]);
      const result = await getAllBookingsService();
      expect(result).toEqual([]);
    });

    it("should throw error on failure", async () => {
      (db.query.BookingsTable.findMany as jest.Mock).mockRejectedValue(new Error("DB failure"));
      await expect(getAllBookingsService()).rejects.toThrow("Failed to get all bookings: DB failure");
    });
  });
});
