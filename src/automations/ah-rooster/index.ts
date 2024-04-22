import { Logger } from "@snowcrystals/icicle";
import { CronJob } from "cron";

import { ONE_WEEK_IN_MS } from "#lib/constants.js";

import { AlbertHeijnApi } from "./AlbertHeijnApi.js";
import { GoogleCalendar } from "./GoogleCalendar.js";

const handler = async () => {
	const logger = new Logger();
	const albertHeijn = new AlbertHeijnApi();
	const calendar = new GoogleCalendar();
	await calendar.authorize();

	const dates = [new Date(), new Date(Date.now() + ONE_WEEK_IN_MS), new Date(Date.now() + ONE_WEEK_IN_MS * 2)];
	for await (const start of dates) {
		const rooster = await albertHeijn.getRooster(start);

		await calendar.insertRooster(rooster.data.scheduleByWeek, start);
	}

	logger.info("[Albert Heijn Rooster]: Rooster inserted into Google Calendar");
};

export default new CronJob("0 */4 * * *", handler, null, false, "Europe/Amsterdam");
