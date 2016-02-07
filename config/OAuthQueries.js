var OAuthQueries = (function () {
    function OAuthQueries() {
    }
    OAuthQueries.getClient = "SELECT client_id, client_secret FROM app_client WHERE client_id = ?";
    OAuthQueries.getUserByUsername = "SELECT id, email, username, password, birth_date, creation_date, last_login_date FROM user WHERE username = ?";
    OAuthQueries.addAccessToken = "INSERT INTO app_token SET ?";
    OAuthQueries.getAccessToken = "SELECT access_token, user_id, client_id, expires, created FROM app_token WHERE access_token = ?";
    return OAuthQueries;
})();
module.exports = OAuthQueries;
