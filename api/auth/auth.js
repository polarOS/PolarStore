const router = require('express').Router();
const passport = require('passport');

router.get('/', passport.authenticate('discord'));

router.get('/redirect',
    passport.authenticate('discord', {
        successRedirect: '/',
        failureRedirect: `/login?error=${encodeURIComponent('Please report this to asciidude#0001 (or retry)')}`
    })
);

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;