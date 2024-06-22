import express from 'express'
import dotenv from 'dotenv'
import DatabaseConnection from './utils/Database.js';
import cookieParser from 'cookie-parser'
import userRoutes from './routes/userRoute.js'
import tweetRoutes from './routes/tweetRoute.js'
import cors from 'cors'


dotenv.config({
    path:'./.env'
});

DatabaseConnection();

const app = express();


// Basic Middlewares to be used.

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());  // to convert the data into json
app.use(cookieParser());  // to use cookies

// Basic Middlewares to be used.

const corsOptions = {
    // origin: ['http://localhost:5173', 'https://twitter-clone-front-end.vercel.app'],    
    origin: 'https://twitter-clone-front-end.vercel.app', 
    credentials: true,
    // optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));



// APIs 

app.use('/api/v1/user', userRoutes )
app.use('/api/v1/tweet', tweetRoutes )


// APIs


app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
})


