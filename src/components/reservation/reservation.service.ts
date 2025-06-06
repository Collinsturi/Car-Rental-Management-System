import db from "../../Drizzle/db";
import {
  eq,
  and,
  or,
  isNull,
  isNotNull,
  gt,
  gte,
  lte,
  lt,
} from "drizzle-orm";
import { CustomerTable, ReservationEntity, ReservationTable, UsersTable, CarTable } from "../../Drizzle/schema";
import reservation from "./reservation.router";

// Get reservation by customer ID
export const getReservationByCustomerIdService = async (customerId: number) => {
    return await db.select()
      .from(ReservationTable)
      .rightJoin(CustomerTable as any, on => eq(CustomerTable.customerID, ReservationTable.customerID))
      .rightJoin(UsersTable as any, on => eq(UsersTable.userID, ReservationTable.customerID))
      .rightJoin(CarTable as any, on => eq(CarTable.carID, ReservationTable.carID))
      .where(eq(ReservationTable.customerID, customerId));

};

// Get reservation by car ID
export const getReservationByCarIdService = async (carId: number) => {
    return await db.select()
      .from(ReservationTable)
      .rightJoin(CustomerTable as any, on => eq(CustomerTable.customerID, ReservationTable.customerID))
      .rightJoin(UsersTable as any, on => eq(UsersTable.userID, ReservationTable.customerID))
      .rightJoin(CarTable as any, on => eq(CarTable.carID, ReservationTable.carID))
      .where(eq(ReservationTable.carID, carId));
};


// Get cars that have been returned (returnDate < NOW)
export const getReturnedCarsService = async () => {
    const now = new Date().toISOString().split("T")[0];

    return await db.select()
        .from(ReservationTable)
        .rightJoin(CustomerTable as any, on => eq(CustomerTable.customerID, ReservationTable.customerID))
        .rightJoin(UsersTable as any, on => eq(UsersTable.userID, ReservationTable.customerID))
        .rightJoin(CarTable as any, on => eq(CarTable.carID, ReservationTable.carID))
        .where(and(isNotNull(ReservationTable.returnDate), lt(ReservationTable.returnDate, now)))

};

// Get currently reserved cars
export const getCurrentlyReservedCarsService = async () => {
  const now = new Date().toISOString().split("T")[0];

  return await db
    .select()
    .from(ReservationTable)
      .rightJoin(CustomerTable as any, on => eq(CustomerTable.customerID, ReservationTable.customerID))
      .rightJoin(UsersTable as any, on => eq(UsersTable.userID, ReservationTable.customerID))
      .rightJoin(CarTable as any, on => eq(CarTable.carID, ReservationTable.carID))
    .where(
      and(
        lte(ReservationTable.pickupDate, now),
        or(
          isNull(ReservationTable.returnDate),
          gt(ReservationTable.returnDate, now)
        )
      )
    );
};

// Get currently reserved cars by customer
export const getCurrentlyReservedCarsByCustomerService = async (customerName: string) => {
  // Get the customer record
  const customer = await db.query.UsersTable.findFirst({
    where: eq(UsersTable.firstName, customerName),
  });

  console.log(customer)
  if (!customer) {
    throw new Error("Customer not found");
  }


  // Find currently reserved cars for the customer
  return await db.select()
      .from(ReservationTable)
      .rightJoin(CustomerTable as any, on => eq(CustomerTable.customerID, ReservationTable.customerID))
      .rightJoin(UsersTable as any, on => eq(UsersTable.userID, ReservationTable.customerID))
      .rightJoin(CarTable as any, on => eq(CarTable.carID, ReservationTable.carID))
      .where(and(
      eq(ReservationTable.customerID, customer.userID),
      or(
        isNull(ReservationTable.returnDate), // Not returned yet
      )
    ));
};


//Create reservation
export const createReservationService = async(reservation: ReservationEntity) => {
  return await db.insert(ReservationTable).values(reservation).returning();
}
