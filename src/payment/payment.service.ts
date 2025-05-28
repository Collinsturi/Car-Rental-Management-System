import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { PaymentTable } from "../Drizzle/schema";

// Get payment by paymentId
export const getPaymentByIdService = async (paymentId: number) => {
    try {
        const payment = await db.query.PaymentTable.findFirst({
            where: eq(PaymentTable.paymentID, paymentId),
        });
        return payment || null;
    } catch (error: any) {
        throw new Error(`Get payment by ID error: ${error.message}`);
    }
};

// Get payment by bookingId
export const getPaymentByBookingIdService = async (bookingId: number) => {
    try {
        const payment = await db.query.PaymentTable.findFirst({
            where: eq(PaymentTable.bookingID, bookingId),
        });
        return payment || null;
    } catch (error: any) {
        throw new Error(`Get payment by booking ID error: ${error.message}`);
    }
};
