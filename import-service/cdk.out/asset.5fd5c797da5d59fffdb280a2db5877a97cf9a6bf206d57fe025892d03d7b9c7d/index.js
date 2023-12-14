"use strict";
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

// src/handlers/importProductsFile/handler.ts
var handler_exports = {};
__export(handler_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(handler_exports);

// utils/buildResponse.ts
var buildResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*"
  },
  body: JSON.stringify(body)
});

// src/handlers/importProductsFile/import-service.ts
var import_client_s3 = require("@aws-sdk/client-s3");
var import_s3_request_presigner = require("@aws-sdk/s3-request-presigner");
var importService = async (fileName) => {
  const key = `uploaded/${fileName}`;
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: key,
    ContentType: "text/csv"
  };
  const command = new import_client_s3.PutObjectCommand(params);
  const client = new import_client_s3.S3Client({ region: process.env.REGION });
  try {
    client.send(command).then((__) => {
      return (0, import_s3_request_presigner.getSignedUrl)(client, command, { expiresIn: 60 }).then((url) => url).catch((err) => err);
    });
  } catch (err) {
    return err;
  }
};

// src/handlers/importProductsFile/handler.ts
var handler = async (event) => {
  try {
    const fileName = event.queryStringParameters?.name;
    console.log(event, "handler importProductsFile");
    const response = await importService(fileName);
    if (response) {
      return buildResponse(200, response);
    } else {
      return buildResponse(404, "Not found");
    }
  } catch (err) {
    return buildResponse(500, {
      err
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
