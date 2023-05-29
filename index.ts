import express from 'express';
import { handleError } from './utils/errors';

export const app = express();

app.use(express.json());


app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
});