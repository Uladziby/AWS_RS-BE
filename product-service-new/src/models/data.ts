/** @format */

import { Product, Stock } from "./type";

export const products: Product[] = [
	{
		description: "A beautiful and elegant flower with vibrant colors.",
		id: "7567ec4b-b10c-45c5-9345-fc73c48a80a6",
		price: 14,
		title: "Rose",
	},
	{
		description: "A lovely flower with a captivating fragrance.",
		id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
		price: 15,
		title: "Lily",
	},
	{
		description: "A vibrant and colorful flower that brightens any space.",
		id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
		price: 23,
		title: "Sunflower",
	},
	{
		description: "A delicate and enchanting flower perfect for special occasions.",
		id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa0",
		price: 24,
		title: "Orchid",
	},
	{
		description: "A fragrant and exotic flower that adds a touch of mystery.",
		id: "7567ec4b-b10c-48c5-9345-fc73348a80a4",
		price: 15,
		title: "Jasmine",
	},
	{
		description: "An exotic flower with a unique and captivating appearance.",
		id: "7567ec4b-b10c-48c5-9445-fc73c48a80a5",
		price: 23,
		title: "Tulip",
	},
];

export const stocks: Stock[] = [
	{
		product_id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa0",
		count: 5,
	},
	{
		product_id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
		count: 6,
	},
	{
		product_id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
		count: 7,
	},
	{
		product_id: "7567ec4b-b10c-48c5-9345-fc73348a80a4",
		count: 8,
	},
	{
		product_id: "7567ec4b-b10c-48c5-9445-fc73c48a80a5",
		count: 9,
	},
];
