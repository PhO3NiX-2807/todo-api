var express = require('express')
var bodyParser = require('body-parser');
var _ = require('underscore');
const { response } = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = []
var todoNextId = 1;

app.use(bodyParser.json())

app.get('/',function(req,res){
    res.send('Todo API Root')

})

app.get('/todos',function(req,res){
    res.json(todos);
})

app.get('/todos/:id',function(req,res){
    var todoId = parseInt(req.params.id,10);
    var matchedTodo = _.findWhere(todos,{id:todoId});

    if(matchedTodo){
        res.json(matchedTodo);
    }
    else{
        res.status(404).send()
    }

});

//POST
app.post('/todos',function(req,res){
    var body = req.body;

    body.id = todoNextId++;

    todos.push(body);

    console.log('Description' +' ' +  body.description);

    res.json(body);
})

app.delete('/todos/:id',function(req,res){
    var todoId = parseInt(req.params.id,10);
    var matchedTodo = _.findWhere(todos , {id:todoId});

    if(!matchedTodo){
        res.status(404).json({'Error':"no todo found"})

    }else{
        todos = _.without(todos,matchedTodo);
        res.json(matchedTodo);
    }
});

app.put('/todos/:id',function(req,res){
    var body = _.pick(req.body , 'description' , 'completed');
    var validAttributes = {};

    var todoId = parseInt(req.params.id,10);
    var matchedTodo = _.findWhere(todos,{id:todoId});

    if(!matchedTodo){
        return res.send(404).send();
    }
    if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
        validAttributes.completed = body.completed;

    }else if (body.hasOwnProperty('completed')){
        return response.status(400).send();
    }

    if(body.hasOwnProperty('description')  && _.isString(body.description)  && body.description.trim().length > 0){
        validAttributes.description = body.description;
    }else if (body.hasOwnProperty('description')){
        return response.status(400).send();
    }

    
    _.extend(matchedTodo,validAttributes);

    res.json(matchedTodo);



})

app.listen(PORT,function(){
    console.log('Express Port listening on' + PORT + '!');
})