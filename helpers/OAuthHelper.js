// Import external dependencies
var mysql = require("mysql");
var passwordHash = require("password-hash");
// Import constants files
var OAuthQueries = require("../config/OAuthQueries");
// Import config classes
var DbConfig = require("../config/DbConfig");
var OAuthHelper = (function () {
    function OAuthHelper() {
    }
    OAuthHelper.getOAuthConfigModel = function () {
        // Define model as required by oauth authentication (see https://www.npmjs.com/package/node-oauth2-server)
        return {
            getClient: OAuthHelper.getClient,
            grantTypeAllowed: OAuthHelper.grantTypeAllowed,
            getUser: OAuthHelper.getUser,
            saveAccessToken: OAuthHelper.saveAccessToken,
            getAccessToken: OAuthHelper.getAccessToken
        };
    };
    OAuthHelper.getClient = function (clientId, clientSecret, callback) {
        var connection = OAuthHelper.connect();
        var query = connection.query(OAuthQueries.getClient, [clientId], function (err, rows, fields) {
            if (err) {
                console.log("ERR: Could not connect to MySql database");
                callback(true, null);
                return;
            }
            if (rows.length == 0) {
                console.log("ERR: No client with name '" + clientId + "'");
                callback(true, null);
                return;
            }
            callback(false, {
                clientId: rows[0]["client_id"],
                clientSecret: rows[0]["client_id"],
                redirectUri: null
            });
        });
    };
    OAuthHelper.grantTypeAllowed = function (clientId, grantType, callback) {
        // TODO: check if this clientId is allowed to use the specified grantType
        callback(false, true);
    };
    OAuthHelper.getUser = function (username, password, callback) {
        var connection = OAuthHelper.connect();
        connection.query(OAuthQueries.getUserByUsername, [username], function (err, rows) {
            if (err) {
                console.log("ERR: Could not connect to MySql database");
                callback(true, null);
                return;
            }
            if (rows.length == 0) {
                console.log("ERR: No users found with username '" + username + "'");
                callback(true, null);
                return;
            }
            var row = rows[0];
            if (!passwordHash.verify(password, row["password"])) {
                console.log("ERR: Wrong password provided for user '" + username + "'");
                callback(true, null);
                return;
            }
            var user = {
                id: row["id"],
                email: row["email"],
                username: row["username"],
                password: null,
                birth_date: row["birth_date"],
                creation_date: row["creation_date"],
                last_login_date: row["last_login_date"]
            };
            callback(false, user);
        });
    };
    OAuthHelper.saveAccessToken = function (accessToken, clientId, expires, user, callback) {
        var connection = OAuthHelper.connect();
        var appToken = {
            user_id: user.id,
            client_id: clientId,
            access_token: accessToken,
            expires: expires,
            created: new Date()
        };
        var query = connection.query(OAuthQueries.addAccessToken, appToken, function (err, rows) {
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false);
        });
    };
    OAuthHelper.getAccessToken = function (bearerToken, callback) {
        var connection = OAuthHelper.connect();
        var query = connection.query(OAuthQueries.getAccessToken, [bearerToken], function (err, rows) {
            if (err) {
                console.log(err);
                callback(true, null);
                return;
            }
            if (rows.length == 0) {
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
    OAuthHelper.connect = function () {
        var connection = mysql.createConnection({
            host: DbConfig.host,
            user: DbConfig.user,
            password: DbConfig.password,
            database: DbConfig.database
        });
        connection.connect();
        return connection;
    };
    return OAuthHelper;
})();
module.exports = OAuthHelper;
