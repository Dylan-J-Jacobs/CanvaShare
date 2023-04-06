let express = require('express');
const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');
let cors = require('cors');
let MongoClient = require('mongodb').MongoClient;
let connstr = "mongodb://localhost/canvasDB";
//mongodb://localhost/canvasDB
//mongodb://mongo_main/jacobsdjcanvasDB
let assert = require('assert');

let app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});
let port = 3000;
// const { Server } = require("socket.io");
// const io = new Server(app.listen(port, () => {
// 	console.log(`Listening on port ${port}`)
// }));


MongoClient.connect(connstr)
	.then(client => {
		app.use(cors());
		app.use(express.json());

		app.use(express.static('client_side'));

		let db = client.db();
		// console.log("db is", db);

		var image = "";



		// app.get('/canvas/:id', async (req,res) => {

		// 	let id = req.params.id; // console.log(req.params.id);
		// 	res.setHeader('Content-Type','application/json');
		// 	console.log("in");
		// 	let sen = {img:image};
		// 	res.send(JSON.stringify(sen));


		// });

		//   // Sending the image up to the server.
		// app.post('/canvas/:id', async (req,res) => {

		// 	let id = req.params.id; // console.log(req.params.id);
		// 	console.log("out");
		// 	//image = req.body.img;

		// 	if (image != "") {
		// 		const image2 = new Image();
		// 		image2.src=image;

		// 		const image3 = new Image();
		// 		image3.src=req.body.img;
		// 		mergeImages([image2.src, image3.src], {
		// 			Canvas: Canvas,
		// 			Image: Image
		// 		})
		// 			.then(b64 => image=b64);
		// 		//console.log(image);

		// 		res.send("Got your post");
		// 	} else {
		// 		image = req.body.img;
		// 	}
		// });

		// Getting the starting canvas.
		app.get('/room/:id', async (req, res) => {

			// console.log("inside start function");
			// let can = { room:"BART", canvas:""}
			// let result2 = await db.collection('canvasRooms').insertOne(can);
			// if (result2.insertedId) {
			// 	console.log("good");
			// } else {
			// 	console.log("bad");
			// }

			let roomParam = req.params.id;

			var vars = roomParam.split("=");
			var id = vars[1];

			console.log("Room request for: " + id);
			let roomNo = id;

			let canvasToUse = db.collection('canvasRooms');
			let filter = { room: { $regex: roomNo } };

			let result = canvasToUse.find(filter);
			let data3 = await result.toArray();

			currCanv = "blah";
			console.log("bbh", data3);

			res.send("hahha");

		});

		app.post('/room/:id', async (req, res) => {
			let roomParam = req.params.id;
			var vars = roomParam.split("=");
			var id = vars[1];
			// console.log("inside start function");
			// let newEntry = { room:id, canvas:""}
			// let result2 = await db.collection('canvasRooms').insertOne(newEntry);
			// if (result2.insertedId) {
			// 	console.log("good");
			// } else {
			// 	console.log("bad");
			// }

		});




		//IO connections

		io.on("connection", async (socket) => {

			console.log('New Connection: ' + socket.id);

			socket.on("canvas", sendEveryone);
			// socket.on("getRoomCanv", dbFetch);

			function sendEveryone(data) {
				io.emit('canvas', data);
				console.log("blah"/*data*/);
			}

			// function dbFetch(data) {
			// 	console.log("Room request for: " + data);
			// 	let roomNo = data;

			// 	let canvasToUse = db.collection('canvasRooms');
			// 	let filter = { room: roomNo };

			// 	let result = canvasToUse.find(filter);

			// 	let data2 = result.toArray();

			// 	currCanv = "blah";
			// 	console.log(data2);
			// 	socket.emit("getRoomCanv", result.room);
			// }
		})


		http.listen(port, '0.0.0.0', () => {
			console.log(`Listening on port ${port}`)
		});
	})


	.catch(err => {
		console.log("IN OTHER ERR", err);
	});