/** @format */

import { APIGatewayTokenAuthorizerEvent, Callback, Context } from "aws-lambda";
import { basicAuthorizer } from "./basicAthorizer";

export const handler = async (
	event: APIGatewayTokenAuthorizerEvent,
	context: Context,
	callback: Callback
) => {
	console.log(JSON.stringify(event), "event");
	let data;
	try {
		const authorizationToken = event.authorizationToken;

		if (authorizationToken) {
			data = await basicAuthorizer(event);
		}

		if (data.effect === "Allow") {
			callback(null, generatePolicy("user", event.methodArn, "Allow"));
		} else {
			callback(null, generatePolicy("user", event.methodArn, "Deny"));
		}
	} catch (error) {
		console.error("Error:", error);
		callback("Unauthorized");
	}
	// Construct Lambda proxy response
	const response = {
		statusCode: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
		},
		body: JSON.stringify(generatePolicy("user", event.methodArn, data.effect)),
	};

	return response;
};

const generatePolicy = (principalId, resource, effect = "Allow") => {
	return {
		principalId,
		policyDocument: {
			Version: "2012-10-17",
			Statement: [
				{
					Action: "execute-api:Invoke",
					Effect: effect,
					Resource: resource,
				},
			],
		},
	};
};
