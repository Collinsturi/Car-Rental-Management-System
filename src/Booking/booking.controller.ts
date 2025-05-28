import { Request, Response } from "express";
import {
    createBookingService,
    getAllBookingsService,
    getBookingByIdService,
    getBookingsByCarIdService,
    getBookingsByCustomerIdService
} from "./booking.service";

// Create booking
export const createBookingController = async (req: Request, res: Response) => {
    try {
        const bookingData = req.body;
        const booking = await createBookingService(bookingData);
        res.status(201).json({
            message: "Booking created successfully",
            data: booking,
        });
    } catch (error: any) {
        res.status(500).json({
            error: "Failed to create booking",
            message: error.message,
        });
    }
};

// Get booking by booking ID
export const getBookingByIdController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.bookingId);
        const booking = await getBookingByIdService(id);
        if (!booking) {
            res.status(404).json({ message: `Booking with ID ${id} not found.` });
            return;
        }
        res.status(200).json({ message: `Booking details for ID: ${id}`, data: booking });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to get booking", message: error.message });
    }
};

// Get bookings by card ID
export const getBookingsByCarIdController = async (req: Request, res: Response) => {
    try {
        const cardId = Number(req.params.cardId);
        const bookings = await getBookingsByCarIdService(cardId);
        res.status(200).json({ message: `Bookings for card ID: ${cardId}`, data: bookings });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to get bookings by card ID", message: error.message });
    }
};

// Get bookings by customer ID
export const getBookingsByCustomerIdController = async (req: Request, res: Response) => {
    try {
        const customerId = Number(req.params.customerId);
        const bookings = await getBookingsByCustomerIdService(customerId);
        res.status(200).json({ message: `Bookings for customer ID: ${customerId}`, data: bookings });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to get bookings by customer ID", message: error.message });
    }
};

// Get all bookings
export const getAllBookingsController = async (_req: Request, res: Response) => {
    try {
        const bookings = await getAllBookingsService();
        res.status(200).json({ message: "All bookings", data: bookings });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to get all bookings", message: error.message });
    }
};
