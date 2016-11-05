var nodemailer = require('nodemailer');
var secret = require('../../config/secret.js');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://noreply.bestway%40gmail.com:' + secret.getGmailPassword() + '@smtp.gmail.com');

var devsMails = 'clementpeyrabere@gmail.com';

var sendJobFailureMail = (jobName, error) => {

    var mailOptions = {
        from: '"Bestway Server" <noreply.bestway@gmail.com>',
        to: devsMails,
        subject: '[Bestway-PROD] Job Failure',
        text: '',
        html: 'Warning, Job [' + jobName + '] failed running on server at ' + new Date() + '<br /><br />' 
                + '<b>Error</b>: ' + error
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}



module.exports = {
    sendJobFailureMail: sendJobFailureMail
};