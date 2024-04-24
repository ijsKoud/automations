import { join } from "node:path";

import { Store } from "./Store.js";

export class GoogleStore extends Store<GoogleStoreSchema> {
	public constructor() {
		super(undefined, join(process.cwd(), "./data/google.json"));
	}
}

export type GoogleStoreSchema = {
	calendarId: string;
	refreshToken: string;
	accessToken: string;
	expireDate: Date;
};
