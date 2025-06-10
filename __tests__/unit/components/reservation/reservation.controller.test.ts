import {
  createReservationController,
  getReservationByCustomerIdController,
  getReservationByCarIdController,
  getReturnedCarsController,
  getCurrentlyReservedCarsController,
  getCurrentlyReservedCarsByCustomerController
} from "../../../../src/components/reservation/reservation.controller";

import * as reservationService from "../../../../src/components/reservation/reservation.service";
import { Request, Response } from "express";

describe("Reservation Controller", () => {
  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("createReservationController - success", async () => {
    const req = { body: { carId: 1, customerId: 2 } } as Request;
    const res = mockResponse();
    jest.spyOn(reservationService, "createReservationService").mockResolvedValue([{ id: 1 }]);

    await createReservationController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Reservation created successfully.",
      payload: [{ id: 1 }]
    });
  });

  test("getReservationByCustomerIdController - found", async () => {
    const req = { params: { customerId: "5" } } as unknown as Request;
    const res = mockResponse();
    jest.spyOn(reservationService, "getReservationByCustomerIdService").mockResolvedValue([{ id: 1 }]);

    await getReservationByCustomerIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Reservations for customer", data: [{ id: 1 }] });
  });

  test("getReservationByCarIdController - not found", async () => {
    const req = { params: { carId: "3" } } as unknown as Request;
    const res = mockResponse();
    jest.spyOn(reservationService, "getReservationByCarIdService").mockResolvedValue([]);

    await getReservationByCarIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "No reservations were found for car id 3" });
  });

  test("getReturnedCarsController - empty", async () => {
    const req = {} as Request;
    const res = mockResponse();
    jest.spyOn(reservationService, "getReturnedCarsService").mockResolvedValue([]);

    await getReturnedCarsController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "There are no returned cars." });
  });

  test("getCurrentlyReservedCarsController - success", async () => {
    const req = {} as Request;
    const res = mockResponse();
    jest.spyOn(reservationService, "getCurrentlyReservedCarsService").mockResolvedValue([{ id: 2 }]);

    await getCurrentlyReservedCarsController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Currently reserved cars",
      data: [{ id: 2 }]
    });
  });

  test("getCurrentlyReservedCarsByCustomerController - none", async () => {
    const req = { params: { customerName: "Jane" } } as unknown as Request;
    const res = mockResponse();
    jest.spyOn(reservationService, "getCurrentlyReservedCarsByCustomerService").mockResolvedValue([]);

    await getCurrentlyReservedCarsByCustomerController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "There are no currently reserved cars for user Jane"
    });
  });
});
