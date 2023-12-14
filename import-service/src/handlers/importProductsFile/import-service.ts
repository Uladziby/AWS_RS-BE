/** @format */

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const importService = async (fileName: string) => {
	const key = `uploaded/${fileName}`;

	const params = {
		Bucket: process.env.BUCKET_NAME,
		Key: key,
		ContentType: "text/csv",
	};

	const command = new PutObjectCommand(params);
	const client = new S3Client({ region: process.env.REGION });

	try {
		client.send(command).then((__) => {
			return getSignedUrl(client, command, { expiresIn: 60 })
				.then((url) => url)
				.catch((err) => err);
		});
	} catch (err: unknown) {
		return err;
	}
};
