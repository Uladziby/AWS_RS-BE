/** @format */

import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib/core";
import * as path from "path";
import * as dotenv from "dotenv";
import * as lambda from "aws-cdk-lib/aws-lambda";
import {
	RestApi,
	Cors,
	LambdaIntegration,
	TokenAuthorizer,
	ResponseType,
} from "aws-cdk-lib/aws-apigateway";
import { Bucket } from "aws-cdk-lib/aws-s3";

dotenv.config();

const app = new cdk.App();

const stack = new cdk.Stack(app, "AuthService", {
	env: {
		region: process.env.PRODUCT_AWS_REGION,
	},
});

const bucket = Bucket.fromBucketName(stack, "AuthBucket", "auth-service-task7");

const sharedLambdaProps: Partial<NodejsFunctionProps> = {
	runtime: lambda.Runtime.NODEJS_20_X,
	environment: {
		BUCKET_NAME: "auth-service-task7",
	},
};

const api = new RestApi(stack, "AuthApi", {
	defaultCorsPreflightOptions: {
		allowHeaders: ["*"],
		allowOrigins: Cors.ALL_ORIGINS,
		allowMethods: Cors.ALL_METHODS,
	},
});

const basicAuthorizer = new NodejsFunction(stack, "basicAuthorizer", {
	...sharedLambdaProps,
	entry: path.join("src", "handlers", "basicAuthorizer", "handler.ts"),
	environment: {
		uladziby: process.env.uladziby!,
	},
});

const auth = new TokenAuthorizer(stack, "basicTokenAuthorizer", {
	handler: basicAuthorizer,
});

bucket.grantReadWrite(basicAuthorizer);

const token = api.root.addResource("token");

api.addGatewayResponse("GatewayDeniedResponse", {
	type: ResponseType.ACCESS_DENIED,
	statusCode: "403",
	responseHeaders: { "Access-Control-Allow-Origin": "'*'" },
});

api.addGatewayResponse("GatewayUnauthorizedResponse", {
	type: ResponseType.UNAUTHORIZED,
	statusCode: "401",
	responseHeaders: { "Access-Control-Allow-Origin": "'*'" },
});

const importProductsFileIntegration = new LambdaIntegration(basicAuthorizer);
token.addMethod("GET", importProductsFileIntegration, { authorizer: auth });
