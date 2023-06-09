let configObject = {
    "caEndpoint": process.env.CA_ENDPOINT || "grpcs://ca.m-tq6why2wyjhsxo5jzg5u3nvqei.n-mmbyd2u56rfpbdqrj6gv7uudda.managedblockchain.us-east-1.amazonaws.com:30002",
    "peerEndpoint": process.env.PEER_ENDPOINT || "grpcs://nd-n7qfgnkuljhbzghtfc7yrpxfiq.m-tq6why2wyjhsxo5jzg5u3nvqei.n-mmbyd2u56rfpbdqrj6gv7uudda.managedblockchain.us-east-1.amazonaws.com:30003",
    "ordererEndpoint": process.env.ORDERER_ENDPOINT || "grpcs://orderer.n-mmbyd2u56rfpbdqrj6gv7uudda.managedblockchain.us-east-1.amazonaws.com:30001",
    "channelName": process.env.CHANNEL_NAME || "mychannel",
    "chaincodeId": process.env.CHAIN_CODE_ID || "serbet-chaincode-js-v2:f6278a99a7800dbf0ca0ae0c1fe04d0a9bcb8bc43a2d48a8607017effbca57a9",
    "cryptoFolder": process.env.CRYPTO_FOLDER || '/tmp',
    "mspID": process.env.MSP || 'm-TQ6WHY2WYJHSXO5JZG5U3NVQEI',
    "memberName": process.env.MEMBERNAME || "serbet",
    "fabricUsername": "serbet"
}

module.exports = configObject;
