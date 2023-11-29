/** @format */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { stocks } from "src/models/data";
import { products } from "src/models/data";

const dbClient = new DynamoDBClient({});
const dbDocumnetClient = DynamoDBDocumentClient.from(dbClient);

export const fillDb = async () => {
	const putProducts = products.map(({ id, title, description, price }) => ({
		PutRequest: {
			Item: {
				id: id,
				title: title,
				description: description,
				price: price,
			},
		},
	}));

	const putStock = stocks.map(({ product_id, count }) => ({
		PutRequest: {
			Item: {
				product_id: product_id,
				count: count,
			},
		},
	}));

	const writeProductsCommand = new BatchWriteCommand({
		RequestItems: {
			["products_table"]: putProducts,
		},
	});

	const writeStocksCommand = new BatchWriteCommand({
		RequestItems: {
			["stock_table"]: putStock,
		},
	});

	await dbDocumnetClient
		.send(writeProductsCommand)
		.then((_val) => console.log(`\x1b[32m The products_table table seeding is successful! \x1b[0m`))
		.catch((e) => console.error("Error in seeding products table: ", e.message));
	await dbDocumnetClient
		.send(writeStocksCommand)
		.then((_val) => console.log(`\x1b[32m The stock_table table seeding is successful! \x1b[0m`))
		.catch((e) => console.error("Error in seeding stock_table table: ", e));
};

fillDb();

/* 
const scan = async () => {
	const command = new ScanCommand({
		TableName: process.env.TABLE_NAME,
	});
	const scanResults = await dbClient.send(command);
	return scanResults;
};

const query = async (id) => {
	try {
		const command = new QueryCommand({
			TableName: process.env.TABLE_NAME,
			KeyConditionExpression: "id = :id",
			ExpressionAttributeValues: { ":id": { S: id } }, // Assuming 'id' is a string; adjust accordingly
		});
		const queryResults = await dbClient.send(command);
		return queryResults;
	} catch (error) {
		console.error("Error in query:", error);
		throw error; // Re-throw the error to be caught by the calling function
	}
};

export const handler = async (event) => {
	const scanResults = await scan();

	const queryResults = await query("7567ec4b-b10c-45c5-9345-fc73c48a80a6");

	console.log("scanResults", scanResults);
	console.log("queryResults", queryResults);

	return { scanResults, queryResults };
}; */
