import { Request, Response } from "express";
import {
    getPaymentByIdService,
    getPaymentByBookingIdService,
} from "./payment.service";

// Get payment by paymentId
export const getPaymentByIdController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.paymentId);
        const payment = await getPaymentByIdService(id);

        if (!payment) {
            res.status(404).json({ message: `Payment with ID ${id} not found` });
            return;
        }

        res.status(200).json({ message: "Payment found", data: payment });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to fetch payment by ID", message: error.message });
    }
};

// Get payment by bookingId
export const getPaymentByBookingIdController = async (req: Request, res: Response) => {
    try {
        const bookingId = Number(req.params.bookingId);
        const payment = await getPaymentByBookingIdService(bookingId);

        if (!payment) {
            res.status(404).json({ message: `Payment for booking ID ${bookingId} not found` });
            return;
        }

        res.status(200).json({ message: "Payment found", data: payment });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to fetch payment by booking ID", message: error.message });
    }
};
