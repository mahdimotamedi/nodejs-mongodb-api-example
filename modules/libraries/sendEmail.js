const sender = require('emailsender');

module.exports = new class EmailSender {

    /**
     * sent email
     *
     * @param from
     * @param to
     * @param subject
     * @param content
     * @param callback
     */
    sent(from, to, subject, content, callback) {

        let mailConfig = {
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: 'v5lgevicafd32iga@ethereal.email',
                pass: 'AyUQDDN2MVPKDuJTJj'
            }
        };

        let _sender = new sender(mailConfig);

        let mailOptions = {
            from: from,
            to: to,
            subject: subject,
            html: content
        };

        _sender.send(mailOptions, (err, info) => {
            callback(err, info);
        });
    }
};