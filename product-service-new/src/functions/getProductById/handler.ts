/** @format */
import { buildResponse } from "@libs/buildResponse";
import { APIGatewayProxyHandler } from "aws-lambda";
import * as AWS from "aws-sdk";

const db = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
	const id = event.pathParameters;

	const params = {
		TableName: "products_table",
		Key: {
			id: id,
		},
	};
	console.log("event.pathParameters", event.pathParameters);

	try {
		const response = await db.get(params).promise();

		if (response) {
			return buildResponse(200, response.Item);
		} else {
			return buildResponse(404, "Not found");
		}
	} catch (err: unknown) {
		return buildResponse(500, {
			err,
		});
	}
};
