const DiscordStrategey = require('passport-discord').Strategy;
const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
const User = require('../../../models/User');
module.exports.newAccount = false;

const mail = require('../../../utils/mail.js')

passport.serializeUser((user, done) => {
    done(null, user.discordId);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findOne({ discordId: id });

    if(user)
        done(null, user);
});

const strat = new DiscordStrategey({
    clientID: '904440193099104286',
    clientSecret: process.env.DISCORD_SECRET,
    callbackURL: '/api/auth/redirect',
    scope: ['identify', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
    /**
     * accessToken: Recieve access token if auth success
     * refreshToken: Used to maintain session for user
     * profile: The user's profile
     * cb: Callback used when done
    */

    try {
        const user = await User.findOne({ discordId: profile.id });
        profile.refreshToken = refreshToken;

        if(!user) {
            this.newAccount = true;

            await User.create({
                username: profile.username,
                discriminator: profile.discriminator,
                avatar: profile.avatar,
                language: profile.locale,
                email: profile.email,
                createdAt: profile.fetchedAt,
                discordId: profile.id,
                polarStore:  {
                    apps: [],
                    likes: [],
                    motto: '',
                    bio: '',
                    admin: false,
                    electAdmins: false,
                    psDeveloper: false,
                    createdAt: new Date().toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', minute: 'numeric', hour: 'numeric' })
                }
            });

            done(null, user);
        } else {
            /*
                Update:
                * username
                * discriminator
                * avatar
                * language
                * email

                PolarStore data is updated FROM PolarStore, do NOT update PolarStore data
            */

            if(user.polarStore == undefined) {
                this.newAccount = true;

                const savedUser = await User.findOneAndUpdate(
                    { discordId: profile.id }, {
                    username: profile.username,
                    discriminator: profile.discriminator,
                    avatar: profile.avatar,
                    language: profile.locale,
                    email: profile.email,
                    createdAt: profile.fetchedAt,
                    discordId: profile.id,
                    polarStore:  {
                        apps: [],
                        likes: [],
                        motto: '',
                        bio: '',
                        admin: false,
                        electAdmins: false,
                        psDeveloper: false,
                        createdAt: new Date().toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', minute: 'numeric', hour: 'numeric' })
                    }
                });

                done(null, savedUser);
                return;
            }

            if(user.polarStore.createdAt == null) {
                const savedUser = await User.findOneAndUpdate(
                    { discordId: profile.id }, {
                    username: profile.username,
                    discriminator: profile.discriminator,
                    avatar: profile.avatar,
                    language: profile.locale,
                    email: profile.email,
                    polarStore:  {
                        apps: user.polarStore.apps,
                        likes: user.polarStore.likes,
                        motto: user.polarStore.motto,
                        bio: user.polarStore.bio,
                        admin: user.polarStore.admin,
                        electAdmins: user.polarStore.electAdmins,
                        psDeveloper: user.polarStore.psDeveloper,
                        createdAt: new Date().toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', minute: 'numeric', hour: 'numeric' })
                    }
                });

                done(null, savedUser);
                return;
            } else {
                const savedUser = await User.findOneAndUpdate(
                    { discordId: profile.id }, {
                    username: profile.username,
                    discriminator: profile.discriminator,
                    avatar: profile.avatar,
                    language: profile.locale,
                    email: profile.email
                });

                done(null, savedUser);
                return;
            }
        }
    } catch(err) {
        console.log(err);
        done(err, null);
    }
});

passport.use('discord', strat);
refresh.use(strat);