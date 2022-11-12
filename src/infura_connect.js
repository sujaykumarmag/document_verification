const https = require('https');

const projectId = '2HMraZeW6Zh7lYIIR7e57SJ7d7O';
const projectSecret = 'e15efab3e919826630815c4f790e7b53';

const options = {
    host: 'ipfs.infura.io',
    port: 5001,
    path: '/api/v0/pin/add?arg=QmeGAVddnBSnKc1DLE7DLV9uuTqo5F7QbaveTjr45JUdQn',
    method: 'POST',
    auth: projectId + ':' + projectSecret,
};

let req = https.request(options, (res) => {
    let body = '';
    res.on('data', function (chunk) {
        body += chunk;
    });
    res.on('end', function () {
        console.log(body);
    });
});
req.end();