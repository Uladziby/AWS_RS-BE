/** @format */

import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { createProduct } from "@functions/createProduct/createProduct";
import { buildResponse } from "@libs/buildResponse";
import { SQSEvent } from "aws-lambda";

export const handler = async (event: SQSEvent) => {
	try {
		const snsClient = new SNSClient({ region: process.env.REGION });

		for await (const record of event.Records) {
			console.log("record", record.body);

			const newProduct = JSON.parse(record.body);

			const command = new PublishCommand({
				Message: JSON.stringify(newProduct),
				TopicArn: process.env.TOPIC_ARN,
				MessageAttributes: {
					price: {
						DataType: "Number",
						StringValue: `${JSON.parse(record.body).price}`,
					},
				},
			});

			await snsClient.send(command);

			await createProduct(newProduct);

			return buildResponse(200, { message: "Product created with Notification" });
		}
	} catch (e) {
		return buildResponse(500, { message: e });
	}
};
