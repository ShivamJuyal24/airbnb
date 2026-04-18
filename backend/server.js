import dotenv from "dotenv";
dotenv.config();
console.log("Stripe key loaded:", process.env.STRIPE_SECRET_KEY ? "YES ✅" : "NO ❌");
import express from "express";
import cors from "cors";
import {connectDB} from "./src/config/db.js"
import authRoutes from "./src/routes/auth.routes.js";
import bookingRoutes from "./src/routes/booking.routes.js";
import listingRoutes from "./src/routes/listing.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
connectDB();
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/payment', paymentRoutes);



app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})
