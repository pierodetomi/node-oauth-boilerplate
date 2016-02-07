class OAuthQueries {
	public static getClient: string = "SELECT client_id, client_secret FROM app_client WHERE client_id = ?";
	public static getUserByUsername: string = "SELECT id, email, username, password, creation_date, last_login_date FROM user WHERE username = ?";
	public static addAccessToken: string = "INSERT INTO app_token SET ?";
	public static getAccessToken: string = "SELECT access_token, user_id, client_id, expires, created FROM app_token WHERE access_token = ?";
}

export = OAuthQueries;