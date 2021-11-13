const router = require('express').Router();
const App = require('../models/App');

router.post('/post', async(req, res, next) => {
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

router.post('/:id/like', async(req, res, next) => {
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

router.post('/:id/dislike', async(req, res, next) => {
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

router.post('/:id/reviews/post', async(req, res, next)  => {
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

router.post('/:id/reviews/:reviewId/delete', async(req, res, next)  => {
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

router.post('/:id/delete', async(req, res, next)  => {
    /* CHECK IF LOGGED IN & IF USER IS AUTHOR OR ADMIN */
    App.findOneAndDelete({_id: req.params.id}, (err, app) => {
        if(err || !app) return res.render('message', { error: true, message: 'Unable to find the specified app!' });

        res.render('message', { error: false, message: `Successfully removed the application, ${app.name}!` });
        next();
    });
});

module.exports = router;