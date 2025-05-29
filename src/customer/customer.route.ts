import {Express} from "express";
import { createCustomerController, deleteCustomerController, getCustomerByEmailController, getCustomerByIdController, updateCustomerController } from "./customer.controller";


const customerRoute = (app: Express) => {
    // Create customer
    app.route('/customers').post(createCustomerController)
    
    // Get customer by email
    app.route('/customer/email/:email').get(getCustomerByEmailController);

    // Get customer by ID
    app.route('/customer/:customerId').get(getCustomerByIdController);

    app.route("/customer").patch(updateCustomerController);
    app.route("/customer/:id").delete(deleteCustomerController);
}

export default customerRoute;
