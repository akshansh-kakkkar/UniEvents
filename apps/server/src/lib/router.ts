import type { Router } from "express";

export type RouterFactory = (router: Router) => void;

export function createRouter(routers: RouterFactory[]): RouterFactory {
	return (router: Router) => {
		for (const r of routers) {
			r(router);
		}
	};
}
