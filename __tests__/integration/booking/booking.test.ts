import request from 'supertest';
import Express from "express";
import app from "../../../src/index"
import * as bookingService from '../../../src/components/Booking/booking.service'; 



jest.mock('../../../src/components/Booking/booking.service');

const mockedBookingService = bookingService as jest.Mocked<typeof bookingService>;


describe("Creating a booking using the API", () => {
    beforeAll(async () => {
        jest.clearAllMocks();
    })

    it('should create a new booking successfully', async () => {
        // Mock data for a new booking
        const newBookingData = {
            carID: 1,
            customerID: 101,
            rentalStartDate: '2025-07-01',
            rentalEndDate: '2025-07-10',
            totalAmount: '250.00'
        };

        // Mock the service function to return a successful booking creation
        const createdBooking = { bookingID: 1, ...newBookingData };
        mockedBookingService.createBookingService.mockResolvedValue(createdBooking);

        // Make a POST request to the /booking endpoint
        const res = await request(app)
            .post('/booking')
            .send(newBookingData);

        // Assertions
        expect(res.statusCode).toEqual(201); 
        expect(res.body.message).toEqual('Booking created successfully');
        expect(res.body.data).toEqual(createdBooking);
        // Ensure the service function was called with the correct data
        expect(mockedBookingService.createBookingService).toHaveBeenCalledWith(newBookingData);
    });

    it('should return 500 if an error occurs during booking creation', async () => {
        // Mock the service function to throw an error
        const errorMessage = 'Database error during booking creation';
        mockedBookingService.createBookingService.mockRejectedValue(new Error(errorMessage));

        // Make a POST request with some data (data itself doesn't matter for this error test)
        const newBookingData = {
            carID: 1,
            customerID: 101,
            rentalStartDate: '2025-07-01',
            rentalEndDate: '2025-07-10',
            totalAmount: '250.00'
        };
        const res = await request(app)
            .post('/booking')
            .send(newBookingData);

        // Assertions
        expect(res.statusCode).toEqual(500); // Expect a 500 Internal Server Error
        expect(res.body.error).toEqual('Failed to create booking');
        expect(res.body.message).toEqual(errorMessage);
    });

    // Test suite for GET /booking/:bookingId (Get Booking by ID)
    describe('GET /booking/:bookingId', () => {
        it('should return a booking by ID', async () => {
            const bookingId = 1;
            const mockBooking = {
                bookingID: bookingId,
                carID: 1,
                customerID: 101,
                rentalStartDate: '2025-07-01',
                rentalEndDate: '2025-07-10',
                totalAmount: '250.00'
            };
            // Mock the service function to return the specific booking
            mockedBookingService.getBookingByIdService.mockResolvedValue(mockBooking);

            // Make a GET request to the /booking/:bookingId endpoint
            const res = await request(app).get(`/booking/${bookingId}`);

            // Assertions
            expect(res.statusCode).toEqual(200); // Expect a 200 OK status code
            expect(res.body.message).toEqual(`Booking details for ID: ${bookingId}`);
            expect(res.body.data).toEqual(mockBooking);
            expect(mockedBookingService.getBookingByIdService).toHaveBeenCalledWith(bookingId);
        });

        it('should return 404 if booking is not found by ID', async () => {
            const bookingId = 999;
            // Mock the service function to return null (booking not found)
            mockedBookingService.getBookingByIdService.mockResolvedValue(null);

            // Make a GET request
            const res = await request(app).get(`/booking/${bookingId}`);

            // Assertions
            expect(res.statusCode).toEqual(404); // Expect a 404 Not Found status code
            expect(res.body.message).toEqual(`Booking with ID ${bookingId} not found.`);
            expect(mockedBookingService.getBookingByIdService).toHaveBeenCalledWith(bookingId);
        });

        it('should return 500 if an error occurs while getting booking by ID', async () => {
            const bookingId = 1;
            const errorMessage = 'Database error getting booking by ID';
            // Mock the service function to throw an error
            mockedBookingService.getBookingByIdService.mockRejectedValue(new Error(errorMessage));

            // Make a GET request
            const res = await request(app).get(`/booking/${bookingId}`);

            // Assertions
            expect(res.statusCode).toEqual(500); // Expect a 500 Internal Server Error
            expect(res.body.error).toEqual('Failed to get booking');
            expect(res.body.message).toEqual(errorMessage);
        });
    });

    // Test suite for GET /booking/car/:carId (Get Bookings by Car ID)
    describe('GET /booking/car/:carId', () => {
        it('should return bookings for a specific car ID', async () => {
            const carId = 1;
            const mockBookings = [
                { bookingID: 1, carID: carId, customerID: 101, rentalStartDate: '2025-07-01', rentalEndDate: '2025-07-10', totalAmount: '250.00' },
                { bookingID: 2, carID: carId, customerID: 102, rentalStartDate: '2025-08-01', rentalEndDate: '2025-08-05', totalAmount: '150.00' },
            ];
            // Mock the service function to return an array of bookings
            mockedBookingService.getBookingsByCarIdService.mockResolvedValue(mockBookings);

            // Make a GET request
            const res = await request(app).get(`/booking/car/${carId}`);

            // Assertions
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual(`Bookings for car ID: ${carId}`);
            expect(res.body.data).toEqual(mockBookings);
            expect(mockedBookingService.getBookingsByCarIdService).toHaveBeenCalledWith(carId);
        });

        it('should return 200 with a message if no bookings found for car ID', async () => {
            const carId = 999;
            // Mock the service function to return an empty array
            mockedBookingService.getBookingsByCarIdService.mockResolvedValue([]);

            // Make a GET request
            const res = await request(app).get(`/booking/car/${carId}`);

            // Assertions
            expect(res.statusCode).toEqual(200); // Controller returns 200 even if no data
            expect(res.body.message).toEqual(`There was no car with car id: ${carId}`);
            expect(res.body.data).toBeUndefined(); // Data should be undefined if message is present
            expect(mockedBookingService.getBookingsByCarIdService).toHaveBeenCalledWith(carId);
        });

        it('should return 500 if an error occurs while getting bookings by car ID', async () => {
            const carId = 1;
            const errorMessage = 'Database error getting bookings by car ID';
            // Mock the service function to throw an error
            mockedBookingService.getBookingsByCarIdService.mockRejectedValue(new Error(errorMessage));

            // Make a GET request
            const res = await request(app).get(`/booking/car/${carId}`);

            // Assertions
            expect(res.statusCode).toEqual(500);
            expect(res.body.error).toEqual('Failed to get bookings by card ID');
            expect(res.body.message).toEqual(errorMessage);
        });
    });

    // Test suite for GET /booking/customer/:customerId (Get Bookings by Customer ID)
    describe('GET /booking/customer/:customerId', () => {
        it('should return bookings for a specific customer ID', async () => {
            const customerId = 101;
            const mockBookings = [
                { bookingID: 1, carID: 1, customerID: customerId, rentalStartDate: '2025-07-01', rentalEndDate: '2025-07-10', totalAmount: '250.00' },
                { bookingID: 3, carID: 2, customerID: customerId, rentalStartDate: '2025-09-01', rentalEndDate: '2025-09-03', totalAmount: '100.00' },
            ];
            // Mock the service function
            mockedBookingService.getBookingsByCustomerIdService.mockResolvedValue(mockBookings);

            // Make a GET request
            const res = await request(app).get(`/booking/customer/${customerId}`);

            // Assertions
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual(`Bookings for customer ID: ${customerId}`);
            expect(res.body.data).toEqual(mockBookings);
            expect(mockedBookingService.getBookingsByCustomerIdService).toHaveBeenCalledWith(customerId);
        });

        it('should return 200 with a message if no bookings found for customer ID', async () => {
            const customerId = 999;
            // Mock the service function to return an empty array
            mockedBookingService.getBookingsByCustomerIdService.mockResolvedValue([]);

            // Make a GET request
            const res = await request(app).get(`/booking/customer/${customerId}`);

            // Assertions
            expect(res.statusCode).toEqual(200); // Controller returns 200 even if no data
            expect(res.body.message).toEqual(`No bookings were found for customer id ${customerId}`);
            expect(res.body.data).toBeUndefined(); // Data should be undefined if message is present
            expect(mockedBookingService.getBookingsByCustomerIdService).toHaveBeenCalledWith(customerId);
        });

        it('should return 500 if an error occurs while getting bookings by customer ID', async () => {
            const customerId = 101;
            const errorMessage = 'Database error getting bookings by customer ID';
            // Mock the service function to throw an error
            mockedBookingService.getBookingsByCustomerIdService.mockRejectedValue(new Error(errorMessage));

            // Make a GET request
            const res = await request(app).get(`/booking/customer/${customerId}`);

            // Assertions
            expect(res.statusCode).toEqual(500);
            expect(res.body.error).toEqual('Failed to get bookings by customer ID');
            expect(res.body.message).toEqual(errorMessage);
        });
    });

    // Test suite for GET /booking (Get All Bookings)
    describe('GET /booking', () => {
        it('should return all bookings', async () => {
            const mockAllBookings = [
                { bookingID: 1, carID: 1, customerID: 101, rentalStartDate: '2025-07-01', rentalEndDate: '2025-07-10', totalAmount: '250.00' },
                { bookingID: 2, carID: 1, customerID: 102, rentalStartDate: '2025-08-01', rentalEndDate: '2025-08-05', totalAmount: '150.00' },
                { bookingID: 3, carID: 2, customerID: 101, rentalStartDate: '2025-09-01', rentalEndDate: '2025-09-03', totalAmount: '100.00' },
            ];
            // Mock the service function
            mockedBookingService.getAllBookingsService.mockResolvedValue(mockAllBookings);

            // Make a GET request
            const res = await request(app).get('/booking');

            // Assertions
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('All bookings');
            expect(res.body.data).toEqual(mockAllBookings);
            expect(mockedBookingService.getAllBookingsService).toHaveBeenCalledTimes(1); // Ensure it was called once
        });

        it('should return 200 with a message if no bookings are found', async () => {
            // Mock the service function to return an empty array
            mockedBookingService.getAllBookingsService.mockResolvedValue([]);

            // Make a GET request
            const res = await request(app).get('/booking');

            // Assertions
            expect(res.statusCode).toEqual(200); // Controller returns 200 even if no data
            expect(res.body.message).toEqual('No bookings have been found.');
            expect(res.body.data).toBeUndefined(); // Data should be undefined if message is present
            // expect(mockedBookingService.getAllBookingsService).toHaveBeenCalledTimes(1);
        });

        it('should return 500 if an error occurs while getting all bookings', async () => {
            const errorMessage = 'Database error getting all bookings';
            // Mock the service function to throw an error
            mockedBookingService.getAllBookingsService.mockRejectedValue(new Error(errorMessage));

            // Make a GET request
            const res = await request(app).get('/booking');

            // Assertions
            expect(res.statusCode).toEqual(500);
            expect(res.body.error).toEqual('Failed to get all bookings');
            expect(res.body.message).toEqual(errorMessage);
        });
    });
})