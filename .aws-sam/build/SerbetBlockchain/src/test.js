'use strict';

const fs = require("fs");
const path = require("path");

const pemfile = fs.readFileSync(path.resolve(__dirname, "./certs/managedblockchain-tls-chain.pem"), "utf8");
console.log(pemfile)