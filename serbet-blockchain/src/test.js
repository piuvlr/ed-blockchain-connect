'use strict';

const fs = require("fs");
const path = require("path");
const Fabric_Client = require("fabric-client");
const config = require("./config");
const logger = require("./logging").getLogger("setupFabricClient");

async function setupClient() {

    logger.info("=== setupClient start ===");

    let fabric_client = await Fabric_Client.loadFromConfig(path.join(__dirname, "./connection-profile.yaml"));

    const store_path = path.join(config.cryptoFolder);

    const crypto_suite = Fabric_Client.newCryptoSuite();
    const crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
    crypto_suite.setCryptoKeyStore(crypto_store);
    fabric_client.setCryptoSuite(crypto_suite);

    const username = config.fabricUsername;

    const privatePEM = fs.readFileSync(path.resolve(__dirname, "./certs/keystore/40b37738efc2748b8a8e3e3af7ddb53f1639c4b39bb451c458ab9bba49ef7a51_sk"), "utf8");
    const signedPEM =  fs.readFileSync(path.resolve(__dirname, "./certs/signcerts/cert.pem"), "utf8");

    const opt = {username, mspid: config.mspID, cryptoContent: {privateKeyPEM: privatePEM, signedCertPEM: signedPEM}, skipPersistence: true}
    console.log(opt)

    let fabricUser = await fabric_client.createUser({username, mspid: config.mspID, cryptoContent: {privateKeyPEM: privatePEM, signedCertPEM: signedPEM}, skipPersistence: true});
    await fabric_client.setUserContext(fabricUser, true);

    logger.info("=== setupClient end ===");

    return fabric_client;
}

async function setupChannel() {

    logger.info("=== setupChannel start ===");

    let client = await setupClient();

    let channel = client.getChannel(config.channelName, false);
    if (channel == null) {
        channel = client.newChannel(config.channelName);
    }

    let peer = channel.getPeers()[0];
    const pemfile = fs.readFileSync(path.resolve(__dirname, "./certs/managedblockchain-tls-chain.pem"), "utf8");

    if (!peer) {
        let peerEndpoints = config.peerEndpoint.split(",");
        for (let i in peerEndpoints) {
            channel.addPeer(client.newPeer(peerEndpoint[i], {pem:pemfile}));
            // Additional peer settings: https://fabric-sdk-node.github.io/Channel.html#addPeer__anchor
        }
    }

    let orderer = channel.getOrderers()[0];
    if (!orderer) {
        orderer = client.newOrderer(config.ordererEndpoint, {pem:pemfile})
        channel.addOrderer(orderer);
    }

    logger.info("=== setupChannel end ===");
    return channel;
}

async function init() {
    console.log("=================== INICIANDO TESTE ================================");
    let chanel = await setupChannel();

    console.log("==================== CLIENT =====================================");
    console.log(chanel.getPeers())
}

init();