/** @format */

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";

const getInfoAdmin: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
	return formatJSONResponse({
		body: { shopAdminName: "John Doe" },
		event,
	});
};

export const main = middyfy(getInfoAdmin);
