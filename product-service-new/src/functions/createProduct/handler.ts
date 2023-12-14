/** @format */

import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { INewProduct } from "./type";
import { HttpMethod } from "aws-cdk-lib/aws-events";
import { buildResponse } from "@libs/buildResponse";
import { createProduct } from "./createProduct";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
	const newProduct = JSON.parse(event.body) as INewProduct;

	console.log(`
  	req: ${event.httpMethod}: ${event.path}
  	product: ${newProduct}
  `);

	if (!newProduct) {
		buildResponse(404, { message: "Product not found" });
	}

	switch (event.httpMethod) {
		case HttpMethod.POST: {
			const product = await createProduct(newProduct);

			return buildResponse(200, { product: product });
		}
		default: {
			return buildResponse(405, {
				message: `Unsupported method "${event.httpMethod}"`,
			});
		}
	}
};
