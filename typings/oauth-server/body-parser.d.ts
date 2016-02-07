declare module "body-parser" {
	import * as express from "express";
	
	function urlencoded(options: any): express.RequestHandler;
	function json(): express.RequestHandler;
}