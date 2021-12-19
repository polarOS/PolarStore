const router = require('express').Router();
const User = require('../models/User');

router.post('/:id/prefrences/save', async(req, res) => {
    const user = await User.findOne({ discordId: req.params.id });
    if(!req.isAuthenticated() || !user) return res.redirect('/');

    await User.findOneAndUpdate(
        { discordId: user.discordId }, {
        polarStore: {
            apps: req.body.apps ? req.body.apps : user.polarStore.apps,
            likes: req.body.likes ? req.body.likes : user.polarStore.likes,
            motto: req.body.motto ? req.body.motto : user.polarStore.motto,
            bio: req.body.bio ? req.body.bio : user.polarStore.bio,
        }
    });

    res.redirect(`/users/${req.params.id}`);
});

router.post('/:id/prefrences/delete', (req, res) => {
    res.redirect('/');
});

module.exports = router;