// import request from 'supertest';
// import app from '../../../src/index';
// import * as maintenanceService from '../../../src/components/maintainance/maintainance.service';
//
// jest.mock('../../../src/components/maintainance/maintainance.service');
//
// const mockedMaintenanceService = maintenanceService as jest.Mocked<typeof maintenanceService>;
//
// describe('Maintenance API Endpoints', () => {
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });
//
//     // Test suite for POST /maintenance (Create Maintenance)
//     describe('POST /maintenance', () => {
//         it('should create a new maintenance entry successfully', async () => {
//             const newMaintenanceData = {
//                 carID: 1,
//                 maintenanceDate: '2025-06-15',
//                 description: 'Oil change and tire rotation',
//                 cost: '75.50'
//             };
//             const createdMaintenance = { maintenanceID: 1, ...newMaintenanceData };
//
//             mockedMaintenanceService.createMaintenanceService.mockResolvedValue(createdMaintenance);
//
//             const res = await request(app)
//                 .post('/maintenance')
//                 .send(newMaintenanceData);
//
//             expect(res.statusCode).toEqual(200);
//             expect(res.body.message).toEqual('Maintainance created');
//             expect(res.body.payload).toEqual(createdMaintenance);
//             expect(mockedMaintenanceService.createMaintenanceService).toHaveBeenCalledWith(newMaintenanceData);
//         });
//
//         it('should return 500 if maintenance creation fails (service returns falsy)', async () => {
//             const newMaintenanceData = {
//                 carID: 1,
//                 maintenanceDate: '2025-06-15',
//             };
//
//             mockedMaintenanceService.createMaintenanceService.mockResolvedValue(null);
//
//             const res = await request(app)
//                 .post('/maintenance')
//                 .send(newMaintenanceData);
//
//             expect(res.statusCode).toEqual(500);
//             expect(res.body.message).toEqual('There was an error creating a maintainance entry.');
//             expect(mockedMaintenanceService.createMaintenanceService).toHaveBeenCalledWith(newMaintenanceData);
//         });
//
//         it('should return 500 if an error occurs during maintenance creation service call', async () => {
//             const newMaintenanceData = {
//                 carID: 1,
//                 maintenanceDate: '2025-06-15',
//             };
//             const errorMessage = 'Service threw an error during maintenance creation';
//             mockedMaintenanceService.createMaintenanceService.mockRejectedValue(new Error(errorMessage));
//
//             const res = await request(app)
//                 .post('/maintenance')
//                 .send(newMaintenanceData);
//
//             expect(res.statusCode).toEqual(500);
//             expect(res.body.message).toEqual('There was an error creating a maintainance entry.');
//             expect(mockedMaintenanceService.createMaintenanceService).toHaveBeenCalledWith(newMaintenanceData);
//         });
//     });
//
//     // Test suite for GET /maintenance/:maintenanceId (Get Maintenance by ID)
//     describe('GET /maintenance/:maintenanceId', () => {
//         it('should return a maintenance record by ID', async () => {
//             const maintenanceId = 1;
//             const mockMaintenance = {
//                 maintenanceID: maintenanceId,
//                 carID: 1,
//                 maintenanceDate: '2025-06-15',
//                 description: 'Engine check',
//                 cost: '100.00'
//             };
//             mockedMaintenanceService.getMaintenanceByIdService.mockResolvedValue(mockMaintenance);
//
//             const res = await request(app).get(`/maintenance/${maintenanceId}`);
//
//             expect(res.statusCode).toEqual(200);
//             expect(res.body.message).toEqual('Maintenance found');
//             expect(res.body.data).toEqual(mockMaintenance);
//             expect(mockedMaintenanceService.getMaintenanceByIdService).toHaveBeenCalledWith(maintenanceId);
//         });
//
//         it('should return 404 if maintenance record is not found by ID', async () => {
//             const maintenanceId = 999;
//             mockedMaintenanceService.getMaintenanceByIdService.mockResolvedValue(null);
//
//             const res = await request(app).get(`/maintenance/${maintenanceId}`);
//
//             expect(res.statusCode).toEqual(404);
//             expect(res.body.message).toEqual(`Maintenance record with ID ${maintenanceId} not found`);
//             expect(mockedMaintenanceService.getMaintenanceByIdService).toHaveBeenCalledWith(maintenanceId);
//         });
//
//         it('should return 500 if an error occurs while getting maintenance by ID', async () => {
//             const maintenanceId = 1;
//             const errorMessage = 'Database error fetching maintenance by ID';
//             mockedMaintenanceService.getMaintenanceByIdService.mockRejectedValue(new Error(errorMessage));
//
//             const res = await request(app).get(`/maintenance/${maintenanceId}`);
//
//             expect(res.statusCode).toEqual(500);
//             expect(res.body.error).toEqual('Failed to fetch maintenance by ID');
//             expect(res.body.message).toEqual(errorMessage);
//         });
//     });
//
//     // Test suite for GET /maintenance/car/:carId (Get Maintenance by Car ID)
//     describe('GET /maintenance/car/:carId', () => {
//         it('should return maintenance records for a specific car ID', async () => {
//             const carId = 1;
//             const mockMaintenances = [
//                 { maintenanceID: 1, carID: carId, maintenanceDate: '2025-01-01', description: 'Tire change', cost: '50.00' },
//                 { maintenanceID: 2, carID: carId, maintenanceDate: '2025-03-01', description: 'Brake inspection', cost: '30.00' },
//             ];
//             mockedMaintenanceService.getMaintenanceByCarIdService.mockResolvedValue(mockMaintenances);
//
//             const res = await request(app).get(`/maintenance/car/${carId}`);
//
//             expect(res.statusCode).toEqual(200);
//             expect(res.body.message).toEqual(`Maintenances for car ID ${carId}`);
//             expect(res.body.data).toEqual(mockMaintenances);
//             expect(mockedMaintenanceService.getMaintenanceByCarIdService).toHaveBeenCalledWith(carId);
//         });
//
//         it('should return 200 with an empty array if no maintenance records found for car ID', async () => {
//             const carId = 999;
//             mockedMaintenanceService.getMaintenanceByCarIdService.mockResolvedValue([]);
//
//             const res = await request(app).get(`/maintenance/car/${carId}`);
//
//             expect(res.statusCode).toEqual(200);
//             expect(res.body.message).toEqual(`Maintenances for car ID ${carId}`);
//             expect(res.body.data).toEqual([]); // Controller returns an empty array
//             expect(mockedMaintenanceService.getMaintenanceByCarIdService).toHaveBeenCalledWith(carId);
//         });
//
//         it('should return 500 if an error occurs while getting maintenances by car ID', async () => {
//             const carId = 1;
//             const errorMessage = 'Database error fetching maintenances by car ID';
//             mockedMaintenanceService.getMaintenanceByCarIdService.mockRejectedValue(new Error(errorMessage));
//
//             const res = await request(app).get(`/maintenance/car/${carId}`);
//
//             expect(res.statusCode).toEqual(500);
//             expect(res.body.error).toEqual('Failed to fetch maintenances by car ID');
//             expect(res.body.message).toEqual(errorMessage);
//         });
//     });
// });
