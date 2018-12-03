'use strict';
const stream = require('stream');

module.exports.default = {
  get: jest.fn(url => {
    const r = new stream.Readable();

    r.push('hello world\n');
    r.push(null);

    return Promise.resolve({ data: r });
  })
};
