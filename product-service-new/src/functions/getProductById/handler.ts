/** @format */

import { APIGatewayProxyHandler } from "aws-lambda";
import { middyfy } from "@libs/lambda";
import { products } from "src/models/data";

const getProductById: APIGatewayProxyHandler = async (event) => {
	const { id } = event.pathParameters;
	const product = products.find((p) => p.id === id);

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

export const main = middyfy(getProductById);
