import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const express = require('express');
const bodyParser = require('body-parser');
import cors from 'cors';
const app = express();
const port = 3000;


const data = [
    {
        email: 'jim@gmail.com',
        number: '221122'
    },
    {
        email: 'jam@gmail.com',
        number: '830347'
    },
    {
        email: 'john@gmail.com',
        number: '221122'
    },
    {
        email: 'jams@gmail.com',
        number: '349425'
    },
    {
        email: 'jams@gmail.com',
        number: '141424'
    },
    {
        email: 'jill@gmail.com',
        number: '822287'
    },
    {
        email: 'jill@gmail.com',
        number: '822286'
    }
];


app.use(cors());
app.use(bodyParser.json());

app.post('/search', (req, res) => {
    const { email, number } = req.body;

    setTimeout(() => {
        const results = data.filter(user => user.email === email && (!number || user.number === number));

        if (results.length === 0) {
            res.status(404).send('Такого пользователя не существует');
        } else {
            const response = results.map(user => `Пользователь: ${user.email} с номером ${user.number} найден`);
            res.send(response);
        }
    }, 5000);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});