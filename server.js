const express = require('express'); 
const app = express(); 
const postsRouter = require('./blog-post-router');
const bodyParser = require('body-parser'); 
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

app.use('/', jsonParser, postsRouter);

let server;

function runServer(port, databaseUrl) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl,
			err => {
				if (err) {
					return reject(err);
				} else {
					server = app.listen(port, () => {
						console.log("App is Running in port", port);
						resolve();
					})
						.on('error', err => {
							mongoose.disconnect();
							return reject(err);
						});
				}
			}
		);
	});
}

function closeServer() {
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing server');
				server.close(err => {
					if (err) {
						return reject(err);
					} else {
						resolve();
					}
				});
			});
		});
}

runServer(8080, 'mongodb://localhost/marcela-blog-post')
	.catch(err => console.log(err));

module.exports = { app, runServer, closeServer };
