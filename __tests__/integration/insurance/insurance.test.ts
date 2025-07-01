// import request from 'supertest';
// import app from '../../../src/index.ts';
// import * as insuranceService from '../../../src/components/Insurance/insurance.service.ts';
//
//
// jest.mock('../../../src/components/Insurance/insurance.service.ts');
//
// const mockedInsuranceService = insuranceService as jest.Mocked<typeof insuranceService>;
//
// describe('Insurance API Endpoints', () => {
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });
//
//     // Test suite for POST /insurance (Create Insurance)
//     describe('POST /insurance', () => {
//         it('should create a new insurance policy successfully', async () => {
//             const newInsuranceData = {
//                 carID: 1,
//                 insuranceProvider: 'Acme Insurance',
//                 policyNumber: 'POL12345',
//                 startDate: '2025-06-01',
//                 endDate: '2026-05-31'
//             };
//             const createdInsurance = { insuranceID: 1, ...newInsuranceData };
//
//             mockedInsuranceService.createInsuranceService.mockResolvedValue(createdInsurance);
//
//             const res = await request(app)
//                 .post('/insurance')
//                 .send(newInsuranceData);
//
//             expect(res.statusCode).toEqual(201);
//             expect(res.body.message).toEqual('Insurance created');
//             expect(res.body.data).toEqual(createdInsurance);
//             expect(mockedInsuranceService.createInsuranceService).toHaveBeenCalledWith(newInsuranceData);
//         });
//
//         it('should return 500 if an error occurs during insurance creation', async () => {
//             const newInsuranceData = {
//                 carID: 1,
//                 insuranceProvider: 'Acme Insurance',
//                 policyNumber: 'POL12345',
//                 startDate: '2025-06-01'
//             };
//             const errorMessage = 'Database error creating insurance';
//
//             mockedInsuranceService.createInsuranceService.mockRejectedValue(new Error(errorMessage));
//
//             const res = await request(app)
//                 .post('/insurance')
//                 .send(newInsuranceData);
//
//             expect(res.statusCode).toEqual(500);
//             expect(res.body.error).toEqual('Failed to create insurance');
//             expect(res.body.message).toEqual(errorMessage);
//         });
//     });
//
//     // Test suite for GET /insurance/:insuranceId (Get Insurance by ID)
//     describe('GET /insurance/:insuranceId', () => {
//         it('should return an insurance policy by ID', async () => {
//             const insuranceId = 1;
//             const mockInsurance = {
//                 insuranceID: insuranceId,
//                 carID: 1,
//                 insuranceProvider: 'Acme Insurance',
//                 policyNumber: 'POL12345',
//                 startDate: '2025-06-01',
//                 endDate: '2026-05-31'
//             };
//             mockedInsuranceService.getInsuranceByIdService.mockResolvedValue(mockInsurance);
//
//             const res = await request(app).get(`/insurance/${insuranceId}`);
//
//             expect(res.statusCode).toEqual(200);
//             expect(res.body.message).toEqual('Insurance found');
//             expect(res.body.data).toEqual(mockInsurance);
//             expect(mockedInsuranceService.getInsuranceByIdService).toHaveBeenCalledWith(insuranceId);
//         });
//
//         it('should return 404 if insurance is not found by ID', async () => {
//             const insuranceId = 999;
//             mockedInsuranceService.getInsuranceByIdService.mockResolvedValue(null);
//
//             const res = await request(app).get(`/insurance/${insuranceId}`);
//
//             expect(res.statusCode).toEqual(404);
//             expect(res.body.message).toEqual(`Insurance with ID ${insuranceId} not found`);
//             expect(mockedInsuranceService.getInsuranceByIdService).toHaveBeenCalledWith(insuranceId);
//         });
//
//         it('should return 500 if an error occurs while getting insurance by ID', async () => {
//             const insuranceId = 1;
//             const errorMessage = 'Database error getting insurance by ID';
//             mockedInsuranceService.getInsuranceByIdService.mockRejectedValue(new Error(errorMessage));
//
//             const res = await request(app).get(`/insurance/${insuranceId}`);
//
//             expect(res.statusCode).toEqual(500);
//             expect(res.body.error).toEqual('Failed to get insurance');
//             expect(res.body.message).toEqual(errorMessage);
//         });
//     });
//
//     // Test suite for GET /insurance/car/:carId (Get Insurances by Car ID)
//     describe('GET /insurance/car/:carId', () => {
//         it('should return insurance policies for a specific car ID', async () => {
//             const carId = 1;
//             const mockInsurances = [
//                 { insuranceID: 1, carID: carId, insuranceProvider: 'Acme', policyNumber: 'P1', startDate: '2025-01-01', endDate: '2026-01-01' },
//                 { insuranceID: 2, carID: carId, insuranceProvider: 'Beta', policyNumber: 'P2', startDate: '2025-02-01', endDate: '2026-02-01' },
//             ];
//             mockedInsuranceService.getInsurancesByCarIdService.mockResolvedValue(mockInsurances);
//
//             const res = await request(app).get(`/insurance/car/${carId}`);
//
//             expect(res.statusCode).toEqual(200);
//             expect(res.body.message).toEqual(`Insurances for car ID ${carId}`);
//             expect(res.body.data).toEqual(mockInsurances);
//             expect(mockedInsuranceService.getInsurancesByCarIdService).toHaveBeenCalledWith(carId);
//         });
//
//         it('should return 200 with an empty array if no insurances found for car ID', async () => {
//             const carId = 999;
//             mockedInsuranceService.getInsurancesByCarIdService.mockResolvedValue([]);
//
//             const res = await request(app).get(`/insurance/car/${carId}`);
//
//             expect(res.statusCode).toEqual(200);
//             expect(res.body.message).toEqual(`Insurances for car ID ${carId}`);
//             expect(res.body.data).toEqual([]); // Controller returns an empty array, not undefined
//             expect(mockedInsuranceService.getInsurancesByCarIdService).toHaveBeenCalledWith(carId);
//         });
//
//         it('should return 500 if an error occurs while getting insurances by car ID', async () => {
//             const carId = 1;
//             const errorMessage = 'Database error getting insurances by car ID';
//             mockedInsuranceService.getInsurancesByCarIdService.mockRejectedValue(new Error(errorMessage));
//
//             const res = await request(app).get(`/insurance/car/${carId}`);
//
//             expect(res.statusCode).toEqual(500);
//             expect(res.body.error).toEqual('Failed to get insurances by car ID');
//             expect(res.body.message).toEqual(errorMessage);
//         });
//     });
//
//     // Test suite for GET /insurance/provider/:provider (Get Insurances by Provider)
//     describe('GET /insurance/provider/:provider', () => {
//         it('should return insurance policies by provider', async () => {
//             const provider = 'Acme Insurance';
//             const mockInsurances = [
//                 { insuranceID: 1, carID: 1, insuranceProvider: provider, policyNumber: 'P1', startDate: '2025-01-01', endDate: '2026-01-01' },
//                 { insuranceID: 3, carID: 3, insuranceProvider: provider, policyNumber: 'P3', startDate: '2025-03-01', endDate: '2026-03-01' },
//             ];
//             mockedInsuranceService.getInsurancesByProviderService.mockResolvedValue(mockInsurances);
//
//             const res = await request(app).get(`/insurance/provider/${provider}`);
//
//             expect(res.statusCode).toEqual(200);
//             expect(res.body.message).toEqual(`Insurances from provider: ${provider}`);
//             expect(res.body.data).toEqual(mockInsurances);
//             expect(mockedInsuranceService.getInsurancesByProviderService).toHaveBeenCalledWith(provider);
//         });
//
//         it('should return 200 with an empty array if no insurances found for the provider', async () => {
//             const provider = 'NonExistentProvider';
//             mockedInsuranceService.getInsurancesByProviderService.mockResolvedValue([]);
//
//             const res = await request(app).get(`/insurance/provider/${provider}`);
//
//             expect(res.statusCode).toEqual(200);
//             expect(res.body.message).toEqual(`Insurances from provider: ${provider}`);
//             expect(res.body.data).toEqual([]); // Controller returns an empty array
//             expect(mockedInsuranceService.getInsurancesByProviderService).toHaveBeenCalledWith(provider);
//         });
//
//         it('should return 500 if an error occurs while getting insurances by provider', async () => {
//             const provider = 'Acme Insurance';
//             const errorMessage = 'Database error getting insurances by provider';
//             mockedInsuranceService.getInsurancesByProviderService.mockRejectedValue(new Error(errorMessage));
//
//             const res = await request(app).get(`/insurance/provider/${provider}`);
//
//             expect(res.statusCode).toEqual(500);
//             expect(res.body.error).toEqual('Failed to get insurances by provider');
//             expect(res.body.message).toEqual(errorMessage);
//         });
//     });
//
//     // Test suite for GET /insurance (Get All Insurances)
//     describe('GET /insurance', () => {
//         it('should return all insurance policies', async () => {
//             const mockAllInsurances = [
//                 { insuranceID: 1, carID: 1, insuranceProvider: 'Acme', policyNumber: 'P1', startDate: '2025-01-01', endDate: '2026-01-01' },
//                 { insuranceID: 2, carID: 1, insuranceProvider: 'Beta', policyNumber: 'P2', startDate: '2025-02-01', endDate: '2026-02-01' },
//                 { insuranceID: 3, carID: 3, insuranceProvider: 'Acme', policyNumber: 'P3', startDate: '2025-03-01', endDate: '2026-03-01' },
//             ];
//             mockedInsuranceService.getAllInsurancesService.mockResolvedValue(mockAllInsurances);
//
//             const res = await request(app).get('/insurance');
//
//             expect(res.statusCode).toEqual(200);
//             expect(res.body.message).toEqual('All insurances');
//             expect(res.body.data).toEqual(mockAllInsurances);
//             expect(mockedInsuranceService.getAllInsurancesService).toHaveBeenCalledTimes(1);
//         });
//
//         it('should return 200 with an empty array if no insurance policies are found', async () => {
//             mockedInsuranceService.getAllInsurancesService.mockResolvedValue([]);
//
//             const res = await request(app).get('/insurance');
//
//             expect(res.statusCode).toEqual(200);
//             expect(res.body.message).toEqual('All insurances');
//             expect(res.body.data).toEqual([]); // Controller returns an empty array
//             expect(mockedInsuranceService.getAllInsurancesService).toHaveBeenCalledTimes(1);
//         });
//
//         it('should return 500 if an error occurs while getting all insurances', async () => {
//             const errorMessage = 'Database error getting all insurances';
//             mockedInsuranceService.getAllInsurancesService.mockRejectedValue(new Error(errorMessage));
//
//             const res = await request(app).get('/insurance');
//
//             expect(res.statusCode).toEqual(500);
//             expect(res.body.error).toEqual('Failed to get all insurances');
//             expect(res.body.message).toEqual(errorMessage);
//         });
//     });
// });
