
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const oauth2 = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
oauth2.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

module.exports.send = async(options={
    sender: '👋 PolarStore',
    reciever: 'minecraftgamer4336@gmail.com',
    subject: 'Sent with Nodemail',
    body_text: 'Hello world!',
    body_html: '<h1>Hello world!</h1>'
}) => {
    try {
        const accessToken = await oauth2.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'oauth2',
                user: 'gooeywtf@gmail.com',
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: process.env.ACCESS_TOKEN
            }
        });

        const res = await transport.sendMail({
            from: options.sender,
            to: options.reciever,
            subject: options.subject,
            text: options.body_text,
            html: options.body_html
        });

        return res;
    } catch(err) {
        throw err;
    }
}