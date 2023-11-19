/** @format */

import { APIGatewayProxyHandler } from "aws-lambda";
import { middyfy } from "@libs/lambda";
import { products } from "src/models/data";

const getProductList: APIGatewayProxyHandler = async () => {
	return {
		statusCode: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Credentials": true,
		},
		body: JSON.stringify(products),
	};
};

export const main = middyfy(getProductList);
