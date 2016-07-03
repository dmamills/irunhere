const bookshelf = require('../database');

const Order = bookshelf.Model.extend({
    tableName: 'orders',
    hasTimestamps: true
});

module.exports = Order;
