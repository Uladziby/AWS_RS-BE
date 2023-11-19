/** @format */

import { APIGatewayProxyHandler } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { products } from "./data";

const getProductList: APIGatewayProxyHandler = async (event) => {
	return formatJSONResponse({ products });
};

export const main = middyfy(getProductList);
