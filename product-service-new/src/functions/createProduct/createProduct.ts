/** @format */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { INewProduct } from "./type";

const client = new DynamoDBClient({});
const document = DynamoDBDocumentClient.from(client);

export const createProduct = async (data: INewProduct) => {
	const id = uuidv4();

	const newProduct = document.send(
		new TransactWriteCommand({
			TransactItems: [
				{
					Put: {
						TableName: process.env.PRODUCTS_TABLE_NAME,
						Item: {
							...data,
							id,
						},
					},
				},
				{
					Put: {
						TableName: process.env.STOCKS_TABLE_NAME,
						Item: {
							product_id: id,
							count: data.count,
						},
					},
				},
			],
		})
	);
	return newProduct;
};
