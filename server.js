const express = require('express');
const connectDB = require('./config/db');
const app = express();
const PORT = process.env.PORT || 5500;

// connect to database
connectDB();

// init middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
	res.send('Successfully connected to API.');
});

app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));

app.listen(PORT, () => console.log(`Connected to port:${PORT}`));
