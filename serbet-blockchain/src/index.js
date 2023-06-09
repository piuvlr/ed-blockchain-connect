'use strict';

const config = require("./config");
const invokeHandler = require("./invoke");
const logger = require("./logging").getLogger("lambdaFunction");

function buildCommonRequestObject(chaincodeFunction, chaincodeFunctionArgs) {

    if (chaincodeFunction == "invoke") {
        const objectJson = JSON.stringify(chaincodeFunctionArgs[0]);
        chaincodeFunctionArgs[0] = objectJson;
    }

    const request = {
        chaincodeId: config.chaincodeId,
        fcn: chaincodeFunction,
        args: chaincodeFunctionArgs,
        chainId: config.channelName,
    };

    logger.info("==request==");
    logger.info(request);

    return request;
};

async function chaincodeTransactionHandler(event, handlerFunction) {
    let chaincodeFunction = event.chaincodeFunction;
    if (!chaincodeFunction) {
        throw new Error("'chaincodeFunction' must be specified");
    }

    let chaincodeFunctionArgs = event.chaincodeFunctionArgs || {};

    logger.info("=== Handler Function Start ===");

    logger.debug("== Calling chaincodeFunction " + chaincodeFunction + " with chaincodeFunctionArgs ", chaincodeFunctionArgs);

    const request = buildCommonRequestObject(chaincodeFunction, chaincodeFunctionArgs);
    let result = await handlerFunction(request);

    logger.info("=== Handler Function End ===");
    return result;
}

async function handler(event, context, callback) {
    let functionType = event.action;
    let handlerFunction;

    if (functionType == "invoke" || functionType == "query") {
        handlerFunction = invokeHandler;
    } else {
        throw new Error(`Unknow Function Type: ${functionType}`);
    }

    config["fabricUsername"] = event.fabricUsername;

    try {
        let result = await chaincodeTransactionHandler(event, handlerFunction);
        callback(null, result);
    } catch (err) {
        logger.error("Error in Lambda Fabric handler: ", err);
        let returnMessage = err.message || err;
        callback(returnMessage);
    }
};

module.exports = { handler };
