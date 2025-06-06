import { eq } from "drizzle-orm";
import db from "../../Drizzle/db";
import { BookingsTable, CustomerTable, PaymentEntity, PaymentTable, UsersTable } from "../../Drizzle/schema";


export const createPaymentService = async(payment: PaymentEntity) => {
    return db.insert(PaymentTable)
    .values(payment)
    .returning();
}


// Get payment by paymentId
export const getPaymentByIdService = async (paymentId: number) => {
    try {
        const payment = await db.select()
            .from(PaymentTable)
            .rightJoin(BookingsTable as any, on => eq(BookingsTable.bookingID, PaymentTable.bookingID))
            .rightJoin(CustomerTable as any, on => eq(BookingsTable.customerID, CustomerTable.customerID))
            .rightJoin(UsersTable as any, eq(UsersTable.userID, CustomerTable.userID))
            .where(eq(PaymentTable.paymentID, paymentId));

        return payment || null;
    } catch (error: any) {
        throw new Error(`Get payment by ID error: ${error.message}`);
    }
};

// Get payment by bookingId
export const getPaymentByBookingIdService = async (bookingId: number) => {
    try {
        const payment = await db.select()
            .from(PaymentTable)
            .rightJoin(BookingsTable as any, on => eq(BookingsTable.bookingID, PaymentTable.bookingID))
            .rightJoin(CustomerTable as any, on => eq(BookingsTable.customerID, CustomerTable.customerID))
            .rightJoin(UsersTable as any, eq(UsersTable.userID, CustomerTable.userID))
            .where(eq(PaymentTable.bookingID, bookingId));
            
        return payment || null;
    } catch (error: any) {
        throw new Error(`Get payment by booking ID error: ${error.message}`);
    }
};
