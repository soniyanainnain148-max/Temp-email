const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Temp Mail API
const API_BASE = 'https://api.temp-mail.org';

// Route: Home Page
app.get('/', (req, res) => {
    res.render('index');
});

// Route: Generate Random Email
app.get('/api/generate', async (req, res) => {
    try {
        const response = await axios.post(`${API_BASE}/v1/email`);
        const email = response.data.email;
        const token = response.data.token;
        
        res.json({ 
            success: true, 
            email: email,
            token: token
        });
    } catch (error) {
        console.error('Generate Error:', error.message);
        res.status(500).json({ success: false, error: error.message || 'Failed to generate email' });
    }
});

// Route: Check Inbox
app.get('/api/inbox', async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) return res.status(400).json({ error: 'Token missing' });

        const response = await axios.get(`${API_BASE}/v1/email/${token}/messages`);
        res.json({ success: true, messages: response.data });
    } catch (error) {
        console.error('Inbox Error:', error.message);
        res.status(500).json({ success: false, error: error.message || 'Failed to fetch inbox' });
    }
});

// Route: Read Message
app.get('/api/read', async (req, res) => {
    try {
        const { token, id } = req.query;
        if (!token || !id) return res.status(400).json({ error: 'Missing params' });

        const response = await axios.get(`${API_BASE}/v1/email/${token}/messages/${id}`);
        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error('Read Error:', error.message);
        res.status(500).json({ success: false, error: error.message || 'Failed to read message' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Dark GPT Email Server running on port ${PORT}`);
});
