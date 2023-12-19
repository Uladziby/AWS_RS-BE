/** @format */

import * as cdk from "aws-cdk-lib/core";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dotenv from "dotenv";
import { Cors, RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Topic, Subscription, SubscriptionProtocol } from "aws-cdk-lib/aws-sns";
import * as path from "path";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";

dotenv.config();

const app = new cdk.App();

const stack = new cdk.Stack(app, "ProductServiceStack", {
	env: {
		region: "eu-west-1",
	},
});

//create queue

const catalogItemsQueue = new Queue(stack, "catalogItemsQueue", {
	queueName: "catalogItemsQueue",
});

//create sns topic
const importProductTopic = new Topic(stack, "ImportProductTopic");

new Subscription(stack, "ImportProductSubscription", {
	topic: importProductTopic,
	protocol: SubscriptionProtocol.EMAIL,
	endpoint: process.env.TOPIC_EMAIL,
});

const sharedLambdaProps: Partial<NodejsFunctionProps> = {
	runtime: lambda.Runtime.NODEJS_20_X,
	environment: {
		PRODUCT_AWS_REGION: process.env.PRODUCT_AWS_REGION,
		PRODUCTS_TABLE_NAME: "products_table",
		STOCKS_TABLE_NAME: "stock_table",
		IMPORT_PRODUCT_TOPIC_ARN: importProductTopic.topicArn,
	},
};

const createProduct = new NodejsFunction(stack, "createProductHandler", {
	...sharedLambdaProps,
	functionName: "createProduct",
	entry: path.join(__dirname, "src", "functions", "createProduct", "handler.ts"),
});

const getProductList = new NodejsFunction(stack, "getProductListHandler", {
	...sharedLambdaProps,
	functionName: "getProductList",
	entry: path.join(__dirname, "src", "functions", "getProductList", "handler.ts"),
});

const getProductById = new NodejsFunction(stack, "getProductById", {
	...sharedLambdaProps,
	functionName: "getProductById",
	entry: path.join(__dirname, "src", "functions", "getProductById", "handler.ts"),
});

const catalogBatchProcess = new NodejsFunction(stack, "catalogBatchProcess", {
	...sharedLambdaProps,
	functionName: "catalogBatchProcess",
	entry: path.join(__dirname, "src", "functions", "catalogBatchProcess", "handler.ts"),
});

importProductTopic.grantPublish(catalogBatchProcess);
catalogBatchProcess.addEventSource(new SqsEventSource(catalogItemsQueue, { batchSize: 5 }));

const api = new RestApi(stack, "ProductApi", {
	defaultCorsPreflightOptions: {
		allowOrigins: Cors.ALL_ORIGINS,
		allowHeaders: Cors.DEFAULT_HEADERS,
		allowMethods: Cors.ALL_METHODS,
	},
});

const products = api.root.addResource("products");
const product = products.addResource("{productId}");

//get list
const getProductListIntegration = new LambdaIntegration(getProductList);

//get item by id
const getProductByIdIntegration = new LambdaIntegration(getProductById);

//create a new product
const createProductIntegration = new LambdaIntegration(createProduct);

products.addMethod("POST", createProductIntegration);
products.addMethod("GET", getProductListIntegration);
product.addMethod("GET", getProductByIdIntegration);
