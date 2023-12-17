/** @format */

import { APIGatewayTokenAuthorizerEvent } from "aws-lambda";
import { basicAuthorizer } from "./basicAthorizer";

export const handler = async (event: APIGatewayTokenAuthorizerEvent) => {
	console.log(JSON.stringify(event), "event");
	const authorizationToken = event.authorizationToken;
	console.log(authorizationToken, "authorizationToken");
	try {
		if (!authorizationToken) {
			throw Error("Unauthorized : incorrect token");
		}

		const data = await basicAuthorizer(event);
		console.log(data, "data");

		if (data.effect === "Allow") {
			return generatePolicy("user", event.methodArn, "Allow");
		} else {
			return generatePolicy("user", event.methodArn, "Deny");
		}
	} catch (err) {
		console.log(err, "unknwown error");
		return err.message;
	}
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
