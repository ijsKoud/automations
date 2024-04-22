import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { Store } from "./Store.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export class AlbertHeijnStore extends Store<AlbertHeijnStoreSchema> {
	public constructor() {
		super(undefined, join(__dirname, "..", "..", "./data/ah.json"));
	}
}

export type AlbertHeijnStoreSchema = {
	accessToken: string;
	refreshToken: string;
	expireDate: Date;
};
