var express = require('express');
var mongoose = require('mongoose')
var app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());


app.use('/static', express.static("public")); 
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
 app.post('/create', (req, res) =>  {
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
 app.put('/done', (req, res) => {
    let id = req.body.id;
    let err = null
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
              console.log(error)
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

 app.delete('/delete/:id', (req, res) => {
    let id = req.params.id;
    let err;
    //console.log(id)
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