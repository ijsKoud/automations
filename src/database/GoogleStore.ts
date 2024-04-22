import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { Store } from "./Store.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export class GoogleStore extends Store<GoogleStoreSchema> {
	public constructor() {
		super(undefined, join(__dirname, "..", "..", "./data/google.json"));
	}
}

export type GoogleStoreSchema = {
	calendarId: string;
	refreshToken: string;
	accessToken: string;
	expireDate: Date;
};
