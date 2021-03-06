'use strict';

const common = require('../common.js');
const http = require('http');

const bench = common.createBenchmark(main, {
  n: [10, 1000],
  len: [1, 100],
});

function main({ len, n }) {
  const headers = {
    'Connection': 'keep-alive',
    'Transfer-Encoding': 'chunked',
  };

  const Is = [ ...Array(n / len).keys() ];
  const Js = [ ...Array(len).keys() ];
  for (const i of Is) {
    headers[`foo${i}`] = Js.map(() => `some header value ${i}`);
  }

  const server = http.createServer((req, res) => {
    res.writeHead(200, headers);
    res.end();
  });
  server.listen(common.PORT, () => {
    bench.http({
      path: '/',
      connections: 10
    }, () => {
      server.close();
    });
  });
}
