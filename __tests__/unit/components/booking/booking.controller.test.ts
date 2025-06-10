import { Request, Response } from 'express';
import {
    createBookingController,
    getBookingByIdController,
    getBookingsByCarIdController,
    getBookingsByCustomerIdController,
    getAllBookingsController
} from '../../../../src/components/booking/booking.controller';

import * as BookingService from '../../../../src/components/Booking/booking.service';

// Mock the service methods
jest.mock('../../../../src/components/booking/booking.service');

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Booking Controller', () => {
    const mockBooking = {
        bookingID: 1,
        carID: 2,
        customerID: 3,
        bookingDate: '2024-01-01',
        returnDate: '2024-01-10'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createBookingController', () => {
        it('should create a booking and return 201', async () => {
            const req = { body: mockBooking } as Request;
            const res = mockResponse();

            (BookingService.createBookingService as jest.Mock).mockResolvedValue(mockBooking);

            await createBookingController(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Booking created successfully',
                data: mockBooking
            });
        });

        it('should handle error and return 500', async () => {
            const req = { body: mockBooking } as Request;
            const res = mockResponse();

            (BookingService.createBookingService as jest.Mock).mockRejectedValue(new Error('DB Error'));

            await createBookingController(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to create booking',
                message: 'DB Error'
            });
        });
    });

    describe('getBookingByIdController', () => {
        it('should return booking with 200', async () => {
            const req = { params: { bookingId: '1' } } as unknown as Request;
            const res = mockResponse();

            (BookingService.getBookingByIdService as jest.Mock).mockResolvedValue(mockBooking);

            await getBookingByIdController(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: `Booking details for ID: 1`,
                data: mockBooking
            });
        });

        it('should return 404 if booking not found', async () => {
            const req = { params: { bookingId: '1' } } as unknown as Request;
            const res = mockResponse();

            (BookingService.getBookingByIdService as jest.Mock).mockResolvedValue(null);

            await getBookingByIdController(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Booking with ID 1 not found.'
            });
        });

        it('should handle error and return 500', async () => {
            const req = { params: { bookingId: '1' } } as unknown as Request;
            const res = mockResponse();

            (BookingService.getBookingByIdService as jest.Mock).mockRejectedValue(new Error('Error'));

            await getBookingByIdController(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to get booking',
                message: 'Error'
            });
        });
    });

    describe('getBookingsByCarIdController', () => {
        it('should return bookings for car ID', async () => {
            const req = { params: { carId: '2' } } as unknown as Request;
            const res = mockResponse();

            (BookingService.getBookingsByCarIdService as jest.Mock).mockResolvedValue([mockBooking]);

            await getBookingsByCarIdController(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Bookings for car ID: 2',
                data: [mockBooking]
            });
        });

        it('should return empty message if no bookings found', async () => {
            const req = { params: { carId: '2' } } as unknown as Request;
            const res = mockResponse();

            (BookingService.getBookingsByCarIdService as jest.Mock).mockResolvedValue([]);

            await getBookingsByCarIdController(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'There was no car with car id: 2'
            });
        });

        it('should handle service error', async () => {
            const req = { params: { carId: '2' } } as unknown as Request;
            const res = mockResponse();

            (BookingService.getBookingsByCarIdService as jest.Mock).mockRejectedValue(new Error('Error'));

            await getBookingsByCarIdController(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to get bookings by card ID',
                message: 'Error'
            });
        });
    });

    describe('getBookingsByCustomerIdController', () => {
        it('should return bookings for customer ID', async () => {
            const req = { params: { customerId: '3' } } as unknown as Request;
            const res = mockResponse();

            (BookingService.getBookingsByCustomerIdService as jest.Mock).mockResolvedValue([mockBooking]);

            await getBookingsByCustomerIdController(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Bookings for customer ID: 3',
                data: [mockBooking]
            });
        });

        it('should return message if no bookings found', async () => {
            const req = { params: { customerId: '3' } } as unknown as Request;
            const res = mockResponse();

            (BookingService.getBookingsByCustomerIdService as jest.Mock).mockResolvedValue([]);

            await getBookingsByCustomerIdController(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'No bookings were found for customer id 3'
            });
        });

        it('should handle service error', async () => {
            const req = { params: { customerId: '3' } } as unknown as Request;
            const res = mockResponse();

            (BookingService.getBookingsByCustomerIdService as jest.Mock).mockRejectedValue(new Error('Error'));

            await getBookingsByCustomerIdController(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to get bookings by customer ID',
                message: 'Error'
            });
        });
    });

    describe('getAllBookingsController', () => {
        it('should return all bookings', async () => {
            const req = {} as Request;
            const res = mockResponse();

            (BookingService.getAllBookingsService as jest.Mock).mockResolvedValue([mockBooking]);

            await getAllBookingsController(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'All bookings',
                data: [mockBooking]
            });
        });

        it('should return message if no bookings exist', async () => {
            const req = {} as Request;
            const res = mockResponse();

            (BookingService.getAllBookingsService as jest.Mock).mockResolvedValue([]);

            await getAllBookingsController(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'No bookings have been found.'
            });
        });

        it('should handle service error', async () => {
            const req = {} as Request;
            const res = mockResponse();

            (BookingService.getAllBookingsService as jest.Mock).mockRejectedValue(new Error('Error'));

            await getAllBookingsController(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to get all bookings',
                message: 'Error'
            });
        });
    });
});
