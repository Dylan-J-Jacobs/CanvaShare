const express = require('express');
const cors = require('cors');
const app = express();

app.options('*',cors());



app.get('/canvas', (req,res) => {
   
   //return canvas or img to be set on the client side

});
app.post('/canvas',(req,res) => {
   
   //set canvas to current incoming img

});





console.log(process.argv);
let PORT=5002;
if (process.argv.length<3) {
   console.log("Proper usage is to supply the port on the commandline:");
   console.log(process.argv[1],"<port>");
} else {
   PORT=process.argv[2];
}
app.listen(process.argv[2], function() {
   console.log('listening on',PORT);
});
