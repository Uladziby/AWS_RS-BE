/** @format */

import { APIGatewayProxyHandler } from "aws-lambda";
import { middyfy } from "@libs/lambda";

const createProduct: APIGatewayProxyHandler = async (event) => {
	//object which will be added in the DynamoDB
	const product = JSON.parse(event.body);

	if (!product) {
		return {
			statusCode: 404,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Credentials": true,
			},
			body: JSON.stringify({ message: "Product not found" }),
		};
	}
	return {
		statusCode: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Credentials": true,
		},
		body: JSON.stringify(product),
	};
};

export const main = middyfy(createProduct);
