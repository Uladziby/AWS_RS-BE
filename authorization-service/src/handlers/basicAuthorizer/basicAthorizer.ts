/** @format */

import { APIGatewayTokenAuthorizerEvent } from "aws-lambda/trigger/api-gateway-authorizer";

export const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent): Promise<any> => {
	const authorizationToken = event.authorizationToken;
	const encodedCreds = authorizationToken.split(" ")[1];
	const buff = Buffer.from(encodedCreds, "base64");
	const plainCreds = buff.toString("utf-8").split(":");
	const username = plainCreds[0];
	const password = plainCreds[1];

	const storedUserPassword = process.env[username];
	console.log(username, password, "data");

	const effect = !storedUserPassword || storedUserPassword !== password ? "Deny" : "Allow";

	const methodArn = event.methodArn;

	return {
		encodedCreds,
		methodArn,
		effect,
	};
};
