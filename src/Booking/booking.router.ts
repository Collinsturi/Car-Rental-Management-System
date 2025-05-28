import { Express } from "express";
import {
    createBookingController,
    getBookingByIdController,
    getBookingsByCarIdController,
    getBookingsByCustomerIdController,
    getAllBookingsController
} from "./booking.controller";

const booking = (app: Express) => {
    app.route("/booking").post(createBookingController);               // Create booking
    app.route("/booking/:bookingId").get(getBookingByIdController);    // Get booking by ID
    app.route("/booking/card/:cardId").get(getBookingsByCarIdController);  // Get by card ID
    app.route("/booking/customer/:customerId").get(getBookingsByCustomerIdController); // Get by customer ID
    app.route("/booking").get(getAllBookingsController);               // Get all bookings
};

export default booking;
