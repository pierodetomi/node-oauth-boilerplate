// External dependencies
import * as express from "express";
import * as bodyParser from "body-parser";
import * as oauthserver from "oauth2-server";
import * as http from "http";
import * as mysql from "mysql";

import * as passwordHash from "password-hash";

// Helpers
import OAuthHelper = require("./helpers/OAuthHelper");

var app: express.Express = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var oauth: oauthserver.oauth = oauthserver({
  model: OAuthHelper.getOAuthConfigModel(),
  grants: ['password'],
  debug: true
});

app.all("/oauth/token", oauth.grant());

app.get("/", oauth.authorise(), function (req, res) {
	res.json(req.user);
});
 
app.use(oauth.errorHandler());

var server: http.Server = app.listen(500);