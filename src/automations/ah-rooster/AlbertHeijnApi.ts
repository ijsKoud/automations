import axios from "axios";

import { AlbertHeijnStore } from "#database/AlbertHeijnStore.js";
import { getDateRange } from "#lib/utils.js";

import { MicrosoftAuthentication } from "./MicrosoftAuthenticator.js";
import type { AlbertHeijnRoosterResponse } from "./types.js";

export class AlbertHeijnApi {
	public readonly authenticator: MicrosoftAuthentication;
	public store: AlbertHeijnStore;

	public constructor() {
		this.authenticator = new MicrosoftAuthentication();
		this.store = new AlbertHeijnStore();
	}

	public async getAccessToken() {
		const store = this.store.get();
		if (store.expireDate > new Date()) return store.accessToken;

		const newToken = await this.authenticator.getNewToken(store.refreshToken);
		if (!newToken) return null;

		store.accessToken = newToken.access_token;
		store.refreshToken = newToken.refresh_token;
		store.expireDate = new Date(Date.now() + newToken.expires_in * 1e3);

		this.store.update(store);
		return store.accessToken;
	}

	public async getRooster(startDate?: Date) {
		const accessToken = await this.getAccessToken();
		if (!accessToken) throw new Error("Failed to get access token");

		const { start, end } = this.getDates(startDate);
		const response = await axios<AlbertHeijnRoosterResponse>({
			url: ALBERTHEIJN_GRAPHQL_URL,
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`
			},
			data: {
				operationName: "scheduleByWeek",
				variables: {
					startDate: start,
					endDate: end
				},
				query: `
					query scheduleByWeek($startDate: String!, $endDate: String!) {
						scheduleByWeek(startDate: $startDate, endDate: $endDate) {
							startTime
							endTime
							minutes
							storeId
							leaveMinutes
							store {
								abbreviatedDisplayName
								location
								id
								__typename
							}
							paidMinutes
							sickMinutes
							teamNames
							__typename
						}
					}
				`
			}
		});

		return response.data;
	}

	public getDates(startDate?: Date) {
		const { start, end } = getDateRange(startDate);

		return {
			start: `${start.toISOString().split("T")[0]}T00:00:00Z`,
			end: `${end.toISOString().split("T")[0]}T00:00:00Z`
		};
	}
}

const ALBERTHEIJN_GRAPHQL_URL = "https://api-gateway.ah.nl/external/ah/rtp/dex/graphql";
