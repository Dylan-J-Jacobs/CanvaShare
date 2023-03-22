let express = require('express');
let merge = require('merge-images');
let cors = require('cors');
let MongoClient = require('mongodb').MongoClient;
let connstr = "mongodb://localhost/quoteDB";
let assert = require('assert');
let app = express();
let port = 5002;

MongoClient.connect(connstr)
	.then(client => {
		app.use(cors());
		app.use(express.json());
		let db = client.db();
		console.log("db is",db);

		var image = "";

		app.get('/canvas',(req,res) => {


			res.setHeader('Content-Type','application/json');
			console.log("in");
			let sen = {img:image};
			res.send(JSON.stringify(sen));
		  
		  
		});
		  
		  // Sending the image up to the server.
		app.post('/canvas',(req,res) => {
		  
		  
			console.log("out");
			image = req.body.img;
			res.send("Got your post");
		  
		  
		});


		app.get('/:room',(req,res) => {
			let id = req.params.room;
			console.log(id);
		});


		app.listen(port, () => {
			console.log(`Listening on port ${port}`)
		});
	})


	.catch(err => {
		console.log("IN OTHER ERR");
	});