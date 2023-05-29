import express from 'express';

export const app = express();

app.use(express.json());

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
});