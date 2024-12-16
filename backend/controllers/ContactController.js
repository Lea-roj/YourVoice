var ContactModel = require('../models/ContactModel');
// const http = require('node:http');
const https = require('https');


module.exports = {
    forward: function(req, res) {
        const postData = JSON.stringify({
            from: { "email": "info@trial-3zxk54vd1064jy6v.mlsender.net"},
            to: [{ "email": "lucijan.hrastnik2@gmail.com" }],
            subject: "SUPPORT TICKET: " + req.body.subject,
            text: "FROM: TEMPUSER\n\n" + req.body.text,
        });
        const options = {
            host: 'api.mailersend.com',
            port: 443,
            path: '/v1/email/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': 'Bearer mlsn.b08a728293a74e7fb994af317cf5fd4bda967842ab611d22a725db8082fbf481'
            },
        };
        const request = https.request(options, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        })

        request.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });
        request.write(postData);
        request.end();




        res.status(200).json({
            message: 'Success.',
        });
        return res.json;
    }
};