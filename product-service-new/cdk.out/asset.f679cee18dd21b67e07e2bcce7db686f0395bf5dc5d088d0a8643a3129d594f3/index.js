var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/functions/getProductList/handler.ts
var handler_exports = {};
__export(handler_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(handler_exports);
var import_lib_dynamodb = require("@aws-sdk/lib-dynamodb");
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");

// src/libs/buildResponse.ts
var buildResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*"
  },
  body: JSON.stringify(body)
});

// src/functions/getProductList/handler.ts
var client = new import_client_dynamodb.DynamoDBClient({ region: "eu-west-1" });
var document = import_lib_dynamodb.DynamoDBDocumentClient.from(client);
var handler = async () => {
  const scanProducts = new import_lib_dynamodb.ScanCommand({
    TableName: process.env.PRODUCTS_TABLE_NAME
  });
  const scanStocks = new import_lib_dynamodb.ScanCommand({
    TableName: process.env.STOCKS_TABLE_NAME
  });
  const productItems = (await document.send(scanProducts)).Items;
  const stockItems = (await document.send(scanStocks)).Items;
  if (!productItems || !stockItems) {
    return buildResponse(404, "Error: There is no products or stocks");
  }
  let joinedArray = productItems.map((product) => {
    let counted = stockItems.find((element) => element.product_id === product.id);
    return { ...product, ...counted };
  });
  console.log(joinedArray);
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*"
    },
    body: JSON.stringify(joinedArray)
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
