import { eq } from "drizzle-orm";
import db from "../../Drizzle/db";
import { alias } from 'drizzle-orm/pg-core'; 
import { BookingsTable, BookingEntity, CarTable, CarEntity, CustomerEntity, CustomerTable, UsersTable} from "../../Drizzle/schema";

// Create booking
export const createBookingService = async (bookingData: BookingEntity) => {
    try {
        const [createdBooking] = await db.insert(BookingsTable).values(bookingData).returning();
        if (createdBooking) return createdBooking;

        throw new Error("There was an error creating the booking.");
    } catch (error: any) {
        throw new Error(`Failed to create booking: ${error.message}`);
    }
}

// Get booking by booking ID
export const getBookingByIdService = async (bookingId: number) => {
    try {
        const booking = await db.select()
                .from(BookingsTable)
                .leftJoin(CarTable as any, eq(BookingsTable.carID, CarTable.carID))
                .leftJoin(CustomerTable as any, eq(BookingsTable.customerID, CustomerTable.customerID))
                .leftJoin(UsersTable as any, eq(UsersTable.userID, CustomerTable.userID))
                .where(eq(BookingsTable.bookingID, bookingId)); 

        return booking || null;
    } catch (error: any) {
        throw new Error(`Failed to get booking by ID: ${error.message}`);
    }
}

// Get booking by card ID
export const getBookingsByCarIdService = async (carId: number) => {
    try {
        console.log(carId)

        const bookings = await db.select()
            .from(BookingsTable)
            .leftJoin(CarTable as any, eq(BookingsTable.carID, CarTable.carID))
            .leftJoin(CustomerTable as any, eq(BookingsTable.customerID, CustomerTable.customerID))
            .leftJoin(UsersTable as any, eq(UsersTable.userID, CustomerTable.userID))
            .where(eq(BookingsTable.carID, carId))
        
        ;
        return bookings || [];
    } catch (error: any) {
        throw new Error(`Failed to get bookings by car ID: ${error.message}`);
    }
}

// Get booking by customer ID
export const getBookingsByCustomerIdService = async (customerId: number) => {
    try {
        const bookings = await db.select()
            .from(BookingsTable)
            .leftJoin(CarTable as any, eq(BookingsTable.carID, CarTable.carID))
            .leftJoin(CustomerTable as any, eq(BookingsTable.customerID, CustomerTable.customerID))
            .leftJoin(UsersTable as any, eq(UsersTable.userID, CustomerTable.userID))
            .where(eq(BookingsTable.customerID, customerId))

            return bookings || [];
    } catch (error: any) {
        throw new Error(`Failed to get bookings by customer ID: ${error.message}`);
    }
}
export const getBookingsByUserIdService = async (userId: number) => {
    try {
        const bookings = await db.select()
            .from(BookingsTable)
            .leftJoin(CarTable as any, eq(BookingsTable.carID, CarTable.carID))
            .leftJoin(CustomerTable as any, eq(BookingsTable.customerID, CustomerTable.customerID))
            .leftJoin(UsersTable as any, eq(UsersTable.userID, CustomerTable.userID))
            .where(eq(CustomerTable.userID, userId))

            return bookings || [];
    } catch (error: any) {
        throw new Error(`Failed to get bookings by customer ID: ${error.message}`);
    }
}

// Get all bookings
export const getAllBookingsService = async () => {
    try {
        const bookings = await db.select()
        .from(BookingsTable)
        .leftJoin(CarTable as any, eq(BookingsTable.carID, CarTable.carID))
        .leftJoin(CustomerTable as any, eq(BookingsTable.customerID, CustomerTable.customerID))
        .leftJoin(UsersTable as any, eq(UsersTable.userID, CustomerTable.userID));

        return bookings || [];
    } catch (error: any) {
        throw new Error(`Failed to get all bookings: ${error.message}`);
    }
}
