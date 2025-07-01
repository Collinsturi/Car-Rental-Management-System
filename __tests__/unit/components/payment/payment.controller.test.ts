// import {
//   createPaymentcontroller,
//   getPaymentByIdController,
//   getPaymentByBookingIdController
// } from "../../../../src/components/payment/payment.controller";
//
// import * as paymentService from "../../../../src/components/payment/payment.service";
// import { Request, Response } from "express";
//
// describe("Payment Controller", () => {
//   const mockResponse = () => {
//     const res = {} as Response;
//     res.status = jest.fn().mockReturnValue(res);
//     res.json = jest.fn().mockReturnValue(res);
//     return res;
//   };
//
//   afterEach(() => {
//     jest.clearAllMocks();
//   });
//
//   test("createPaymentcontroller - success", async () => {
//     const req = { body: { amount: 100 } } as Request;
//     const res = mockResponse();
//     jest.spyOn(paymentService, "createPaymentService").mockResolvedValue({ id: 1 });
//
//     await createPaymentcontroller(req, res);
//
//     expect(res.status).toHaveBeenCalledWith(201);
//     expect(res.json).toHaveBeenCalledWith({
//       message: "Payment created successfully.",
//       payload: { id: 1 }
//     });
//   });
//
//   test("getPaymentByIdController - found", async () => {
//     const req = { params: { paymentId: "1" } } as unknown as Request;
//     const res = mockResponse();
//     jest.spyOn(paymentService, "getPaymentByIdService").mockResolvedValue({ id: 1 });
//
//     await getPaymentByIdController(req, res);
//
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({
//       message: "Payment found",
//       data: { id: 1 }
//     });
//   });
//
//   test("getPaymentByIdController - not found", async () => {
//     const req = { params: { paymentId: "99" } } as unknown as Request;
//     const res = mockResponse();
//     jest.spyOn(paymentService, "getPaymentByIdService").mockResolvedValue(null);
//
//     await getPaymentByIdController(req, res);
//
//     expect(res.status).toHaveBeenCalledWith(404);
//     expect(res.json).toHaveBeenCalledWith({ message: "Payment with ID 99 not found" });
//   });
//
//   test("getPaymentByBookingIdController - success", async () => {
//     const req = { params: { bookingId: "10" } } as unknown as Request;
//     const res = mockResponse();
//     jest.spyOn(paymentService, "getPaymentByBookingIdService").mockResolvedValue({ id: 3 });
//
//     await getPaymentByBookingIdController(req, res);
//
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({
//       message: "Payment found",
//       data: { id: 3 }
//     });
//   });
// });
