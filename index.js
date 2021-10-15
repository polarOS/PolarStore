const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.urlencoded({ extended: false }));

// Views

app.get('/', (req, res) => {
    res.render('index', { darkMode: true });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/post-app', (req, res) => {
    if(req.query.success == 'true') {
        res.render('post-app', { success: true });
        return;
    }

    res.render('post-app', { success: false });
});

// API

app.post('/api/store/add')

// Logging in/registration - PolarID will be linked with this. Leave blank

app.post('/api/users/register', async (req, res) => {
    console.log(req.body);
});

app.post('/api/users/login', (req, res) => {
    console.log(req.body);
});

app.post('/api/apps/post', (req, res) => {
    console.log(req.body);
});

app.listen(8000, () => {
    console.log('SUCCESS: Listening on port 8000')
});