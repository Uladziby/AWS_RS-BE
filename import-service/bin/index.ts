/** @format */

import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib/core";
import * as path from "path";
import * as dotenv from "dotenv";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { RestApi, Cors, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Bucket, EventType } from "aws-cdk-lib/aws-s3";
import * as s3notifications from "aws-cdk-lib/aws-s3-notifications";

dotenv.config();

const app = new cdk.App();

const stack = new cdk.Stack(app, "ImportServiceStack", {
	env: {
		region: process.env.PRODUCT_AWS_REGION,
	},
});

const bucket = Bucket.fromBucketName(stack, "ImportBucket", "import-service-task5");

const sharedLambdaProps: Partial<NodejsFunctionProps> = {
	runtime: lambda.Runtime.NODEJS_20_X,
	environment: {
		BUCKET_NAME: "import-service-task5",
	},
};

const api = new RestApi(stack, "ImportFilesApi", {
	defaultCorsPreflightOptions: {
		allowHeaders: ["*"],
		allowOrigins: Cors.ALL_ORIGINS,
		allowMethods: Cors.ALL_METHODS,
	},
});

const importProductsFile = new NodejsFunction(stack, "importProductsFile", {
	...sharedLambdaProps,
	functionName: "importProductsFile",
	entry: path.join("src", "handlers", "importProductsFile", "handler.ts"),
});

bucket.grantReadWrite(importProductsFile);

const importFileParser = new NodejsFunction(stack, "importFileParser", {
	...sharedLambdaProps,
	functionName: "importFileParser",
	entry: path.join("src", "handlers", "importProductsFile", "handler.ts"),
});

const importFile = api.root.addResource("import");
const importProductsFileIntegration = new LambdaIntegration(importProductsFile);
importFile.addMethod("GET", importProductsFileIntegration);

bucket.grantReadWrite(importProductsFile);
bucket.grantDelete(importFileParser);
//const importFileProxy = importFile.addResource(`uploaded/${fileName}`);

bucket.addEventNotification(
	EventType.OBJECT_CREATED,
	new s3notifications.LambdaDestination(importFileParser)
);
