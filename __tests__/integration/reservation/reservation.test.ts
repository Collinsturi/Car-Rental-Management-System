import request from 'supertest';
import app from '../../../src/index.ts'; 
import * as reservationService from '../../../src/components/reservation/reservation.service.ts'; 

jest.mock('../../../src/components/reservation/reservation.service.ts');

const mockedReservationService = reservationService as jest.Mocked<typeof reservationService>;

describe('Reservation API Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test suite for POST /reservation (Create Reservation)
    describe('POST /reservation', () => {
        it('should create a new reservation successfully', async () => {
            const newReservationData = {
                customerID: 1,
                carID: 101,
                reservationDate: '2025-06-15',
                pickupDate: '2025-07-01',
                returnDate: '2025-07-10'
            };
            const createdReservation = [{ reservationID: 1, ...newReservationData }]; // Controller returns an array

            mockedReservationService.createReservationService.mockResolvedValue(createdReservation);

            const res = await request(app)
                .post('/reservation')
                .send(newReservationData);

            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('Reservation created successfully.');
            expect(res.body.payload).toEqual(createdReservation); 
            expect(mockedReservationService.createReservationService).toHaveBeenCalledWith(newReservationData);
        });

        it('should return 200 with failure message if reservation was not created (service returns empty array)', async () => {
            const newReservationData = {
                customerID: 1,
                carID: 101,
                reservationDate: '2025-06-15',
            };

            mockedReservationService.createReservationService.mockResolvedValue([]);

            const res = await request(app)
                .post('/reservation')
                .send(newReservationData);

            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('Reservation was not created successfully.');
            expect(res.body.payload).toBeUndefined(); 
            expect(mockedReservationService.createReservationService).toHaveBeenCalledWith(newReservationData);
        });

        // it('should return 500 if an error occurs during reservation creation service call', async () => {
        //     const newReservationData = {
        //         customerID: 1,
        //         carID: 101,
        //         reservationDate: '2025-06-15',
        //     };
        //     const errorMessage = 'Database error during reservation creation';

        //     mockedReservationService.createReservationService.mockRejectedValue(new Error(errorMessage));

        //     const res = await request(app)
        //         .post('/reservation')
        //         .send(newReservationData);

        //     expect(res.statusCode).toEqual(500);
        //     expect(res.body.message).toEqual('Error creating reservation');
        //     expect(res.body.error).toBeDefined();
        //     expect(res.body.error.message).toEqual(errorMessage);
        // });
    });

    // Test suite for GET /reservation/customer/:customerId (Get Reservation by Customer ID)
    describe('GET /reservation/customer/:customerId', () => {
        it('should return reservations for a specific customer ID', async () => {
            const customerId = 1;
            const mockReservations = [
                { reservationID: 1, customerID: customerId, carID: 101, reservationDate: '2025-06-15', pickupDate: '2025-07-01', returnDate: '2025-07-10' },
                { reservationID: 2, customerID: customerId, carID: 102, reservationDate: '2025-06-20', pickupDate: '2025-07-05', returnDate: '2025-07-12' },
            ];
            mockedReservationService.getReservationByCustomerIdService.mockResolvedValue(mockReservations);

            const res = await request(app).get(`/reservation/customer/${customerId}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('Reservations for customer'); 
            expect(res.body.data).toEqual(mockReservations); 
            expect(mockedReservationService.getReservationByCustomerIdService).toHaveBeenCalledWith(customerId);
        });

        it('should return 200 with a message if no reservations found for customer ID', async () => {
            const customerId = 999;
            mockedReservationService.getReservationByCustomerIdService.mockResolvedValue([]);

            const res = await request(app).get(`/reservation/customer/${customerId}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('No reservations for customer was found'); 
            expect(res.body.data).toBeUndefined(); 
            expect(mockedReservationService.getReservationByCustomerIdService).toHaveBeenCalledWith(customerId);
        });

        // it('should return 500 if an error occurs while getting reservations by customer ID', async () => {
        //     const customerId = 1;
        //     const errorMessage = 'Database error retrieving reservations by customer ID';
        //     mockedReservationService.getReservationByCustomerIdService.mockRejectedValue(new Error(errorMessage));

        //     const res = await request(app).get(`/reservation/customer/${customerId}`);

        //     expect(res.statusCode).toEqual(500);
        //     expect(res.text).toContain('Internal Server Error'); 
        // });
    });

    // Test suite for GET /reservation/car/:carId (Get Reservation by Car ID)
    describe('GET /reservation/car/:carId', () => {
        it('should return reservations for a specific car ID', async () => {
            const carId = 101;
            const mockReservations = [
                { reservationID: 1, customerID: 1, carID: carId, reservationDate: '2025-06-15', pickupDate: '2025-07-01', returnDate: '2025-07-10' },
            ];
            mockedReservationService.getReservationByCarIdService.mockResolvedValue(mockReservations);

            const res = await request(app).get(`/reservation/car/${carId}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('Reservations for car'); 
            expect(res.body.data).toEqual(mockReservations); 
            expect(mockedReservationService.getReservationByCarIdService).toHaveBeenCalledWith(carId);
        });

        it('should return 200 with a message if no reservations found for car ID', async () => {
            const carId = 999;
            mockedReservationService.getReservationByCarIdService.mockResolvedValue([]);

            const res = await request(app).get(`/reservation/car/${carId}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual(`No reservations were found for car id ${carId}`); 
            expect(res.body.data).toBeUndefined(); 
            expect(mockedReservationService.getReservationByCarIdService).toHaveBeenCalledWith(carId);
        });

        // it('should return 500 if an error occurs while getting reservations by car ID', async () => {
        //     const carId = 101;
        //     const errorMessage = 'Database error retrieving reservations by car ID';
        //     mockedReservationService.getReservationByCarIdService.mockRejectedValue(new Error(errorMessage));

        //     const res = await request(app).get(`/reservation/car/${carId}`);

        //     expect(res.statusCode).toEqual(500);
        //     expect(res.text).toContain('Internal Server Error');
        // });
    });

    // Test suite for GET /reservation/returned (Get Returned Cars)
    describe('GET /reservation/returned', () => {
        it('should return a list of returned cars', async () => {
            const mockReturnedCars = [
                { reservationID: 1, customerID: 1, carID: 101, reservationDate: '2025-06-15', pickupDate: '2025-07-01', returnDate: '2025-07-10' },
                { reservationID: 3, customerID: 2, carID: 103, reservationDate: '2025-05-01', pickupDate: '2025-05-10', returnDate: '2025-05-15' },
            ];
            mockedReservationService.getReturnedCarsService.mockResolvedValue(mockReturnedCars);

            const res = await request(app).get('/reservation/returned');

            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('Returned cars'); 
            expect(res.body.data).toEqual(mockReturnedCars); 
            expect(mockedReservationService.getReturnedCarsService).toHaveBeenCalledTimes(1);
        });

        it('should return 200 with a message if no returned cars are found', async () => {
            mockedReservationService.getReturnedCarsService.mockResolvedValue([]);

            const res = await request(app).get('/reservation/returned');

            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('There are no returned cars.'); 
            expect(res.body.data).toBeUndefined(); 
            expect(mockedReservationService.getReturnedCarsService).toHaveBeenCalledTimes(1);
        });

        // it('should return 500 if an error occurs while getting returned cars', async () => {
        //     const errorMessage = 'Database error retrieving returned cars';
        //     mockedReservationService.getReturnedCarsService.mockRejectedValue(new Error(errorMessage));

        //     const res = await request(app).get('/reservation/returned');

        //     expect(res.statusCode).toEqual(500);
        //     expect(res.text).toContain('Internal Server Error');
        // });
    });

    // Test suite for GET /reservation/current (Get Currently Reserved Cars)
    describe('GET /reservation/current', () => {
        it('should return a list of currently reserved cars', async () => {
            const mockCurrentlyReservedCars = [
                { reservationID: 4, customerID: 3, carID: 104, reservationDate: '2025-06-25', pickupDate: '2025-07-01', returnDate: null },
            ];
            mockedReservationService.getCurrentlyReservedCarsService.mockResolvedValue(mockCurrentlyReservedCars);

            const res = await request(app).get('/reservation/current');

            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('Currently reserved cars'); 
            expect(res.body.data).toEqual(mockCurrentlyReservedCars); 
            expect(mockedReservationService.getCurrentlyReservedCarsService).toHaveBeenCalledTimes(1);
        });

        it('should return 200 with a message if no currently reserved cars are found', async () => {
            mockedReservationService.getCurrentlyReservedCarsService.mockResolvedValue([]);

            const res = await request(app).get('/reservation/current');

            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('No currently reserved cars'); 
            expect(res.body.data).toBeUndefined(); 
            expect(mockedReservationService.getCurrentlyReservedCarsService).toHaveBeenCalledTimes(1);
        });

        // it('should return 500 if an error occurs while getting currently reserved cars', async () => {
        //     const errorMessage = 'Database error retrieving currently reserved cars';
        //     mockedReservationService.getCurrentlyReservedCarsService.mockRejectedValue(new Error(errorMessage));

        //     const res = await request(app).get('/reservation/current');

        //     expect(res.statusCode).toEqual(500);
        //     expect(res.text).toContain('Internal Server Error');
        // });
    });

    // Test suite for GET /reservation/customer/:customerName/current (Get Currently Reserved Cars by Customer)
    describe('GET /reservation/customer/:customerName/current', () => {
        it('should return currently reserved cars for a specific customer', async () => {
            const customerName = 'John Doe';
            const mockCurrentlyReservedCars = [
                { reservationID: 4, customerID: 3, carID: 104, reservationDate: '2025-06-25', pickupDate: '2025-07-01', returnDate: null, customerName: customerName },
            ];
            mockedReservationService.getCurrentlyReservedCarsByCustomerService.mockResolvedValue(mockCurrentlyReservedCars);

            const res = await request(app).get(`/reservation/customer/${customerName}/current`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('Currently reserved cars by customer'); 
            expect(res.body.data).toEqual(mockCurrentlyReservedCars); 
            expect(mockedReservationService.getCurrentlyReservedCarsByCustomerService).toHaveBeenCalledWith(customerName);
        });

        it('should return 200 with an empty array if no currently reserved cars found for the customer', async () => {
            const customerName = 'Jane Smith';
            mockedReservationService.getCurrentlyReservedCarsByCustomerService.mockResolvedValue([]);

            const res = await request(app).get(`/reservation/customer/${customerName}/current`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual(`There are no currently reserved cars for user ${customerName}`); 
            expect(res.body.data).toBeUndefined(); 
            expect(mockedReservationService.getCurrentlyReservedCarsByCustomerService).toHaveBeenCalledWith(customerName);
        });

        // it('should return 500 if an error occurs while getting currently reserved cars by customer', async () => {
        //     const customerName = 'John Doe';
        //     const errorMessage = 'Database error retrieving currently reserved cars by customer';
        //     mockedReservationService.getCurrentlyReservedCarsByCustomerService.mockRejectedValue(new Error(errorMessage));

        //     const res = await request(app).get(`/reservation/customer/${customerName}/current`);

        //     expect(res.statusCode).toEqual(500);
        //     expect(res.text).toContain('Internal Server Error');
        // });
    });
});
