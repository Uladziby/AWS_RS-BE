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

// src/functions/getProductById/handler.ts
var handler_exports = {};
__export(handler_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(handler_exports);

// src/models/data.ts
var products = [
  {
    description: "A beautiful and elegant flower with vibrant colors.",
    id: "7567ec4b-b10c-45c5-9345-fc73c48a80a6",
    price: 14,
    title: "Rose"
  },
  {
    description: "A lovely flower with a captivating fragrance.",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
    price: 15,
    title: "Lily"
  },
  {
    description: "A vibrant and colorful flower that brightens any space.",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
    price: 23,
    title: "Sunflower"
  },
  {
    description: "A delicate and enchanting flower perfect for special occasions.",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa0",
    price: 24,
    title: "Orchid"
  },
  {
    description: "A fragrant and exotic flower that adds a touch of mystery.",
    id: "7567ec4b-b10c-48c5-9345-fc73348a80a4",
    price: 15,
    title: "Jasmine"
  },
  {
    description: "An exotic flower with a unique and captivating appearance.",
    id: "7567ec4b-b10c-48c5-9445-fc73c48a80a5",
    price: 23,
    title: "Tulip"
  }
];

// src/functions/getProductById/handler.ts
var handler = async (event) => {
  const { id } = event.pathParameters;
  const product = products.find((p) => p.id === id);
  console.log("event.pathParameters", event.pathParameters);
  if (!product) {
    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({ message: "Product not found" })
    };
  }
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    },
    body: JSON.stringify(product)
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
