const express = require('express');
const cors = require('cors');
const app = express();

app.options('*',cors());


app.get('/',blah);

function blah(req,res) {
   console.log("trying to get /");
   res.setHeader('Access-Control-Allow-Origin','*');
   res.json({msg: 'blah'});
   //res.send("Hello World 2");
}

app.get('/blah',(req,res) => {
   console.log("trying to get /blah");
   res.setHeader('Access-Control-Allow-Origin','*');
   res.json({msg:'blah too'});
   //res.send("testing");
});





console.log(process.argv);
let PORT=5002;
if (process.argv.length<3) {
   console.log("Proper usage is to supply the port on the commandline:");
   console.log(process.argv[1],"<port>");
} else {
   PORT=process.argv[2];
}
app.listen(PORT, function() {
   console.log('listening on',PORT);
});
