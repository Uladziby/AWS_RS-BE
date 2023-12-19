/** @format */

import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { buildResponse } from "../../../utils/buildResponse";
import { importService } from "./import-service";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
	try {
		const fileName = event.queryStringParameters?.name;

		console.log(event, "handler importProductsFile");

		const signedUrl = await importService(fileName!);

		if (signedUrl) {
			return buildResponse(200, signedUrl);
		} else {
			return buildResponse(404, "Not found file");
		}
	} catch (err: unknown) {
		return buildResponse(500, {
			err,
		});
	}
};
