// CONFIGS =============================
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const _ = require('lodash')
const app = express()

app.set('view engine','pug')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
mongoose.connect("mongodb+srv://m001-student:m001-mongodb-basics@sandbox.znb2f.mongodb.net/todolist",{useNewUrlParser: true, useUnifiedTopology: true}).then(console.log("Connected successfully to DB")).catch("Oops! No connection to DB!")
// =====================================

// GLOBAL VARS +++++++++++++++++++++++++
const itemsSchema = {
  name: String
}
const Item = mongoose.model("Item", itemsSchema)

const items = [
  {name: "Welcome to the TODO List App"}, {name: "Click the + button to add a new item"}, {name: "<=== Click this checkbox to mark it as completed"}
]

const listSchema = {
  name: String,
  list: [itemsSchema]
}
const List = mongoose.model('List', listSchema)


// Item.countDocuments((err, count)=>{
//   console.log(count)
// })

// Item.countDocuments((err, count)=>{
//   if(err) console.log(err)
//   if(count === 0){
//     Item.insertMany(items,err=>{
//     console.log(err)
//   })
//   }
// })

// +++++++++++++++++++++++++++++++++++++

// APP GET ROOT <<<<<<<<<<<<<<<<<<<<<<<<
app.get('/', (req, res)=>{
  Item.find({},(err,list)=>{
    err ? res.render(err) :
    res.render('index', {listTitle: "Today", toDoList: list})
    }
  )
})
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// APP GET PATH <<<<<<<<<<<<<<<<<<<<<<<<
app.get('/:path', (req, res)=>{
  const path = _.capitalize(req.params.path)

  List.findOne({name: path},(err, foundList)=>{
    if(err){console.log(err)}else{
      if(!foundList){
        List.create({
          name: path,
          list: items
        })
        res.render('index',{listTitle: path, toDoList: items})
      }else{
        res.render('index',{listTitle: path, toDoList: foundList.list})
      }
    }
  })
})
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// APP POST >>>>>>>>>>>>>>>>>>>>>>>>>>>>
app.post('/',(req, res)=>{
  console.log(req)
  const itemName = req.body.todo
  const listName = _.capitalize(req.body.listName)
  if(listName === "Today"){
    item.save()
    res.redirect('back')
  }else{
    List.findOneAndUpdate(
      {name: listName},
      {$push:{list:{name: itemName}}},
      (err, foundList) => {res.redirect('back')}
    )
  }
})
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// APP POST PATH >>>>>>>>>>>>>>>>>>>>>>>
//

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// APP POST DELETE >>>>>>>>>>>>>>>>>>>>>
app.post("/delete", (req,res)=>{
  console.log(req)
  const itemId = req.body.checkbox
  console.log('itemId is: ' + itemId)
  const listName = req.body.listName
  console.log('listName is: ' + listName)


  if(listName === "Today"){
    Item.findByIdAndRemove(itemId, err => {
      err ? console.log(err) : false
      res.redirect('back')
    })
  }else{
    List.findOneAndUpdate({"name":listName},{$pull:{list:{_id: itemId}}},(err, foundList)=>{
      if(!err){
        console.log(foundList)
        res.redirect('back')
      }
    })
  }
})
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// APP LISTEN ??????????????????????????
app.listen(process.env.PORT || 3000, ()=>{
  console.log('Server UP!')
})
// ?????????????????????????????????????