/** @format */

import { handlerPath } from "@libs/handler-resolver";

export const handlerConfig = {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			http: {
				method: "get",
				path: "getShopInfo",
				cors: true,
			},
		},
	],
};
