import { Logger } from "@snowcrystals/icicle";

import AlbertHeijnRoosterJob from "./ah-rooster/index.js";

const logger = new Logger();

AlbertHeijnRoosterJob.start();
logger.info("[Automations]: Started all automations");

if (process.env.NODE_ENV === "development") {
	logger.info("[Automations]: Running in development mode");

	AlbertHeijnRoosterJob.fireOnTick();
}
