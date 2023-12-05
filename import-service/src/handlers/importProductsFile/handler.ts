/** @format */

import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { buildResponse } from "../../../utils/buildResponse";
import { importService } from "./import-service";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
	try {
		const fileName = event.queryStringParameters?.name;

		const response = await importService(fileName!);

		if (response) {
			return buildResponse(200, response);
		} else {
			return buildResponse(404, "Not found");
		}
	} catch (err: unknown) {
		return buildResponse(500, {
			err,
		});
	}
};
