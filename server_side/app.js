let express = require('express');
const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');
let cors = require('cors');
let MongoClient = require('mongodb').MongoClient;
let connstr = "mongodb://localhost/canvasDB";
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
			//image = req.body.img;
			
			if (image != "") {
				const image2 = new Image();
				image2.src=image;

				const image3 = new Image();
				image3.src=req.body.img;
				mergeImages([image2.src, image3.src], {
					Canvas: Canvas,
					Image: Image
				})
					.then(b64 => image=b64);
				//console.log(image);
				
				res.send("Got your post");
			} else {
				image = req.body.img;
			}
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
		console.log("IN OTHER ERR", err);
	});