import {Express} from "express";
import { createCustomerController, getCustomerByEmailController, getCustomerByIdController } from "./customer.controller";


const customer = (app: Express) => {
    // Create customer
    app.route('/').post(createCustomerController)
    
    // Get customer by email
    app.route('/email/:email').get(getCustomerByEmailController);

    // Get customer by ID
    app.route('/:customerId').get(getCustomerByIdController);
}
