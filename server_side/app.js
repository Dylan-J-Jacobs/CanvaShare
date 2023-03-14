let express = require('express');
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

		var image = new Image();

		// Returning the image up on the server.
		app.get('/canvas',async (req,res) => {


			res.setHeader('Content-Type','application/json');
			console.log("in get");
			let sen = {img:image};
			res.send(JSON.stringify(sen));
			/*let cursor=db.collection('quotes').find();
			let data=await cursor.toArray();
			console.log("array==",data);
			if (data.length==0) {
				let quote={name:"Darth Vader",quote:"I find your lack of faith disturbing."};
				res.send(JSON.stringify(quote));
			} else {
			  	let quote=data[Math.floor(Math.random()*data.length)];
				res.send(JSON.stringify(quote));
			}*/

		});

		// Sending the image up to the server.
		app.post('/canvas',(req,res) => {


			console.log("req",req.body);
			//let sen2 = JSON.parse(res.body);
			image = req.body.img;
			res.send("Got your post");
			/*db.collection('quotes').insertOne(req.body).then(
				res.sendStatus(200)
			).catch((err) => {
				console.log("IN ERR");
				res.sendStatus(400);
			});
			console.log("in put");
			*/

		});


		app.listen(port, () => {
			console.log(`Listening on port ${port}`)
		});
	})


	.catch(err => {
		console.log("IN OTHER ERR");
	});