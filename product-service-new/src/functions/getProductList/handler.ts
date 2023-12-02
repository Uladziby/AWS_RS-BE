/** @format */

import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { buildResponse } from "@libs/buildResponse";

const client = new DynamoDBClient({ region: "eu-west-1" });
const document = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async () => {
	const scanProducts = new ScanCommand({
		TableName: process.env.PRODUCTS_TABLE_NAME,
	});

	const scanStocks = new ScanCommand({
		TableName: process.env.STOCKS_TABLE_NAME,
	});

	const productItems = (await document.send(scanProducts)).Items;
	const stockItems = (await document.send(scanStocks)).Items;

	if (!productItems || !stockItems) {
		return buildResponse(404, "Error: There is no products or stocks");
	}

	let joinedArray = productItems.map((product) => {
		let counted = stockItems.find((element) => element.product_id === product.id);
		return { ...product, ...counted };
	});

	console.log(joinedArray);

	return {
		statusCode: 200,
		headers: {
			"Access-Control-Allow-Credentials": true,
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "*",
			"Access-Control-Allow-Methods": "*",
		},
		body: JSON.stringify(joinedArray),
	};
};
