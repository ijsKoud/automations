import axios from "axios";

export class MicrosoftAuthentication {
	public static ROUTES = {
		base: "https://login.microsoftonline.com/a6b169f1-592b-4329-8f33-8db8903003c7",
		authorize: "/oauth2/v2.0/authorize",
		token: "/oauth2/v2.0/token"
	};

	/**
	 * Gets the token data from the microsoft oauth2 flow
	 * @param code The oauth2 flow code
	 * @returns The token response
	 */
	public async getAuthorization(code: string) {
		try {
			const response = await axios<MicrosoftTokenResponse>({
				baseURL: MicrosoftAuthentication.ROUTES.base,
				url: MicrosoftAuthentication.ROUTES.authorize,
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				data: {
					client_id: "4d469dcc-1140-449f-856e-7d2618ec9c36",
					scope: "openid profile offline_access https://dex.ahold.com/.default",
					grant_type: "authorization_code",
					redirect_uri: "http://localhost",
					code
				}
			});

			return response.data;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	/**
	 * Gets a new token from the refresh token
	 * @param refreshToken The refresh token from the oauth2 flow
	 * @returns The token response
	 */
	public async getNewToken(refreshToken: string) {
		try {
			const response = await axios<MicrosoftTokenResponse>({
				baseURL: MicrosoftAuthentication.ROUTES.base,
				url: MicrosoftAuthentication.ROUTES.token,
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				data: {
					client_id: "4d469dcc-1140-449f-856e-7d2618ec9c36",
					scope: "openid profile offline_access https://dex.ahold.com/.default",
					grant_type: "refresh_token",
					refresh_token: refreshToken
				}
			});

			return response.data;
		} catch (err) {
			console.error(err);
			return null;
		}
	}
}

export interface MicrosoftTokenResponse {
	token_type: string;
	scope: string;
	expires_in: number;
	ext_expires_in: number;
	access_token: string;
	refresh_token: string;
	id_token: string;
}
