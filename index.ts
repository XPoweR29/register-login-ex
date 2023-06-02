import express from 'express';
import { userRouter } from './routers/user.router';
import { handleError } from './utils/errors';
import cors from 'cors';
import { refreshTokenRouter } from './routers/refreshToken.router';
import cookieParser from 'cookie-parser';

export const app = express();

app.use(express.json()); 
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(cookieParser());

app.use('/', userRouter);
app.use('/refresh', refreshTokenRouter);

app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001'); 
});