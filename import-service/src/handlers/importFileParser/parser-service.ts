/** @format */

import {
	CopyObjectCommand,
	DeleteObjectCommand,
	GetObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { BUCKET_NAME, REGION } from "../../../utils/constatnst";
import { Readable } from "stream";
import csv from "csv-parser";
import { SQSClient } from "@aws-sdk/client-sqs";

export const importFileParser = async (key: string) => {
	try {
		const fileName = key.split("/").at(-1);

		const params = {
			Bucket: BUCKET_NAME,
			Key: key,
			ContentType: "text/csv",
		};

		const destParams = {
			...params,
			Key: `parsed/${fileName}`,
			CopySource: `${BUCKET_NAME}/${key}`,
		};

		const getCommand = new GetObjectCommand(params);
		const copyCommand = new CopyObjectCommand(destParams);
		const deleteCommand = new DeleteObjectCommand(params);

		const s3client = new S3Client({ region: REGION });

		const sqsClient = new SQSClient({ region: REGION });

		const { Body: stream } = await s3client.send(getCommand);

		if (!stream) {
			throw new Error("Missing stream");
		}

		return new Promise<string>((resolve, reject) => {
			(stream as Readable)
				.pipe(csv())
				.on("data", (chunk: any) => {
					console.log("CSV chunk:", chunk);
				})
				.on("end", async () => {
					const message = "CSV file was parsed successfully!";
					console.log(message);

					try {
						await s3client.send(copyCommand);
						await s3client.send(deleteCommand);

						return resolve(message);
					} catch (e) {
						reject(e);
					}
				})
				.on("error", (e) => {
					console.error(e);
					reject(e);
				});
		}).then((msg) => msg);
	} catch (e) {
		throw new Error("Error while parsing file");
	}
};
