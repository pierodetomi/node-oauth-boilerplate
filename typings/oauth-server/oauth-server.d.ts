declare module "oauth2-server" {
	import * as express from "express";
	
	function oauthserver(): oauth;
	
	interface oauth {
		grant: () => express.RequestHandler;
		authorise: () => express.RequestHandler;
		errorHandler: () => express.RequestHandler;
	}
	
	export = oauthserver;
}