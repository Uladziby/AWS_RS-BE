/** @format */

import * as cdk from "aws-cdk-lib/core";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dotenv from "dotenv";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import { resolve } from "path";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";

dotenv.config();

const app = new cdk.App();

const stack = new cdk.Stack(app, "ProductServiceStack", {
	env: {
		region: "eu-west-1",
	},
});

const sharedLambdaProps: Partial<NodejsFunctionProps> = {
	runtime: lambda.Runtime.NODEJS_20_X,
	environment: {
		PRODUCT_AWS_REGION: process.env.PRODUCT_AWS_REGION,
		PRODUCTS_TABLE_NAME: "products_table",
		STOCKS_TABLE_NAME: "stock_table",
	},
};

const createProduct = new NodejsFunction(stack, "CreateProduct", {
	...sharedLambdaProps,
	functionName: "createProduct",
	entry: resolve("src/functions/createProduct/handler.ts"),
});

const getProductList = new NodejsFunction(stack, "getProductList", {
	...sharedLambdaProps,
	functionName: "getProductList",
	entry: path.join(__dirname, "src", "functions", "getProductList", "handler.ts"),
});

const getProductById = new NodejsFunction(stack, "getProductById", {
	...sharedLambdaProps,
	functionName: "getProductById",
	entry: resolve("src/functions/getProductById/handler.ts"),
});

const api = new apiGateway.RestApi(stack, "ProductApi", {
	defaultCorsPreflightOptions: {
		allowOrigins: ["*"],
		allowHeaders: apiGateway.Cors.DEFAULT_HEADERS,
		allowMethods: apiGateway.Cors.ALL_METHODS,
	},
});

const products = api.root.addResource("products");
const product = products.addResource("{productId}");

//get list
const getProductListIntegration = new apiGateway.LambdaIntegration(getProductList);

//get item by id
const getProductByIdIntegration = new apiGateway.LambdaIntegration(getProductById);

//create a new product
const createProductIntegration = new apiGateway.LambdaIntegration(createProduct);

products.addMethod("POST", createProductIntegration);
products.addMethod("GET", getProductListIntegration);
product.addMethod("GET", getProductByIdIntegration);
