const NodeCache = require('node-cache');
const adminCache = new NodeCache({ stdTTL: 300 }); // 5 minutes default TTL

module.exports = adminCache;
