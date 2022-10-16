var express = require('express');
var mongoose = require('mongoose')
var app = express();

app.use('/static', express.static("public"));
app.use(express.urlencoded({extended: true}))
app.set("view engine","ejs");
const Todo = require('./models/todo.model');
const mongoDB = "mongodb+srv://findley_joshua1:cyjQ2HdqfrCVst0m@cluster0.s3catnk.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(mongoDB)
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error' , console.error.bind(console, "MongoDb connection error: "))


app.get('/', function(req,res){
    res.render('todo.ejs');
 })

 app.post('/', (req, res) =>  {
    let newTodo = new Todo({
        todo: req.body.content,
        done: false
    })
    newTodo.save(function(err, todo){
        if(err){
            res.json({"Error:" : err})
        } else {
            res.json({"Status: ": "Successful", "ObjectID": todo.id})
        }
    })
 })

app.listen(3000,function(){
    console.log('App listening on port 3000');
})