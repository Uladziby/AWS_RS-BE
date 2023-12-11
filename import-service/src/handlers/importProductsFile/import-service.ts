/** @format */

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const importService = async (fileName: string) => {
	const key = `uploaded/${fileName}`;

	const params = {
		Bucket: process.env.BUCKET_NAME,
		Key: key,
		ContentType: "image/jpg",
	};

	const client = new S3Client({ region: process.env.REGION });
	const command = new PutObjectCommand(params);
	const signedUrl = await getSignedUrl(client, command, { expiresIn: 60 });

	//const s3 = new S3({ region: process.env.REGION });

	try {
		/* 	client.send(command).then((__) => {
			return getSignedUrl(client, command).then((url) => url);
		}); */
		/* const s3Response = await s3.listObjectsV2(params);
		importedFiles = s3Response.Contents;
		return importedFiles?.map((file) => `http://${BUCKET}.s3.amazonaws.com/${file.Key}`); */
	} catch (error) {
		console.error(error, "error");
		return error;
	}
};
