import { Logger } from "@snowcrystals/icicle";

// import { google } from "googleapis";
import AlbertHeijnRoosterJob from "./ah-rooster/index.js";

const logger = new Logger();

AlbertHeijnRoosterJob.start();
logger.info("[Automations]: Started all automations");

if (process.env.NODE_ENV === "development") {
	logger.info("[Automations]: Running in development mode");

	AlbertHeijnRoosterJob.fireOnTick();
}

// const oauth2 = new google.auth.OAuth2({
// 	clientId: process.env.GOOGLE_CLIENT_ID,
// 	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// 	redirectUri: "http://localhost"
// });
// const url = oauth2.generateAuthUrl({ access_type: "offline", scope: ["https://www.googleapis.com/auth/calendar"] });
// console.log(url);

// void oauth2.getToken("code_here").then((res) => console.log(res));
