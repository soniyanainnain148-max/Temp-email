const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// API Base URL (1secmail API)
const API_BASE = 'https://www.1secmail.com/api/v1/';

// Route: Home Page
app.get('/', (req, res) => {
    res.render('index');
});

// Route: Generate Random Email
app.get('/api/generate', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE}?action=genRandomMailbox&count=1`);
        res.json({ success: true, email: response.data[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to generate email' });
    }
});

// Route: Check Inbox
app.get('/api/inbox', async (req, res) => {
    try {
        const { login, domain } = req.query;
        if (!login || !domain) return res.status(400).json({ error: 'Login or domain missing' });

        const response = await axios.get(`${API_BASE}?action=getMessages&login=${login}&domain=${domain}`);
        res.json({ success: true, messages: response.data });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch inbox' });
    }
});

// Route: Read Message
app.get('/api/read', async (req, res) => {
    try {
        const { login, domain, id } = req.query;
        if (!login || !domain || !id) return res.status(400).json({ error: 'Missing params' });

        const response = await axios.get(`${API_BASE}?action=readMessage&login=${login}&domain=${domain}&id=${id}`);
        res.json({ success: true, data: response.data });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to read message' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Dark GPT Email Server running on port ${PORT}`);
});
