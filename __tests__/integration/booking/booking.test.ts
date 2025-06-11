import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../../src/index';
import db from '../../../src/Drizzle/db';
import { BookingsTable, CarTable, CustomerTable, UsersTable } from '../../../src/Drizzle/schema';
import { eq } from 'drizzle-orm';

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

beforeAll(async () => {
    // Create a test user
    const hashedPassword = bcrypt.hashSync(testUser.password, 10);
    const [user] = await db.insert(UsersTable).values({
        ...testUser,
        password: hashedPassword,
        role: "admin",
        isVerified: true
    }).returning();
    userId = user.id;

    // Create a test customer
    const [customer] = await db.insert(CustomerTable).values(testCustomer).returning();
    customerId = customer.customerID;

    // Create a test car
    const [car] = await db.insert(CarTable).values(testCar).returning();
    carId = car.carID;

    // Login to get the token
    const res = await request(app)
        .post("/auth/login")
        .send({
            email: testUser.email,
            password: testUser.password
        });
    token = res.body.token;
});

// afterAll(async () => {
//     // Clean up test data
//     await db.delete(BookingsTable).where(eq(BookingsTable.customerID, customerId));
//     await db.delete(CarTable).where(eq(CarTable.carID, carId));
//     await db.delete(CustomerTable).where(eq(CustomerTable.customerID, customerId));
//     await db.delete(UsersTable).where(eq(UsersTable.email, testUser.email));
//     await db.$client.end();
// });

describe("Booking API Integration Tests", () => {
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
            .set("Authorization", `Bearer ${token}`)
            .send(booking);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message", "Booking created successfully");
        expect(res.body.booking).toHaveProperty("bookingID");
        bookingId = res.body.booking.bookingID;
        console.log(`Created Booking ID: ${bookingId}`);
    });

    it("Should get all bookings", async () => {
        const res = await request(app)
            .get("/booking")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThan(0);
        console.log("All Bookings:", res.body.data);
    });

    it("Should get a booking by ID", async () => {
        const res = await request(app)
            .get(`/booking/${bookingId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("bookingID", bookingId);
        expect(res.body.data).toHaveProperty("carID", carId);
        expect(res.body.data).toHaveProperty("customerID", customerId);
        console.log("Booking by ID:", res.body.data);
    });

    it("Should get bookings by car ID", async () => {
        const res = await request(app)
            .get(`/booking/car/${carId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data[0]).toHaveProperty("carID", carId);
        console.log("Bookings by Car ID:", res.body.data);
    });

    it("Should get bookings by customer ID", async () => {
        const res = await request(app)
            .get(`/booking/customer/${customerId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data[0]).toHaveProperty("customerID", customerId);
        console.log("Bookings by Customer ID:", res.body.data);
    });

    // NEGATIVE TESTS
    it("Should not get a booking with invalid ID", async () => {
        const res = await request(app)
            .get("/booking/invalid-id")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", "Invalid ID");
    });

    it("Should not get a booking with non-existent ID", async () => {
        const res = await request(app)
            .get("/booking/99999")
            .set("Authorization", `Bearer ${token}`);

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
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", "Invalid car ID");
    });

    it("Should not get bookings with non-existent car ID", async () => {
        const res = await request(app)
            .get("/booking/car/99999")
            .set("Authorization", `Bearer ${token}`);

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
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", "Invalid customer ID");
    });

    it("Should not get bookings with non-existent customer ID", async () => {
        const res = await request(app)
            .get("/booking/customer/99999")
            .set("Authorization", `Bearer ${token}`);

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
            .set("Authorization", `Bearer ${token}`)
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
            .set("Authorization", `Bearer ${token}`)
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
            .set("Authorization", `Bearer ${token}`)
            .send(invalidBooking);

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual(
            expect.objectContaining({
                message: "Customer not found"
            })
        );
    });

    it("Should not create booking with invalid date range", async () => {
        const invalidBooking = {
            carID: carId,
            customerID: customerId,
            rentalStartDate: "2025-07-05", // End date before start date
            rentalEndDate: "2025-07-01",
            totalAmount: "200.00"
        };

        const res = await request(app)
            .post("/booking")
            .set("Authorization", `Bearer ${token}`)
            .send(invalidBooking);

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(
            expect.objectContaining({
                message: "Invalid date range: End date must be after start date"
            })
        );
    });

    it("Should not allow access without token", async () => {
        const res = await request(app)
            .get("/booking")
            .set("Authorization", ""); // No token

        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(
            expect.objectContaining({
                message: "Unauthorized"
            })
        );
    });

    it("Should not allow access with invalid token", async () => {
        const res = await request(app)
            .get("/booking")
            .set("Authorization", "Bearer invalid-token");

        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(
            expect.objectContaining({
                message: "Invalid token"
            })
        );
    });
});