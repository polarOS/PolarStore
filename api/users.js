const router = require('express').Router();
const App = require('../models/App');
const User = require('../models/User');

router.post('/:id/preferences/save', async(req, res) => {
    if(!req.isAuthenticated() || !req.params.id == req.user.id) return res.redirect(`/users/${req.params.id}`);

    await User.findOneAndUpdate(
        { discordId: req.params.id }, {
        polarStore: {
            apps: req.body.apps ? req.body.apps : req.user.polarStore.apps,
            likes: req.body.likes ? req.body.likes : req.user.polarStore.likes,
            motto: req.body.motto ? req.body.motto : req.user.polarStore.motto,
            bio: req.body.bio ? req.body.bio : req.user.polarStore.bio,
            admin: req.user.polarStore.admin,
            electAdmins: req.user.polarStore.electAdmins,
            psDeveloper: req.user.polarStore.psDeveloper,
            banned: user.polarStore.banned,
            createdAt: req.user.polarStore.createdAt
        }
    });

    res.redirect(`/users/${req.params.id}`);
});

router.post('/:id/addAdmin', async(req, res) => {
    const user = await User.findOne({discordId: req.params.id});
    if(!req.isAuthenticated() || !req.user.polarStore.electAdmins == true || !user) return res.redirect(`/users/${req.params.id}`);

    await User.findOneAndUpdate(
        { discordId: req.params.id }, {
        polarStore: {
            apps: user.polarStore.apps,
            likes: user.polarStore.likes,
            motto: user.polarStore.motto,
            bio: user.polarStore.bio,
            admin: true,
            electAdmins: user.polarStore.electAdmins,
            psDeveloper: user.polarStore.psDeveloper,
            banned: user.polarStore.banned,
            createdAt: user.polarStore.createdAt
        }
    });

    res.redirect(`/users/${req.params.id}`);
});

router.post('/:id/removeAdmin', async(req, res) => {
    const user = await User.findOne({discordId: req.params.id});
    if(!req.isAuthenticated() || !req.user.polarStore.electAdmins == true || !user) return res.redirect(`/users/${req.params.id}`);

    await User.findOneAndUpdate(
        { discordId: req.params.id }, {
        polarStore: {
            apps: user.polarStore.apps,
            likes: user.polarStore.likes,
            motto: user.polarStore.motto,
            bio: user.polarStore.bio,
            admin: false,
            electAdmins: user.polarStore.electAdmins,
            psDeveloper: user.polarStore.psDeveloper,
            banned: user.polarStore.banned,
            createdAt: user.polarStore.createdAt
        }
    });

    res.redirect(`/users/${req.params.id}`);
});

router.post('/:id/addDeveloper', async(req, res) => {
    const user = await User.findOne({discordId: req.params.id});
    if(!req.isAuthenticated() || !req.user.polarStore.electAdmins == true || !user) return res.redirect(`/users/${req.params.id}`);

    await User.findOneAndUpdate(
        { discordId: req.params.id }, {
        polarStore: {
            apps: user.polarStore.apps,
            likes: user.polarStore.likes,
            motto: user.polarStore.motto,
            bio: user.polarStore.bio,
            admin: user.polarStore.admin,
            electAdmins: user.polarStore.electAdmins,
            psDeveloper: true,
            banned: user.polarStore.banned,
            createdAt: user.polarStore.createdAt
        }
    });

    res.redirect(`/users/${req.params.id}`);
});

router.post('/:id/removeDeveloper', async(req, res) => {
    const user = await User.findOne({discordId: req.params.id});
    if(!req.isAuthenticated() || !req.user.polarStore.electAdmins == true || !user) return res.redirect(`/users/${req.params.id}`);

    await User.findOneAndUpdate(
        { discordId: req.params.id }, {
        polarStore: {
            apps: user.polarStore.apps,
            likes: user.polarStore.likes,
            motto: user.polarStore.motto,
            bio: user.polarStore.bio,
            admin: user.polarStore.admin,
            electAdmins: user.polarStore.electAdmins,
            psDeveloper: false,
            banned: user.polarStore.banned,
            createdAt: user.polarStore.createdAt
        }
    });

    res.redirect(`/users/${req.params.id}`);
});

router.post('/:id/addElector', async(req, res) => {
    const user = await User.findOne({discordId: req.params.id});
    if(!req.isAuthenticated() || !req.user.polarStore.electAdmins == true || !user) return res.redirect(`/users/${req.params.id}`);

    await User.findOneAndUpdate(
        { discordId: req.params.id }, {
        polarStore: {
            apps: user.polarStore.apps,
            likes: user.polarStore.likes,
            motto: user.polarStore.motto,
            bio: user.polarStore.bio,
            admin: user.polarStore.admin,
            electAdmins: true,
            psDeveloper: user.polarStore.psDeveloper,
            banned: user.polarStore.banned,
            createdAt: user.polarStore.createdAt
        }
    });

    res.redirect(`/users/${req.params.id}`);
});

router.post('/:id/removeElector', async(req, res) => {
    const user = await User.findOne({discordId: req.params.id});
    if(!req.isAuthenticated() || !req.user.polarStore.electAdmins == true || !user) return res.redirect(`/users/${req.params.id}`);

    await User.findOneAndUpdate(
        { discordId: req.params.id }, {
        polarStore: {
            apps: user.polarStore.apps,
            likes: user.polarStore.likes,
            motto: user.polarStore.motto,
            bio: user.polarStore.bio,
            admin: user.polarStore.admin,
            electAdmins: false,
            psDeveloper: user.polarStore.psDeveloper,
            banned: user.polarStore.banned,
            createdAt: user.polarStore.createdAt
        }
    });

    res.redirect(`/users/${req.params.id}`);
});

router.post('/:id/ban', async(req, res) => {
    const user = await User.findOne({discordId: req.params.id});
    if(!req.isAuthenticated() || !req.user.polarStore.electAdmins == true || !user) return res.redirect(`/users/${req.params.id}`);

    await User.findOneAndUpdate(
        { discordId: req.params.id }, {
        polarStore: {
            apps: user.polarStore.apps,
            likes: user.polarStore.likes,
            motto: user.polarStore.motto,
            bio: user.polarStore.bio,
            admin: user.polarStore.admin,
            electAdmins: user.polarStore.electAdmins,
            psDeveloper: user.polarStore.psDeveloper,
            banned: true,
            createdAt: user.polarStore.createdAt
        }
    });

    res.redirect(`/users/${req.params.id}`);
});

router.post('/:id/unban', async(req, res) => {
    const user = await User.findOne({discordId: req.params.id});
    if(!req.isAuthenticated() || !req.user.polarStore.electAdmins == true || !user) return res.redirect(`/users/${req.params.id}`);

    await User.findOneAndUpdate(
        { discordId: req.params.id }, {
        polarStore: {
            apps: user.polarStore.apps,
            likes: user.polarStore.likes,
            motto: user.polarStore.motto,
            bio: user.polarStore.bio,
            admin: user.polarStore.admin,
            electAdmins: user.polarStore.electAdmins,
            psDeveloper: user.polarStore.psDeveloper,
            banned: false,
            createdAt: user.polarStore.createdAt
        }
    });

    res.redirect(`/users/${req.params.id}`);
});

router.post('/:id/delete', async (req, res) => {
    if(!req.isAuthenticated()) return res.redirect(`/users/${req.params.id}`);
    if(req.query.admin == 'true')
        if(!req.user.polarStore.admin == true)
            return res.redirect(`/users/${req.params.id}`);
    else if(!req.params.id == req.user.id)
        return res.redirect(`/users/${req.params.id}`);

    User.findOne({ discordId: req.params.id }, async (err, user) => {
        if(err) return res.redirect(`/users/${req.params.id}`);

        for(const app of user.polarStore.apps) {
            App.findOneAndDelete({_id: app._id}, (err, app) => {
                if(err || !app) return res.render('message', { error: true, message: `Failed to delete account, unable to find app ${app.name}!` });
            });
        }

        await User.findOneAndUpdate({ discordId: req.params.id }, {polarStore: null});

        if(req.query.admin != 'true')
            req.logout();
        
        res.render('message', { error: false, message: `The account ${user.username} has been deleted.` });
    });
});

module.exports = router;