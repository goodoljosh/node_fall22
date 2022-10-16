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
    Todo.find(function(err, todo){
        console.log(todo)
        if(err){
            res.json({"Error:" : err})
        } else {
            res.render("todo.ejs", {todoList: todo});
        }
    })
 })
//Creates item in DB
 app.post('/', (req, res) =>  {
    let newTodo = new Todo({
        todo: req.body.content,
        done: false
    })
    newTodo.save(function(err, todo){
        if(err){
            res.json({"Error:" : err})
        } else {
            res.redirect('/');
        }
    })
 })
//Modifies Item in DB
 app.put('/', (req, res) => {
    let id = req.body.id;
    let err = {}
    console.log(req.body)
    if(typeof id === "string"){
       Todo.updateOne({_id: id}, {done: true}, function(error){
           if(error){
            console.log(error)
            err = error
           }
       })
    } else if(typeof id === "object"){
       id.forEach(ID => {
        Todo.updateOne({_id: id}, {done: true}, function(error){
            if(error){
             err = error
             console.log(error)
            }
        })
       })
    }
    if(err){
       res.json({"Error:" : err})
    } else {
        res.redirect('/');

    }
 })

 app.delete('/', (req, res) => {
    let id = req.body.check;
    let err = {}
    if(typeof id === "string"){
       Todo.deleteOne({_id: id}, function(error){
           if(error){
            err = error
           }
       })
    } else if(typeof id === "object"){
       id.forEach(ID => {
        Todo.deleteOne({_id: ID}, function(error){
            if(error){
             err = error
            }
        })
       })
    }
    if(err){
       res.json({"Error:" : err})
    } else {
        res.redirect('/');

    }
 })

app.listen(3000,function(){
    console.log('App listening on port 3000');
})


//3 tasks
//users should be able to mark off all tasks at once and delete them too