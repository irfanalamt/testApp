const express = require('express');
const app = express();
const PORT = process.env.PORT|| 5000;
var path = require("path");

const logger = (req,res,next)=>{
    console.log(`${req.protocol}||${req.process}`);
    next();
};
app.use(logger);

app.use(express.static(path.join(__dirname,'public')));


app.listen(PORT,()=>console.log(`Server started on port ${PORT}`));
