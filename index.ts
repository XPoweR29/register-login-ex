import express from 'express';
import { userRouter } from './routers/user.router';
import { handleError } from './utils/errors';
import cors from 'cors';

export const app = express();

app.use(express.json()); 
app.use(cors({
    origin: '*',
    credentials: true
}));

app.use('/', userRouter);

app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
});