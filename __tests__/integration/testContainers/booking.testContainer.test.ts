import request from 'supertest';
import bcrypt from 'bcryptjs';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import path from 'path';
import { CarTable, CustomerTable, UsersTable, BookingsTable, LocationTable } from '../../../src/Drizzle/schema';
import { eq } from 'drizzle-orm';

// Test database setup
let container: StartedPostgreSqlContainer;
let testDb: ReturnType<typeof drizzle>;
let sql: ReturnType<typeof postgres>;
let app: any;

// Test data variables
let token: string;
let userId: number;
let customerId: number;
let carId: number;
let bookingId: number;

const testUser = {
    firstName: "Booking",
    lastName: "Tester",
    email: "bookinguser@mail.com",
    password: "bookingpass123"
};

const testCustomer = {
    firstName: "John",
    lastName: "Customer",
    email: "customer@mail.com",
    phoneNumber: "1234567890",
    address: "123 Test Street",
    driversLicenseNumber: "DL123456789"
};

const testCar = {
    make: "Toyota",
    model: "Camry",
    year: 2023,
    color: "Blue",
    registrationNumber: "ABC123",
    dailyRate: "50.00",
    availability: true
};

const IMAGE = 'postgres:15';

beforeAll(async () => {
    // Start PostgreSQL container
    container = await new PostgreSqlContainer(IMAGE)
        .withDatabase('test_car_rental')
        .withUsername('test_user')
        .withPassword('test_password')
        .withExposedPorts(5432)
        .start();

    // Create database connection and run migrations
    const connectionString = container.getConnectionUri();
    sql = postgres(connectionString);
    testDb = drizzle(sql);

    // Run migrations
    try {
        console.log('Running migrations from ../../src/drizzle...');
        await migrate(testDb, { migrationsFolder: path.resolve(__dirname, '../../../src/Drizzle/migrations') });
        console.log('Migrations completed successfully');
    } catch (error) {
        console.error('Migration error:', error);
        throw new Error(`Failed to run migrations: ${error}`);
    }

    // Mock the database module BEFORE importing the app
    jest.doMock('../../../src/Drizzle/db', () => ({
        __esModule: true,
        default: testDb,
    }));

    // Clear the module cache and import the app AFTER setting up the mock
    jest.resetModules();
    app = require('../../../src/index').default;

    // Create test data
    await setupTestData();
}, 60000); // 60 second timeout

async function setupTestData() {
    // 1. Create a test user
    const hashedPassword = bcrypt.hashSync(testUser.password, 10);
    const [user] = await testDb.insert(UsersTable).values({
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
        password: hashedPassword,
        role: "user", 
        isVerified: true
    }).returning();
    userId = user.userID; 

    // 2. Create a test customer linked to the user
    const [customer] = await testDb.insert(CustomerTable).values({
        userID: userId
    }).returning();
    customerId = customer.customerID;

    // 3. Insert a location to associate with the car
    const [location] = await testDb.insert(LocationTable).values({
        locationName: "Test Depot",
        address: "456 Example Blvd",
        contactNumber: "9876543210"
    }).returning();

    // 4. Create a test car
    const [car] = await testDb.insert(CarTable).values({
        carModel: "Toyota Camry",
        year: "2023-01-01",
        color: "Blue",
        rentalRate: "50.00",
        availability: true,
        locationID: location.locationID
    }).returning();
    carId = car.carID;

    // 5. Login the user to get JWT token
    // const res = await request(app)
    //     .post("/auth/login")
    //     .send({
    //         email: testUser.email,
    //         password: testUser.password
    //     });

    // if (res.status !== 200) {
    //     console.error('Login response:', res.body);
    //     throw new Error(`Login failed: ${res.status} - ${JSON.stringify(res.body)}`);
    // }

    // token = res.body.token;
}

afterAll(async () => {
    // Clean up test data
    try {
        if (testDb) {
            await testDb.delete(BookingsTable);
            await testDb.delete(CarTable);
            await testDb.delete(CustomerTable);
            await testDb.delete(UsersTable);
            await testDb.delete(LocationTable);
        }
    } catch (error) {
        console.log('Cleanup error:', error);
    }
    
    // Close connections
    if (sql) {
        await sql.end();
    }
    if (container) {
        await container.stop();
    }
});

describe("Booking API Integration Tests with TestContainer", () => {
    it("Should create a booking", async () => {
        const booking = {
            carID: carId,
            customerID: customerId,
            rentalStartDate: "2025-07-01",
            rentalEndDate: "2025-07-05",
            totalAmount: "200.00"
        };

        const res = await request(app)
            .post("/booking")
            // .set("Authorization", `Bearer ${token}`)
            .send(booking);

        console.log(`Created Booking ID: ${bookingId}`);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message", "Booking created successfully");
        expect(res.body.booking).toHaveProperty("bookingID");
        bookingId = res.body.booking.bookingID;
        console.log(`Created Booking ID: ${bookingId}`);
    });

    it("Should get all bookings", async () => {
        const res = await request(app)
            .get("/booking")
            // .set("Authorization", `Bearer ${token}`);

        console.log("All Bookings:", res.body.data);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThan(0);
        console.log("All Bookings:", res.body.data);
    });

    it("Should get a booking by ID", async () => {
        const res = await request(app)
            .get(`/booking/${bookingId}`)
            // .set("Authorization", `Bearer ${token}`);

        console.log("Booking by ID:", res.body.data);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("bookingID", bookingId);
        expect(res.body.data).toHaveProperty("carID", carId);
        expect(res.body.data).toHaveProperty("customerID", customerId);
        console.log("Booking by ID:", res.body.data);
    });

    it("Should get bookings by car ID", async () => {
        const res = await request(app)
            .get(`/booking/car/${carId}`)
            // .set("Authorization", `Bearer ${token}`);

        console.log("Bookings by Car ID:", res.body.data);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThan(0);
        // expect(res.body.data[0]).toHaveProperty("carID", carId);
        console.log("Bookings by Car ID:", res.body.data);
    });

    it("Should get bookings by customer ID", async () => {
        const res = await request(app)
            .get(`/booking/customer/${customerId}`)
            // .set("Authorization", `Bearer ${token}`);

        console.log("Bookings by Customer ID:", res.body.data);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThan(0);
        // expect(res.body.data[0]).toHaveProperty("customerID", customerId);
        console.log("Bookings by Customer ID:", res.body.data);
    });

    // NEGATIVE TESTS
    it("Should not get a booking with invalid ID", async () => {
        const res = await request(app)
            .get("/booking/invalid-id")
            // .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", "Invalid ID");
    });

    it("Should not get a booking with non-existent ID", async () => {
        const res = await request(app)
            .get("/booking/99999")
            // .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual(
            expect.objectContaining({
                message: "Booking not found"
            })
        );
    });

    it("Should not get bookings with invalid car ID", async () => {
        const res = await request(app)
            .get("/booking/car/invalid-id")
            // .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", "Invalid car ID");
    });

    it("Should not get bookings with non-existent car ID", async () => {
        const res = await request(app)
            .get("/booking/car/99999")
            // .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual(
            expect.objectContaining({
                message: "No bookings found for this car"
            })
        );
    });

    it("Should not get bookings with invalid customer ID", async () => {
        const res = await request(app)
            .get("/booking/customer/invalid-id")
            // .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", "Invalid customer ID");
    });

    it("Should not get bookings with non-existent customer ID", async () => {
        const res = await request(app)
            .get("/booking/customer/99999")
            // .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual(
            expect.objectContaining({
                message: "No bookings found for this customer"
            })
        );
    });

    it("Should not create booking with missing required fields", async () => {
        const incompleteBooking = {
            carID: carId,
            // Missing customerID, dates, and totalAmount
        };

        const res = await request(app)
            .post("/booking")
            // .set("Authorization", `Bearer ${token}`)
            .send(incompleteBooking);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message");
    });

    it("Should not create booking with invalid car ID", async () => {
        const invalidBooking = {
            carID: 99999, // Non-existent car
            customerID: customerId,
            rentalStartDate: "2025-07-01",
            rentalEndDate: "2025-07-05",
            totalAmount: "200.00"
        };

        const res = await request(app)
            .post("/booking")
            // .set("Authorization", `Bearer ${token}`)
            .send(invalidBooking);

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual(
            expect.objectContaining({
                message: "Car not found"
            })
        );
    });

    it("Should not create booking with invalid customer ID", async () => {
        const invalidBooking = {
            carID: carId,
            customerID: 99999, // Non-existent customer
            rentalStartDate: "2025-07-01",
            rentalEndDate: "2025-07-05",
            totalAmount: "200.00"
        };

        const res = await request(app)
            .post("/booking")
            // .set("Authorization", `Bearer ${token}`)
            .send(invalidBooking);

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual(
            expect.objectContaining({
                message: "Customer not found"
            })
        );
    });

    // it("Should not create booking with invalid date range", async () => {
    //     const invalidBooking = {
    //         carID: carId,
    //         customerID: customerId,
    //         rentalStartDate: "2025-07-05", // End date before start date
    //         rentalEndDate: "2025-07-01",
    //         totalAmount: "200.00"
    //     };

    //     const res = await request(app)
    //         .post("/booking")
    //         // .set("Authorization", `Bearer ${token}`)
    //         .send(invalidBooking);

    //     expect(res.statusCode).toBe(400);
    //     expect(res.body).toEqual(
    //         expect.objectContaining({
    //             message: "Invalid date range: End date must be after start date"
    //         })
    //     );
    // });

    // it("Should not allow access without token", async () => {
    //     const res = await request(app)
    //         .get("/booking");
    //         // No Authorization header

    //     expect(res.statusCode).toBe(401);
    //     expect(res.body).toEqual(
    //         expect.objectContaining({
    //             message: "Unauthorized"
    //         })
    //     );
    // });

    // it("Should not allow access with invalid token", async () => {
    //     const res = await request(app)
    //         .get("/booking")
    //         .set("Authorization", "Bearer invalid-token");

    //     expect(res.statusCode).toBe(401);
    //     expect(res.body).toEqual(
    //         expect.objectContaining({
    //             message: "Invalid token"
    //         })
    //     );
    // });
}); 