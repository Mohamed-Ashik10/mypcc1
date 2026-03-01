const net = require('net');
const tls = require('tls');

const host = 'gateway01.us-west-2.prod.aws.tidbcloud.com';
const port = 4000;

console.log(`Attempting basic TCP connection to ${host}:${port}...`);
const client = net.createConnection({ host, port }, () => {
    console.log('TCP Connected!');
    client.end();

    console.log(`\nAttempting TLS connection to ${host}:${port}...`);
    const tlsClient = tls.connect({ host, port, servername: host }, () => {
        console.log('TLS Connected!');
        tlsClient.end();
    });

    tlsClient.on('error', (err) => {
        console.error('TLS Connection Error:', err);
    });
});

client.on('error', (err) => {
    console.error('TCP Connection Error:', err);
});
