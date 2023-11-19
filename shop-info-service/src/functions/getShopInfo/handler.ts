/** @format */

import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyHandler } from "aws-lambda";

const getShopInfo: APIGatewayProxyHandler = async (event) => {
	return formatJSONResponse({
		body: { shopAdminName: "John Doe", shopName: "John's Shop" },
		event,
	});
};

export const main = middyfy(getShopInfo);
