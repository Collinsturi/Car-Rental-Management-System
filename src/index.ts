import express from 'express';
import carRouter from './car/car.router'
import locationRouter from './location/location.router';

const app = express();
app.use(express.json());

//Application Routes
carRouter(app);
locationRouter(app);


app.listen(8081, () => {
    console.log('Server is running on port 8081');
});




