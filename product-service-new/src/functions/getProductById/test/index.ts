/** @format */

const { products } = require("./data");
const { getProductsById } = require("./getProductsById");

/* describe("getProductsById", () => {
    it("should return correct response", async () => {

        const event = {pathParameters: {productId: 1}}
        const product = products.find(pr => pr.id === 1)
        const response = await getProductsById(event);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeTruthy();
        expect(JSON.parse(response.body)).toEqual(product);
    }); */
