import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js"
import userRouter from "./src/routes/authRoutes.js";
import adminRouter from "./src/routes/adminRoutes.js";
import cors from "cors"
// import passport from "./passport-config.js"



const app = express();
dotenv.config();
connectDB();

// app.use(session({
//         secret:'our-secret',
//         resave:false,
//         saveUninitialized:true
// }))
// app.use(passport.initialize());
// app.use(passport.session());

// app.use('/',authRoutes)



app.use(cors({
    origin: '*'
  }));
app.use(express.json());
app.use('/user',userRouter)
app.use('/admin',adminRouter);
const port = process.env.port||9000;
app.listen(port,()=>{
    console.log(`server running on port${port}`);
})