import type { calendar_v3 } from "@googleapis/calendar";
import { google } from "googleapis";

import { GoogleStore } from "#database/GoogleStore.js";
import { getDateRange } from "#lib/utils.js";

import type { AlbertHeijnRooster } from "./types.js";

export class GoogleCalendar {
	public readonly store: GoogleStore;

	public constructor() {
		this.store = new GoogleStore();
	}

	public async authorize() {
		const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "http://localhost");

		const data = this.store.get();
		oauth2Client.setCredentials({
			access_token: data.accessToken,
			refresh_token: data.refreshToken,
			expiry_date: data.expireDate.getTime(),
			token_type: "Bearer"
		});

		if (data.expireDate < new Date()) {
			const tokens = await oauth2Client.refreshAccessToken();
			const parsedDate = new Date(tokens.credentials.expiry_date!);
			const date = new Date(parsedDate.getTime() - 24 * 60 * 60 * 1e3); // remove one day from expire date because of expiring refresh tokens

			oauth2Client.setCredentials({ ...tokens.credentials, expiry_date: date.getTime() });

			this.store.update({
				accessToken: tokens.credentials.access_token!,
				refreshToken: tokens.credentials.refresh_token!,
				calendarId: data.calendarId,
				expireDate: date
			});
		}
	}

	public async events(startDate?: Date) {
		const { start, end } = this.getDates(startDate);
		const calendar = google.calendar({ version: "v3" });

		const results = await calendar.events.list({
			calendarId: this.store.get().calendarId,
			oauth_token: this.store.get().accessToken,
			timeMin: start,
			timeMax: end
		});

		return results.data.items ?? [];
	}

	public async insertRooster(rooster: AlbertHeijnRooster[], startDate?: Date) {
		const events = await this.events(startDate);
		const calendar = google.calendar({ version: "v3" });

		for (const shift of rooster) {
			const googleEvent = events.find((evt) => new Date(evt.start!.dateTime!).toISOString() === new Date(shift.startTime).toISOString());
			if (!shift.paidMinutes) continue;

			const event: calendar_v3.Schema$Event = {
				summary: `${shift.store.abbreviatedDisplayName.replace(shift.store.location, "").trim()} (${shift.store.id}) - ${shift.teamNames.map((str) => str.toLowerCase()).join(", ")}`,
				description: `Paid: ${shift.paidMinutes} minutes\nBreaks: ${shift.minutes - shift.paidMinutes} minutes\nTotal: ${shift.minutes} minutes`,
				start: {
					dateTime: new Date(shift.startTime).toISOString(),
					timeZone: "Europe/Amsterdam"
				},
				end: {
					dateTime: new Date(shift.endTime).toISOString(),
					timeZone: "Europe/Amsterdam"
				}
			};

			if (googleEvent) {
				await calendar.events.update({
					eventId: googleEvent.id!,
					calendarId: this.store.get().calendarId,
					oauth_token: this.store.get().accessToken,
					requestBody: event
				});

				continue;
			}

			await calendar.events.insert({
				calendarId: this.store.get().calendarId,
				oauth_token: this.store.get().accessToken,
				requestBody: event
			});
		}
	}

	public getDates(startDate?: Date) {
		const { start, end } = getDateRange(startDate);

		return {
			start: `${start.toISOString().split("T")[0]}T00:00:00Z`,
			end: `${end.toISOString().split("T")[0]}T00:00:00Z`
		};
	}
}
