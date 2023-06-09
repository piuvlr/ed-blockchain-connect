const path = require("path");
const AWS = require('aws-sdk');
const Fabric_Client = require('fabric-client');
const config = require("./config");
const fs = require("fs");
const logger = require("./logging").getLogger("setupFabricClient");

async function setupClient() {
    
    logger.info("=== setupClient start ===");
    
	let fabric_client = Fabric_Client.loadFromConfig(path.join(__dirname, "./connection-profile.yaml"));

	const store_path = path.join(config.cryptoFolder);

	const crypto_suite = Fabric_Client.newCryptoSuite();
	const crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
	crypto_suite.setCryptoKeyStore(crypto_store);
	fabric_client.setCryptoSuite(crypto_suite);

    const username = config.fabricUsername;
    const privatePEM = fs.readFileSync(path.resolve(__dirname, "./certs/keystore/40b37738efc2748b8a8e3e3af7ddb53f1639c4b39bb451c458ab9bba49ef7a51_sk"), "utf8");
    const signedPEM =  fs.readFileSync(path.resolve(__dirname, "./certs/signcerts/cert.pem"), "utf8");

	let fabricUser = await fabric_client.createUser({username: username, mspid: config.mspID, cryptoContent: {privateKeyPEM: privatePEM, signedCertPEM: signedPEM}, skipPersistence: true});
    fabric_client.setUserContext(fabricUser, true);

    logger.info("=== setupClient end ===");

    return fabric_client;
}

module.exports = setupClient;
