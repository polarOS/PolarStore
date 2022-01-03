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
        reportFiled: false,
        reviews: [],
        dislikes: 0,
        likes: 0,
        createdAt: new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', minute: 'numeric', hour: 'numeric', second: 'numeric' })
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
    App.findOne({_id: req.params.id}, async(err, app) => {
        if(err || !app || !req.user) return res.render('message', { error: true, message: `Unable to post review for ${app.name}, the app probably doesn't exist` });

        for (var i = 0; i < app.reviews.length; i++) {
            var obj = app.reviews[i];

            if (req.params.reviewId.indexOf(obj.id) !== -1) {
                if(!req.user.admin)
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
    if(!req.isAuthenticated())
        return res.redirect('/');

    App.findOne({_id: req.params.id}, (err, app) => {
        if(!req.user.polarStore.admin)
            if(req.user.discordId !== app.author.discordId) return res.redirect('/');
        
        App.findOneAndDelete({_id: req.params.id}, (err, app) => {
            if(err || !app) return res.render('message', { error: true, message: 'Unable to find the specified app!' });
    
            User.findOne({ discordId: app.author.discordId }, (err, user) => {
                if(err) return res.render('message', { error: true, message: 'Unable to find user, maybe you were logged out during deleting an app?' });
                user.polarStore.apps.splice(user.polarStore.apps.indexOf({ _id: app._id }), 1);
                user.markModified('polarStore.apps');
                user.save();
            });
    
            res.render('message', { error: false, message: `Successfully removed the application, ${app.name}!` });
            next();
        });
    });
});

router.post('/:id/report', async(req, res, next)  => {
    App.findOne({_id: req.params.id}, (err, app) => {
        if(err) return res.render('message', { error: true, message: 'Unable to find app specified.'});
        if(app.reportFiled == true) return res.redirect(`/apps/${req.params.id}`);

        app.reportFiled = true;
        app.save((err, savedApp) => {
            if(err) return res.render('message', { error: true, message: 'Unable to report app for an unknown reason.'});
            res.redirect(`/apps/${req.params.id}`);
        });
    })
});

router.post('/:id/report/rm', async(req, res, next)  => {
    if(!req.user || !req.user.polarStore.admin) return res.redirect('/');
    App.findOne({_id: req.params.id}, (err, app) => {
        if(err) return res.render('message', { error: true, message: 'Unable to find app specified.'});
        if(app.reportFiled == false) return res.redirect('/reports');

        app.reportFiled = false;
        app.save((err, savedApp) => {
            if(err) return res.render('message', { error: true, message: 'Unable to report app for an unknown reason.'});
            res.redirect('/reports');
        });
    })
});

router.post('/:id/edit', async(req, res, next) => {
    if(!req.isAuthenticated()) {
        return res.redirect('/');
    }

    const app = await App.findOne({ _id: req.params.id });
    await App.findOneAndUpdate(
        { _id: req.params.id }, {
        name: req.body.name ? req.body.name : app.name,
        version: req.body.version ? req.body.version : app.version,
        shortDescription: req.body.shortDescription ? req.body.shortDescription : app.shortDescription,
        longDescription: req.body.longDescription ? req.body.longDescription : app.longDescription,
        maturityRating: req.body.maturityRating ? req.body.maturityRating : app.maturityRating,
        compatibility: req.body.compatibility ? req.body.compatibility : app.compatibility,
        language: req.body.language ? req.body.language : app.language,
        logo: req.body.logo ? req.body.logo : app.logo,
        author: {
            username: req.user.username,
            discriminator: req.user.discriminator,
            avatar: req.user.avatar,
            language: req.user.language,
            email: req.user.email,
            discordId: req.user.discordId,
            createdAt: req.user.createdAt
        }
    });
    
    User.findOne({ discordId: app.author.discordId }, (err, user) => {
        if(err) return res.render('message', { error: true, message: 'Unable to find user, maybe you were logged out during deleting an app?' });
        user.polarStore.apps.splice(user.polarStore.apps.indexOf({ _id: app._id }), 1);
        user.polarStore.apps.push({
            name: req.body.name ? req.body.name : app.name,
            version: req.body.version ? req.body.version : app.version,
            shortDescription: req.body.shortDescription ? req.body.shortDescription : app.shortDescription,
            longDescription: req.body.longDescription ? req.body.longDescription : app.longDescription,
            maturityRating: req.body.maturityRating ? req.body.maturityRating : app.maturityRating,
            compatibility: req.body.compatibility ? req.body.compatibility : app.compatibility,
            language: req.body.language ? req.body.language : app.language,
            logo: req.body.logo ? req.body.logo : app.logo,
            author: {
                username: req.user.username,
                discriminator: req.user.discriminator,
                avatar: req.user.avatar,
                language: req.user.language,
                email: req.user.email,
                discordId: req.user.discordId,
                createdAt: req.user.createdAt
            },
            reportFiled: app.reportFiled,
            reviews: app.reviews,
            dislikes: app.dislikes,
            likes: app.likes,
            createdAt: app.createdAt,
            _id: app._id
        });
        user.markModified('polarStore.apps');
        user.save();
    });

    res.redirect(`/apps/${req.params.id}`);
    next();
});

module.exports = router;