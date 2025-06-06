import { Express } from "express";
import {
    createBookingController,
    getBookingByIdController,
    getBookingsByCarIdController,
    getBookingsByCustomerIdController,
    getAllBookingsController
} from "./booking.controller";
import { bothRoleAuth } from "../../middleware/bearAuth";

const bookingRoute = (app: Express) => {
    app.route("/booking").post( 
        // bothRoleAuth,
        createBookingController
    );               // Create booking
    app.route("/booking/:bookingId").get(
        // bothRoleAuth,
        getBookingByIdController);    // Get booking by ID
    app.route("/booking/car/:carId").get(
        // bothRoleAuth,
        getBookingsByCarIdController);  // Get by card ID
    app.route("/booking/customer/:customerId").get(
        // bothRoleAuth,
        getBookingsByCustomerIdController); // Get by customer ID
    app.route("/booking").get(
        // bothRoleAuth,
        getAllBookingsController);               // Get all bookings
};

export default bookingRoute;
