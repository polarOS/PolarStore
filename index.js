const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const App = require('./src/models/App.js');
const req = require('express/lib/request');
require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected!');
}) .catch(err => console.log(err));

// Views

app.get('/', (req, res) => {
    App.find({}, (err, apps) => {
        if(err) return res.render('message', { error: true, message: 'We couldn\'t load the apps on the database!' });
        res.render('index', { apps: apps });
    });
});

app.get('/apps/:id', (req, res) => {
    App.findOne({_id: req.params.id}, (err, app) => {
        if(err) return res.render('message', { error: true, message: 'Unable to find the specified app!' });
        res.render('app', { app: app });
    });
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
// Logging in/registration - PolarID will be linked with this. Leave blank

app.post('/api/users/register', async (req, res) => {
    console.log(req.body);
});

app.post('/api/users/login', (req, res) => {
    console.log(req.body);
});

// Apps

app.post('/api/apps/post', async(req, res, next) => {
    if(req.body.name == undefined || req.body.version == undefined || req.body.name.length > 24 || req.body.version.length > 5) {
        res.render('message', { error: true, message: 'Your post has failed to be created!' });
        return;
    }

    await App.create({
        logo: req.body.icon,
        version: req.body.version,
        download: req.body.download,
        shortDescription: req.body.shortDescription,
        longDescription: req.body.longDescription,
        maturityRating: req.body.maturityRating,
        compatibility: req.body.compatibility,
        language: req.body.language,
        category: req.body.category,
        name: req.body.name,
        authorId: 'in-dev',
        author: 'in-dev',
        reviews: [],
        dislikes: 0,
        likes: 0
    });

    res.redirect('/post-app?success=true');
    next();
});

app.post('/api/apps/:id/like', async(req, res, next) => {
    /* Add to user likes array after checking if they are logged in and liked the post already */
    /* If they liked the post, remove the like. As for dislike, the same thing. */
    App.findOneAndUpdate(
        {_id: req.params.id},
        {$inc: { likes: 1 }}
    ).then(() => {
        res.redirect(`/apps/${req.params.id}`);
    }).catch((err) => {
        console.log(err);
        res.render('/message', { error: true, message: `Failed to like ${app.name} for unknown reason.` });
        next();
    });
});

app.post('/api/apps/:id/dislike', async(req, res, next) => {
    App.findOneAndUpdate(
        {_id: req.params.id},
        {$inc: { dislikes: 1 }}
    ).then(() => {
        res.redirect(`/apps/${req.params.id}`);
    }).catch((err) => {
        console.log(err);
        res.render('/message', { error: true, message: `Failed to dislike ${app.name} for unknown reason.` });
        next();
    });
});

app.post('/api/apps/:id/reviews/post', async(req, res, next)  => {
    if(!req.body.content) {
        res.render('/message', { error: true, message: `Failed to review ${app.name} because there was no content.` });
    }

    App.findOne({_id: req.params.id}, (err, app) => {
        if(err || !app) return res.render('message', { error: true, message: `Unable to post review for ${app.name}, the app probably doesn't exist` });
        
        app.reviews.push({
            author: 'in-dev',
            authorId: 'in-dev',
            content: req.body.content,
            id: app.reviews.length + 1
        });

        app.save().then(() => {
            res.redirect(`/apps/${req.params.id}`);
        });
    });
});

app.post('/api/apps/:id/reviews/:reviewId/delete', async(req, res, next)  => {
    /* CHECK IF USER IS AUTHOR OR ADMIN */
    App.findOne({_id: req.params.id}, (err, app) => {
        if(err || !app) return res.render('message', { error: true, message: `Unable to post review for ${app.name}, the app probably doesn't exist` });
        
        for (var i = 0; i < app.reviews.length; i++) {
            var obj = app.reviews[i];
        
            if (req.params.reviewId.indexOf(obj.id) !== -1) {
                app.reviews.splice(i, 1);
            }
        }

        app.save().then(() => {
            res.redirect(`/apps/${req.params.id}`);
        });
    });
});

app.post('/api/apps/:id/delete', async(req, res, next)  => {
    /* CHECK IF LOGGED IN & IF USER IS AUTHOR OR ADMIN */
    App.findOneAndDelete({_id: req.params.id}, (err, app) => {
        if(err || !app) return res.render('message', { error: true, message: 'Unable to find the specified app!' });
        
        res.render('message', { error: false, message: `Successfully removed the application, ${app.name}!` });
        next();
    });
});

app.listen(8000, () => {
    console.log('SUCCESS: Listening on port 8000')
});