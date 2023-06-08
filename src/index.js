'use strict';

const config = require("./config");
const queryObjectHandler = require("./query");
const invokeHandler = require("./invoke");
const logger = require("./logging").getLogger("lambdaFunction");

function buildCommonRequestObject(chaincodeFunction, chaincodeFunctionArgs) {
    const argsString = JSON.stringify(chaincodeFunctionArgs);
	const request = {
        chaincodeId: config.chaincodeId,
        fcn: chaincodeFunction,
        args: [argsString],
        chainId: config.channelName,
    };
    
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
    let functionType = event.functionType;
    let handlerFunction;

    if (functionType == "query") {
      handlerFunction = queryObjectHandler;
    } else if (functionType == "invoke") {
      handlerFunction = invokeHandler;
    } else {
      throw new Error(`Unknow Function Type: ${functionType}`);
    }

    config["fabricUsername"] = event.fabricUsername;

    try {
      if (functionType == "queryEvents") {
        let result = await handlerFunction(event.transactionId);
        callback(null, result);
      } else {
        let result = await chaincodeTransactionHandler(event, handlerFunction);
        callback(null, result);
      }
    } catch (err) {
      logger.error("Error in Lambda Fabric handler: ", err);
      let returnMessage = err.message || err;
      callback(returnMessage);
    }
};

module.exports = {handler};
