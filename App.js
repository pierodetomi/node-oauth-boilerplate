// External dependencies
var express = require("express");
var bodyParser = require("body-parser");
var oauthserver = require("oauth2-server");
// Helpers
var OAuthHelper = require("./helpers/OAuthHelper");
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var oauth = oauthserver({
    model: OAuthHelper.getOAuthConfigModel(),
    grants: ['password'],
    debug: true
});
app.all("/oauth/token", oauth.grant());
app.get("/", oauth.authorise(), function (req, res) {
    res.json(req.user);
});
app.use(oauth.errorHandler());
// app.get("/:user", function(req: express.Request, res: express.Response): any {
// 	var connection: mysql.IConnection = mysql.createConnection({
// 		host     : 'localhost',
// 		user     : 'root',
// 		password : '',
// 		database : 'TestDb'
// 	});
// 	
// 	connection.connect(function(err: mysql.IError) {
// 		if (err) {
// 			console.error('error connecting: ' + err.stack);
// 			return;
// 		}
// 		
// 		console.log('connected as id ' + connection.threadId);
// 	});
// 	
// 	var query: mysql.IQuery = connection.query(Queries.getAllPeople, function(err: mysql.IError, rows, fields): void {
// 		if(err) {
// 			console.error('error connecting: ' + err.stack);
// 			return;
// 		}
// 		
// 		var people: Array<Person> = [];
// 		
// 		for(var i in rows){
// 			var row = rows[i];
// 			var person: Person = new Person();
// 			
// 			for(var prop in row) {
// 				person[prop] = row[prop];
// 			}
// 			
// 			people.push(person);
// 		}
// 		
// 		res.json(people);
// 	});
// 	
// 	connection.end();
// });
var server = app.listen(500);
