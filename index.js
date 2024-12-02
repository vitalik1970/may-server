const express = require('express');
const cors = require('cors');  // Добавляем CORS
const fs = require('fs');

const app = express();

// Включаем CORS для всех доменов (это разрешит запросы с других сайтов)
app.use(cors());

// Для обработки JSON в теле запроса
app.use(express.json());

// Обработка GET запроса на корень
app.get('/', (req, res) => {
    // Читаем файл с сообщениями
    fs.readFile('messages.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading messages file:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Отправляем все сообщения как HTML
        const messages = data.split('\n').map(message => `<p>${message}</p>`).join('');
        res.send(`
            <html>
                <body>
                    <h1>Messages</h1>
                    ${messages}
                </body>
            </html>
        `);
    });
});

// Обработка POST запроса с сообщением
app.post('/send-message', (req, res) => {
    const message = req.body.message; // Получаем сообщение из тела запроса
    console.log('Received message:', message); // Выводим его на сервер

    // Сохраняем сообщение в файл
    fs.appendFile('messages.txt', `${new Date().toISOString()} - ${message}\n`, (err) => {
        if (err) {
            console.error('Error saving message:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({ success: 'Message received and saved' });
    });
});

// Запуск сервера
app.listen(8080, () => {
    console.log('Server is listening on port 8080');
});

