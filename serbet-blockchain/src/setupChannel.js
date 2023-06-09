const fs = require("fs");
const path = require("path");
const config = require("./config");
const setupClient = require("./setupFabricClient");
const logger = require("./logging").getLogger("setupChannel");

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

module.exports = setupChannel;
