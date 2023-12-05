/** @format */

import { APIGatewayProxyResult, S3Event } from "aws-lambda";

import { buildResponse } from "../../../utils/buildResponse";
import { importFileParser } from "./parser-service";

export const handler = async (event: S3Event): Promise<APIGatewayProxyResult> => {
	console.log(`importFileParserLambda: ${JSON.stringify(event)}`);

	try {
		const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
		const message = await importFileParser(key);

		return buildResponse(200, { message });
	} catch (e) {
		return buildResponse(504, { message: e });
	}
};
