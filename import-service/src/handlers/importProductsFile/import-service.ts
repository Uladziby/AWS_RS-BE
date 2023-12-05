/** @format */

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const importService = async (fileName: string) => {
	let importedFiles;
	const BUCKET = process.env.BUCKET_NAME;

	const params = {
		Bucket: process.env.BUCKET_NAME,
		Key: `uploaded/${fileName}`,
		Expires: new Date(Date.now() + 60 * 1000), // Set expiration time 60 seconds from now
		ContentType: "text/csv",
	};

	//const s3 = new S3({ region: process.env.REGION });

	const command = new PutObjectCommand(params);

	const client = new S3Client({ region: process.env.REGION });

	try {
		client.send(command).then(() => {
			return getSignedUrl(client, command).then((url) => url);
		});

		/* const s3Response = await s3.listObjectsV2(params);
		importedFiles = s3Response.Contents;
		return importedFiles?.map((file) => `http://${BUCKET}.s3.amazonaws.com/${file.Key}`); */
	} catch (error) {
		console.error(error);
		return error;
	}
};
