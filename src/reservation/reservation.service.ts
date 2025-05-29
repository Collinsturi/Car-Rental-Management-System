import db from "../Drizzle/db";
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
import { ReservationEntity, ReservationTable } from "../Drizzle/schema";
import reservation from "./reservation.router";

// Get reservation by customer ID
export const getReservationByCustomerIdService = async (customerId: number) => {
    return await db.query.ReservationTable.findMany({
        where: eq(ReservationTable.customerID, customerId),
    });
};

// Get reservation by car ID
export const getReservationByCarIdService = async (carId: number) => {
    return await db.query.ReservationTable.findMany({
        where: eq(ReservationTable.carID, carId),
    });
};


// Get cars that have been returned (returnDate < NOW)
export const getReturnedCarsService = async () => {
    const now = new Date();

    return await db.select()
        .from(ReservationTable)
        .where(and(isNotNull(ReservationTable.returnDate), lt(ReservationTable.returnDate, now)))

};

// Get currently reserved cars
export const getCurrentlyReservedCarsService = async () => {
  const now = new Date();

  return await db
    .select()
    .from(ReservationTable)
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
export const getCurrentlyReservedCarsByCustomerService = async (customerId: number) => {
    return await db.query.ReservationTable.findMany({
        where: and(
            eq(ReservationTable.customerID, customerId)
        ),
    });
};


//Create reservation
export const createReservationService = async(reservation: ReservationEntity) => {
  return await db.insert(ReservationTable).values(reservation).returning();
}
