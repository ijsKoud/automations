import { join } from "node:path";

import { Store } from "./Store.js";

export class AlbertHeijnStore extends Store<AlbertHeijnStoreSchema> {
	public constructor() {
		super(undefined, join(process.cwd(), "./data/ah.json"));
	}
}

export type AlbertHeijnStoreSchema = {
	accessToken: string;
	refreshToken: string;
	expireDate: Date;
};
