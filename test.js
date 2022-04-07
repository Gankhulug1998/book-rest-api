const https = require('https');
const fs = require('fs');
const certPath = '/etc/letsencrypt/live/httpstest.codekoala.net';
https.createServer({
    key: fs.readFileSync(`${certPath}/privkey.pem`),
    cert: fs.readFileSync(`${certPath}/fullchain.pem`)
}, (req, res) => {
    res.end('<h1>Hello!</h1>')
}).listen(443);