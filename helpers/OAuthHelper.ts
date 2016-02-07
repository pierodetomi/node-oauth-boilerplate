// Import external dependencies
import * as mysql from "mysql";
import * as passwordHash from "password-hash";

// Import constants files
import OAuthQueries = require("../config/OAuthQueries");

// Import config classes
import DbConfig = require("../config/DbConfig");

// Import models
import User = require("../db_models/User");
import AppToken = require("../db_models/AppToken");

class OAuthHelper {
	public static getOAuthConfigModel = (): any => {
		// Define model as required by oauth authentication (see https://www.npmjs.com/package/node-oauth2-server)
		return {
			getClient: OAuthHelper.getClient,
			grantTypeAllowed: OAuthHelper.grantTypeAllowed,
			getUser: OAuthHelper.getUser,
			saveAccessToken: OAuthHelper.saveAccessToken,
			getAccessToken: OAuthHelper.getAccessToken
		};
	};
	
	private static getClient = (clientId: string, clientSecret: string, callback: (error: boolean, client: any) => void): void => {
		var connection: mysql.IConnection = OAuthHelper.connect();

		var query: mysql.IQuery = connection.query(OAuthQueries.getClient, [clientId], function(err: mysql.IError, rows, fields): void {
			if (err) {
				console.log("ERR: Could not connect to MySql database");
				callback(true, null);
				return;
			}
			
			if(rows.length == 0) {
				console.log("ERR: No client with id '" + clientId + "'");
				callback(true, null);
				return;
			}
			
			callback(false, {
				clientId: rows[0]["client_id"],
				redirectUri: null
			});
		});
	};

	private static grantTypeAllowed = (clientId: string, grantType: string, callback: (error: boolean, allowed: boolean) => void): void => {
		// TODO: check if this clientId is allowed to use the specified grantType
		callback(false, true);
	};

	private static getUser = (username: string, password: string, callback: (error: boolean, user: User) => void): void => {
		var connection: mysql.IConnection = OAuthHelper.connect();
		
		connection.query(OAuthQueries.getUserByUsername, [username], function(err: mysql.IError, rows): void {
			if(err) {
				console.log("ERR: Could not connect to MySql database");
				callback(true, null);
				return;
			}
			
			if(rows.length == 0) {
				console.log("ERR: No users found with username '" + username + "'");
				callback(true, null);
				return;
			}
			
			var row = rows[0];
			
			if(!passwordHash.verify(password, row["password"])) {
				console.log("ERR: Wrong password provided for user '" + username + "'");
				callback(true, null);
				return;
			}
			
			var user: User = {
				id: row["id"],
				email: row["email"],
				username: row["username"],
				password: null,
				creation_date: row["creation_date"],
				last_login_date: row["last_login_date"],
			};
			
			callback(false, user);
		});
	};

	private static saveAccessToken = (accessToken: string, clientId: string, expires: Date, user: User, callback: (error: boolean) => void): void => {
		var connection: mysql.IConnection = OAuthHelper.connect();
		
		var appToken: AppToken = {
			user_id: user.id,
			client_id: clientId,
			access_token: accessToken,
			expires: expires,
			created: new Date()
		};
		
		var query: mysql.IQuery = connection.query(OAuthQueries.addAccessToken, appToken, function(err: mysql.IError, rows): void {
			if(err) {
				console.log(err);
				callback(true);
				return;
			}
			
			callback(false);
		});
	};

	private static getAccessToken = (bearerToken: string, callback: (error: boolean, accessToken: any) => void): void => {
		var connection: mysql.IConnection = OAuthHelper.connect();
		
		var query: mysql.IQuery = connection.query(OAuthQueries.getAccessToken, [bearerToken], function(err: mysql.IError, rows): void {
			if(err) {
				console.log(err);
				callback(true, null);
				return;
			}
			
			if(rows.length == 0) {
				console.log("ERR: The access token provided is invalid (" + bearerToken + ")");
				callback(true, null);
				return;
			}
			
			callback(false, {
				expires: rows[0]["expires"],
				userId: rows[0]["user_id"]
			});
		});
	};
	
	private static connect = (): mysql.IConnection => {
		var connection: mysql.IConnection = mysql.createConnection({
			host: DbConfig.host,
			user: DbConfig.user,
			password: DbConfig.password,
			database: DbConfig.database
		});
		
		connection.connect();
		
		return connection;
	}
}

export = OAuthHelper;