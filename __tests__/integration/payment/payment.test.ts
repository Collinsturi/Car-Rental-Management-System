// import request from 'supertest';
// import app from '../../../src/index.ts';
// import * as paymentService from '../../../src/components/payment/payment.service.ts';
//
// jest.mock('../../../src/components/payment/payment.service.ts');
//
// const mockedPaymentService = paymentService as jest.Mocked<typeof paymentService>;
//
// describe('Payment API Endpoints', () => {
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });
//
//     // Test suite for POST /payment (Create Payment)
//     describe('POST /payment', () => {
//         it('should create a new payment successfully', async () => {
//             const newPaymentData = {
//                 bookingID: 1,
//                 paymentDate: '2025-06-15',
//                 amount: '150.75',
//                 paymentMethod: 'Credit Card'
//             };
//             const createdPayment = { paymentID: 1, ...newPaymentData };
//
//             mockedPaymentService.createPaymentService.mockResolvedValue(createdPayment);
//
//             const res = await request(app)
//                 .post('/payment')
//                 .send(newPaymentData);
//
//             expect(res.statusCode).toEqual(201);
//             expect(res.body.message).toEqual('Payment created successfully.');
//             expect(res.body.payload).toEqual(createdPayment);
//             expect(mockedPaymentService.createPaymentService).toHaveBeenCalledWith(newPaymentData);
//         });
//
//         it('should return 500 if payment creation fails (service returns falsy)', async () => {
//             const newPaymentData = {
//                 bookingID: 1,
//                 paymentDate: '2025-06-15',
//                 amount: '150.75'
//             };
//             mockedPaymentService.createPaymentService.mockResolvedValue(null);
//
//             const res = await request(app)
//                 .post('/payment')
//                 .send(newPaymentData);
//
//             expect(res.statusCode).toEqual(500);
//             expect(res.body.message).toEqual('There was an error with inserting your data. Please try again later.');
//             expect(mockedPaymentService.createPaymentService).toHaveBeenCalledWith(newPaymentData);
//         });
//
//         it('should return 500 if an error occurs during payment creation service call', async () => {
//             const newPaymentData = {
//                 bookingID: 1,
//                 paymentDate: '2025-06-15',
//                 amount: '150.75'
//             };
//             const errorMessage = 'Service threw an error during payment creation';
//             mockedPaymentService.createPaymentService.mockRejectedValue(new Error(errorMessage));
//
//             const res = await request(app)
//                 .post('/payment')
//                 .send(newPaymentData);
//
//             expect(res.statusCode).toEqual(500);
//             expect(res.body.message).toEqual('There was an error with inserting your data. Please try again later.');
//             expect(mockedPaymentService.createPaymentService).toHaveBeenCalledWith(newPaymentData);
//         });
//     });
//
//     // Test suite for GET /payment/:paymentId (Get Payment by ID)
//     describe('GET /payment/:paymentId', () => {
//         it('should return a payment record by ID', async () => {
//             const paymentId = 1;
//             const mockPayment = {
//                 paymentID: paymentId,
//                 bookingID: 1,
//                 paymentDate: '2025-06-15',
//                 amount: '150.75',
//                 paymentMethod: 'Credit Card'
//             };
//             mockedPaymentService.getPaymentByIdService.mockResolvedValue(mockPayment);
//
//             const res = await request(app).get(`/payment/${paymentId}`);
//
//             expect(res.statusCode).toEqual(200);
//             expect(res.body.message).toEqual('Payment found');
//             expect(res.body.data).toEqual(mockPayment);
//             expect(mockedPaymentService.getPaymentByIdService).toHaveBeenCalledWith(paymentId);
//         });
//
//         it('should return 404 if payment record is not found by ID', async () => {
//             const paymentId = 999;
//             mockedPaymentService.getPaymentByIdService.mockResolvedValue(null);
//
//             const res = await request(app).get(`/payment/${paymentId}`);
//
//             expect(res.statusCode).toEqual(404);
//             expect(res.body.message).toEqual(`Payment with ID ${paymentId} not found`);
//             expect(mockedPaymentService.getPaymentByIdService).toHaveBeenCalledWith(paymentId);
//         });
//
//         it('should return 500 if an error occurs while getting payment by ID', async () => {
//             const paymentId = 1;
//             const errorMessage = 'Database error fetching payment by ID';
//             mockedPaymentService.getPaymentByIdService.mockRejectedValue(new Error(errorMessage));
//
//             const res = await request(app).get(`/payment/${paymentId}`);
//
//             expect(res.statusCode).toEqual(500);
//             expect(res.body.error).toEqual('Failed to fetch payment by ID');
//             expect(res.body.message).toEqual(errorMessage);
//         });
//     });
//
//     // Test suite for GET /payment/booking/:bookingId (Get Payment by Booking ID)
//     describe('GET /payment/booking/:bookingId', () => {
//         it('should return a payment record for a specific booking ID', async () => {
//             const bookingId = 1;
//             const mockPayment = {
//                 paymentID: 1,
//                 bookingID: bookingId,
//                 paymentDate: '2025-06-15',
//                 amount: '150.75',
//                 paymentMethod: 'Credit Card'
//             };
//             mockedPaymentService.getPaymentByBookingIdService.mockResolvedValue(mockPayment);
//
//             const res = await request(app).get(`/payment/booking/${bookingId}`);
//
//             expect(res.statusCode).toEqual(200);
//             expect(res.body.message).toEqual('Payment found');
//             expect(res.body.data).toEqual(mockPayment);
//             expect(mockedPaymentService.getPaymentByBookingIdService).toHaveBeenCalledWith(bookingId);
//         });
//
//         it('should return 404 if no payment record found for booking ID', async () => {
//             const bookingId = 999;
//             mockedPaymentService.getPaymentByBookingIdService.mockResolvedValue(null);
//
//             const res = await request(app).get(`/payment/booking/${bookingId}`);
//
//             expect(res.statusCode).toEqual(404);
//             expect(res.body.message).toEqual(`Payment for booking ID ${bookingId} not found`);
//             expect(mockedPaymentService.getPaymentByBookingIdService).toHaveBeenCalledWith(bookingId);
//         });
//
//         it('should return 500 if an error occurs while getting payment by booking ID', async () => {
//             const bookingId = 1;
//             const errorMessage = 'Database error fetching payment by booking ID';
//             mockedPaymentService.getPaymentByBookingIdService.mockRejectedValue(new Error(errorMessage));
//
//             const res = await request(app).get(`/payment/booking/${bookingId}`);
//
//             expect(res.statusCode).toEqual(500);
//             expect(res.body.error).toEqual('Failed to fetch payment by booking ID');
//             expect(res.body.message).toEqual(errorMessage);
//         });
//     });
// });
