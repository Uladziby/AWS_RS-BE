/** @format */

import { Product } from "src/models/type";

export interface StockProduct {
	product_id: Product["id"];
	count: number;
}

export interface INewProduct {
	title: string;
	description: string;
	price: number;
	count: number;
}
