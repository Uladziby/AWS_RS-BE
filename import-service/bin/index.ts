/** @format */

import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib/core";
import * as path from "path";
import * as dotenv from "dotenv";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { RestApi, Cors, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Bucket } from "aws-cdk-lib/aws-s3";

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

const importProductsFileIntegration = new LambdaIntegration(importProductsFile);
const importFile = api.root.addResource("import");

const fileName = "products.csv";
//const importFileProxy = importFile.addResource(`uploaded/${fileName}`);

importFile.addMethod("GET", importProductsFileIntegration);

bucket.grantReadWrite(importProductsFile);
