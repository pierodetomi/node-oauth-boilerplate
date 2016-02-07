# node-oauth-boilerplate
A simple boilerplate to help starting an application with NodeJS and OAuth authentication flow.

## Get Started
To get started, do the following:

- Open the file /config/DbConfig.ts and properly tune the parameters for your MySql connection.
- Execute the sql script /sql/init_oauth.sql in your database to create the tables needed by oauth

You're done!

Now you can compile and run the server with the following command:

```
$ sudo node app
```

## Test it out
To test that everything works, you can use Postman, that's a nice and very useful Chrome extension for executing REST requests.