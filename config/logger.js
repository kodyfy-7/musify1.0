var graylog2 = require('graylog2');
// Create a new Graylog2 logger instance
var logger = new graylog2.graylog({
    servers: [{ host: '84.247.181.173', port: 12201 }], 
    hostname: 'Service-School-House',
    facility: 'SSH',
    bufferSize: 1400 
});

logger.on('error', function (error) {
    console.error('Error while trying to write to graylog2:', error);
});

module.exports = logger;
