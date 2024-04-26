import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js"
import userRouter from "./src/routes/authRoutes.js";
import adminRouter from "./src/routes/adminRoutes.js";
import cors from "cors"
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

app.use('/uploads',express.static(path.join(__dirname, 'src/uploads')))
console.log('__filename:', __filename);
console.log('__dirname:', __dirname);
console.log('Static files directory:', path.join(__dirname, 'src/uploads'));

app.use('/user',userRouter)
app.use('/admin',adminRouter);
const port = process.env.port||9000;
app.listen(port,()=>{
    console.log(`server running on port${port}`);
})