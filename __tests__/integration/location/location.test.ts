// import request from 'supertest';
// import app from '../../../src/index';
// import * as locationService from '../../../src/components/location/location.service';
//
// jest.mock('../../../src/components/location/location.service');
//
// const mockedLocationService = locationService as jest.Mocked<typeof locationService>;
//
// describe('Location API Endpoints', () => {
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });
//
//     // Test suite for POST /location (Create Location)
//     describe('POST /location', () => {
//         it('should create a new location successfully', async () => {
//             const newLocationData = {
//                 locationName: 'Nairobi Branch',
//                 address: '123 Main Street, Nairobi',
//                 contactNumber: '254712345678'
//             };
//             const createdLocation = { locationID: 1, ...newLocationData };
//
//             mockedLocationService.createLocationService.mockResolvedValue(createdLocation);
//
//             const res = await request(app)
//                 .post('/location')
//                 .send(newLocationData);
//
//             expect(res.statusCode).toEqual(201);
//             expect(res.body.message).toEqual('Location created successfully.');
//             expect(res.body.payload).toEqual(createdLocation);
//             expect(mockedLocationService.createLocationService).toHaveBeenCalledWith(newLocationData);
//         });
//
//         it('should return 500 if location creation fails (service returns falsy)', async () => {
//             const newLocationData = {
//                 locationName: 'Invalid Location',
//                 address: 'Some Address',
//                 contactNumber: '123'
//             };
//             mockedLocationService.createLocationService.mockResolvedValue(null);
//
//             const res = await request(app)
//                 .post('/location')
//                 .send(newLocationData);
//
//             expect(res.statusCode).toEqual(500);
//             expect(res.body.message).toEqual('There was an error with creating a location');
//             expect(mockedLocationService.createLocationService).toHaveBeenCalledWith(newLocationData);
//         });
//
//         // it('should return 500 if an error occurs during location creation service call', async () => {
//         //     const newLocationData = {
//         //         locationName: 'Error Location',
//         //         address: 'Error Address',
//         //         contactNumber: '123'
//         //     };
//         //     const errorMessage = 'Service threw an error during location creation';
//         //     mockedLocationService.createLocationService.mockRejectedValue(new Error(errorMessage));
//
//         //     const res = await request(app)
//         //         .post('/location')
//         //         .send(newLocationData);
//
//         //     expect(res.statusCode).toEqual(500);
//         //     expect(res.text).toContain('Internal Server Error'); // Default Express error response
//         //     expect(mockedLocationService.createLocationService).toHaveBeenCalledWith(newLocationData);
//         // });
//     });
//
//     // Test suite for GET /location (Get All Locations)
//     describe('GET /location', () => {
//         it('should return all locations successfully', async () => {
//             const mockLocations = [
//                 { locationID: 1, locationName: 'Nairobi Branch', address: '123 Main Street', contactNumber: '111-222' },
//                 { locationID: 2, locationName: 'Mombasa Depot', address: '456 Beach Road', contactNumber: '333-444' },
//             ];
//             mockedLocationService.getAllLocationsService.mockResolvedValue(mockLocations);
//
//             const res = await request(app).get('/location');
//
//             expect(res.statusCode).toEqual(200);
//             expect(res.body.message).toEqual('List of all locations');
//             expect(res.body.data).toEqual(mockLocations);
//             expect(mockedLocationService.getAllLocationsService).toHaveBeenCalledTimes(1);
//         });
//
//         it('should return 200 with an empty array if no locations are found', async () => {
//             mockedLocationService.getAllLocationsService.mockResolvedValue([]);
//
//             const res = await request(app).get('/location');
//
//             expect(res.statusCode).toEqual(200);
//             expect(res.body.message).toEqual('List of all locations');
//             expect(res.body.data).toEqual([]);
//             expect(mockedLocationService.getAllLocationsService).toHaveBeenCalledTimes(1);
//         });
//
//         it('should return 500 if an error occurs while getting all locations', async () => {
//             const errorMessage = 'Database error fetching all locations';
//             mockedLocationService.getAllLocationsService.mockRejectedValue(new Error(errorMessage));
//
//             const res = await request(app).get('/location');
//
//             expect(res.statusCode).toEqual(500);
//             expect(res.body.message).toEqual('There was an error in getting all the available locations.');
//             // Note: The controller logs the error but returns a generic message, not the specific error message.
//             expect(mockedLocationService.getAllLocationsService).toHaveBeenCalledTimes(1);
//         });
//     });
// });
