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

async function chaincodeTransactionHandler(body, handlerFunction) {
    let chaincodeFunction = body.chaincodeFunction;
    if (!chaincodeFunction) {
        throw new Error("'chaincodeFunction' must be specified");
    }

    let chaincodeFunctionArgs = body.chaincodeFunctionArgs || {};

    logger.info("=== Handler Function Start ===");

    logger.debug("== Calling chaincodeFunction " + chaincodeFunction + " with chaincodeFunctionArgs ", chaincodeFunctionArgs);

    const request = buildCommonRequestObject(chaincodeFunction, chaincodeFunctionArgs);
    let result = await handlerFunction(request);

    logger.info("=== Handler Function End ===");
    return result;
}

async function handler(event, context, callback) {
    const body = JSON.parse(event.body);

    let functionType = body.action;
    let handlerFunction;

    if (functionType == "invoke" || functionType == "query") {
        handlerFunction = invokeHandler;
    } else {
        throw new Error(`Unknow Function Type: ${functionType}`);
    }

    config["fabricUsername"] = body.fabricUsername;

    try {
        let result = await chaincodeTransactionHandler(body, handlerFunction);
        return okResponse(result);
    } catch (err) {
        logger.error("Error in Lambda Fabric handler: ", err);
        let returnMessage = err.message || err;
        return okResponse(returnMessage);
    }
};

function okResponse(result) {
    var response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },

        "body": JSON.parse(result)
    }

    console.log(response);
    return response
}

module.exports = { handler };
