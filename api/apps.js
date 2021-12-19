const router = require('express').Router();
const App = require('../models/App');
const User = require('../models/User');

router.post('/post', async(req, res, next) => {
    if(!req.isAuthenticated()) {
        return res.redirect('/');
    }

    if(req.body.name == undefined || req.body.version == undefined || req.body.name.length > 24 || req.body.version.length > 5) {
        res.render('message', { error: true, message: 'Your post has failed to be created!' });
        return;
    }

    const app = await App.create({
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
        author: {
            username: req.user.username,
            discriminator: req.user.discriminator,
            avatar: req.user.avatar,
            language: req.user.language,
            email: req.user.email,
            discordId: req.user.discordId,
            createdAt: req.user.createdAt
        },
        reviews: [],
        dislikes: 0,
        likes: 0
    });

    User.findOne({ discordId: req.user.discordId }, (err, user) => {
        if(err) return res.render('message', { error: true, message: 'Unable to find user, maybe you were logged out during posting an app?' });
        user.polarStore.apps.push(app);
        user.markModified('polarStore.apps');
        user.save();
    });

    res.redirect('/post-app?success=true');
    next();
});

router.post('/:id/like', async(req, res, next) => {
    /* Add to user likes array after checking if they are logged in and liked the post already */
    /* If they liked the post, remove the like. As for dislike, the same thing. */
    if(!req.isAuthenticated()) {
        return res.redirect(`/apps/${req.params.id}`);
    }

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

    App.findOne({_id: req.params.id}, async (err, app) => {
        if(err || !app || !req.user) return res.render('message', { error: true, message: `Unable to post review for ${app.name}, the app probably doesn't exist` });

        app.reviews.push({
            author: {
                username: req.user.username,
                discriminator: req.user.discriminator,
                avatar: req.user.avatar,
                language: req.user.language,
                email: req.user.email,
                discordId: req.user.discordId,
                createdAt: req.user.createdAt
            },
            content: req.body.content,
            id: app.reviews.length + 1
        });

        await app.save();
        res.redirect(`/apps/${app.id}`);
    });
});

router.post('/:id/reviews/:reviewId/delete', async(req, res, next)  => {
    /* CHECK IF USER IS AUTHOR OR ADMIN */
    App.findOne({_id: req.params.id}, async(err, app) => {
        if(err || !app || !req.user) return res.render('message', { error: true, message: `Unable to post review for ${app.name}, the app probably doesn't exist` });

        for (var i = 0; i < app.reviews.length; i++) {
            var obj = app.reviews[i];

            if (req.params.reviewId.indexOf(obj.id) !== -1) {
                if(
                    !app.author.discordId == req.user.discordId ||
                    !app.reviews[i].author.discordId == req.user.discordId
                  ) return res.redirect(`/apps/${app.id}`);

                app.reviews.splice(i, 1);
            }
        }

        await app.save();
        res.redirect(`/apps/${app.id}`);
    });
});

router.post('/:id/delete', async(req, res, next)  => {
    /* CHECK IF LOGGED IN & IF USER IS AUTHOR OR ADMIN */
    App.findOneAndDelete({_id: req.params.id}, (err, app) => {
        if(err || !app) return res.render('message', { error: true, message: 'Unable to find the specified app!' });

        User.findOne({ discordId: req.user.discordId }, (err, user) => {
            if(err) return res.render('message', { error: true, message: 'Unable to find user, maybe you were logged out during posting an app?' });
            user.polarStore.apps.splice(user.polarStore.apps.indexOf({ _id: app._id }), 1);
            user.markModified('polarStore.apps');
            user.save();
        });

        res.render('message', { error: false, message: `Successfully removed the application, ${app.name}!` });
        next();
    });
});

module.exports = router;