// import request from 'supertest';
// import app from '../../../src/index';
// import * as customerService from '../../../src/components/customer/customer.service';
//
// // Mock the entire customer.service module to prevent actual database calls.
// // This ensures that our integration tests for routes only test the Express layer (routes, controllers)
// // and not the data access layer.
// jest.mock('../../../src/components/customer/customer.service');
//
// // Cast the mocked service functions for easier TypeScript usage
// const mockedCustomerService = customerService as jest.Mocked<typeof customerService>;
//
// describe('Customer API Endpoints', () => {
//     // Clear all mocks before each test to ensure test isolation
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });
//
//     // Test suite for POST /customers (Create Customer)
//     describe('POST /customers', () => {
//         it('should create a new customer successfully', async () => {
//             const newCustomerData = {
//                 userID: 1
//             };
//             const createdCustomer = { customerID: 1, ...newCustomerData };
//
//             // Mock the service to return the newly created customer
//             mockedCustomerService.createCustomerService.mockResolvedValue(createdCustomer);
//
//             const res = await request(app)
//                 .post('/customers')
//                 .send(newCustomerData);
//
//             expect(res.statusCode).toEqual(201);
//             expect(res.body).toEqual(createdCustomer);
//             expect(mockedCustomerService.createCustomerService).toHaveBeenCalledWith(newCustomerData);
//         });
//
//         // it('should return 500 if an error occurs during customer creation', async () => {
//         //     const newCustomerData = {
//         //         userID: 1
//         //     };
//         //     const errorMessage = 'Database error creating customer';
//         //     // Mock the service to throw an error
//         //     mockedCustomerService.createCustomerService.mockRejectedValue(new Error(errorMessage));
//
//         //     const res = await request(app)
//         //         .post('/customers')
//         //         .send(newCustomerData);
//
//         //     expect(res.statusCode).toEqual(500);
//         //     expect(res.body.message).toEqual('Error creating customer');
//         //     expect(res.body.error).toBeDefined(); // Error object is present
//         //     expect(res.body.error.message).toEqual(errorMessage);
//         // });
//     });
//
//     // Test suite for GET /customer/email/:email (Get Customer by Email)
//     describe('GET /customer/email/:email', () => {
//         it('should return a customer by email', async () => {
//             const customerEmail = 'test@example.com';
//             const mockCustomer = {
//                 customerID: 1,
//                 userID: 1,
//                 email: customerEmail
//             };
//             mockedCustomerService.getCustomerByEmailService.mockResolvedValue(mockCustomer);
//
//             const res = await request(app).get(`/customer/email/${customerEmail}`);
//
//             expect(res.statusCode).toEqual(200);
//             expect(res.body).toEqual(mockCustomer);
//             expect(mockedCustomerService.getCustomerByEmailService).toHaveBeenCalledWith(customerEmail);
//         });
//
//         it('should return 404 if customer is not found by email', async () => {
//             const customerEmail = 'nonexistent@example.com';
//             mockedCustomerService.getCustomerByEmailService.mockResolvedValue(null);
//
//             const res = await request(app).get(`/customer/email/${customerEmail}`);
//
//             expect(res.statusCode).toEqual(404);
//             expect(res.body.message).toEqual('Customer not found');
//             expect(mockedCustomerService.getCustomerByEmailService).toHaveBeenCalledWith(customerEmail);
//         });
//
//         // it('should return 500 if an error occurs while getting customer by email', async () => {
//         //     const customerEmail = 'test@example.com';
//         //     const errorMessage = 'Database error getting customer by email';
//         //     mockedCustomerService.getCustomerByEmailService.mockRejectedValue(new Error(errorMessage));
//
//         //     const res = await request(app).get(`/customer/email/${customerEmail}`);
//
//         //     expect(res.statusCode).toEqual(500);
//         //     expect(res.body.message).toEqual('Error retrieving customer');
//         //     expect(res.body.error).toBeDefined();
//         //     expect(res.body.error.message).toEqual(errorMessage);
//         // });
//     });
//
//     // Test suite for GET /customer/:customerId (Get Customer by ID)
//     describe('GET /customer/:customerId', () => {
//         it('should return a customer by ID', async () => {
//             const customerId = 1;
//             const mockCustomer = {
//                 customerID: customerId,
//                 userID: 1
//             };
//             mockedCustomerService.getCustomerByIdService.mockResolvedValue(mockCustomer);
//
//             const res = await request(app).get(`/customer/${customerId}`);
//
//             expect(res.statusCode).toEqual(200);
//             expect(res.body).toEqual(mockCustomer);
//             expect(mockedCustomerService.getCustomerByIdService).toHaveBeenCalledWith(customerId);
//         });
//
//         it('should return 404 if customer is not found by ID', async () => {
//             const customerId = 999;
//             mockedCustomerService.getCustomerByIdService.mockResolvedValue(null);
//
//             const res = await request(app).get(`/customer/${customerId}`);
//
//             expect(res.statusCode).toEqual(404);
//             expect(res.body.message).toEqual('Customer not found');
//             expect(mockedCustomerService.getCustomerByIdService).toHaveBeenCalledWith(customerId);
//         });
//
//         // it('should return 500 if an error occurs while getting customer by ID', async () => {
//         //     const customerId = 1;
//         //     const errorMessage = 'Database error getting customer by ID';
//         //     mockedCustomerService.getCustomerByIdService.mockRejectedValue(new Error(errorMessage));
//
//         //     const res = await request(app).get(`/customer/${customerId}`);
//
//         //     expect(res.statusCode).toEqual(500);
//         //     expect(res.body.message).toEqual('Error retrieving customer');
//         //     expect(res.body.error).toBeDefined();
//         //     expect(res.body.error.message).toEqual(errorMessage);
//         // });
//     });
//
//     // Test suite for PATCH /customer (Update Customer)
//     describe('PATCH /customer', () => {
//         it('should update a customer successfully', async () => {
//             const updateData = { customerID: 1, userID: 2 };
//             const updatedCustomerResult = { customerID: 1, userID: 2 }; // The controller returns the updated object
//             mockedCustomerService.updateCustomerService.mockResolvedValue(updatedCustomerResult);
//
//             const res = await request(app)
//                 .patch('/customer')
//                 .send(updateData);
//
//             expect(res.statusCode).toEqual(200);
//             expect(res.body.message).toEqual('Updated successfully.');
//             expect(res.body.data).toEqual(updatedCustomerResult);
//             expect(mockedCustomerService.updateCustomerService).toHaveBeenCalledWith(updateData);
//         });
//
//         it('should return 500 if customer update fails (e.g., service returns falsy value)', async () => {
//             const updateData = { customerID: 1, userID: 2 };
//             mockedCustomerService.updateCustomerService.mockResolvedValue(null); // Simulate service failing to update
//
//             const res = await request(app)
//                 .patch('/customer')
//                 .send(updateData);
//
//             expect(res.statusCode).toEqual(500);
//             expect(res.body.message).toEqual('There was an error in updating the database entry.');
//             expect(mockedCustomerService.updateCustomerService).toHaveBeenCalledWith(updateData);
//         });
//
//         it('should return 500 if an error occurs during customer update', async () => {
//             const updateData = { customerID: 1, userID: 2 };
//             const errorMessage = 'Service threw an error during update';
//             mockedCustomerService.updateCustomerService.mockRejectedValue(new Error(errorMessage));
//
//             const res = await request(app)
//                 .patch('/customer')
//                 .send(updateData);
//
//             expect(res.statusCode).toEqual(500);
//             expect(res.body.message).toEqual('There was an error in updating the database entry.');
//             expect(mockedCustomerService.updateCustomerService).toHaveBeenCalledWith(updateData);
//         });
//     });
//
//     // Test suite for DELETE /customer/:id (Delete Customer)
//     describe('DELETE /customer/:id', () => {
//         it('should delete a customer successfully', async () => {
//             const customerIdToDelete = 1;
//
//             const deleteData = { customerID: customerIdToDelete };
//             mockedCustomerService.deleteCustomerService.mockResolvedValue(true); // Simulate successful deletion
//
//             const res = await request(app)
//                 .delete(`/customer/${customerIdToDelete}`)
//                 .send(deleteData);
//
//             expect(res.statusCode).toEqual(200);
//             expect(res.body.message).toEqual('Customer deleted successfully.');
//             expect(mockedCustomerService.deleteCustomerService).toHaveBeenCalledWith(deleteData);
//         });
//
//         it('should return 500 with success message if customer deletion fails (as per controller logic)', async () => {
//             const customerIdToDelete = 999;
//             const deleteData = { customerID: customerIdToDelete };
//             mockedCustomerService.deleteCustomerService.mockResolvedValue(false); // Simulate service failing to delete
//
//             const res = await request(app)
//                 .delete(`/customer/${customerIdToDelete}`)
//                 .send(deleteData);
//
//             expect(res.statusCode).toEqual(500);
//             expect(res.body.message).toEqual('Customer deleted successfully.');
//             expect(mockedCustomerService.deleteCustomerService).toHaveBeenCalledWith(deleteData);
//         });
//
//         it('should return 500 with success message if an error occurs during customer deletion (as per controller logic)', async () => {
//             const customerIdToDelete = 1;
//             const deleteData = { customerID: customerIdToDelete };
//             const errorMessage = 'Service threw an error during deletion';
//             mockedCustomerService.deleteCustomerService.mockRejectedValue(new Error(errorMessage));
//
//             const res = await request(app)
//                 .delete(`/customer/${customerIdToDelete}`)
//                 .send(deleteData);
//
//             expect(res.statusCode).toEqual(500);
//             expect(res.body.message).toEqual('Customer deleted successfully.');
//             expect(mockedCustomerService.deleteCustomerService).toHaveBeenCalledWith(deleteData);
//         });
//     });
// });
