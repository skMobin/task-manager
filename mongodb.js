const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID
const connectionURL = 'mongodb://127.0.0.1:27017'
const dataBaseName = 'task-manager'

MongoClient.connect(connectionURL, { useUnifiedTopology: true },(error,client)=>{
    if(error){
        return console.log("Unable to connect to MongoDB Sever!!!")
    }
    console.log("Hola! Connected Correctly.")
    const db = client.db(dataBaseName)
    // db.collection('task').insertOne({
    //     description : "Homework",
    //     completed : true
    // },(error,result)=>{
    //     if(error){
    //         return console.log("The document is not inserted!!")
    //     }
    //     console.log(result.ops)
    // })
    // db.collection('task').insertMany([
    //     {
    //         description : 'Homework',
    //         completed : false
    //     },{
    //         description : 'Feeding cats',
    //         completed : true
    //     },{
    //         description : "Project task for today",
    //         completed : true
    //     }
    // ],(error,result)=>{
    //     if(error){
    //         return console.log("Unable to insert the document.")
    //     }
    //     console.log(result.insertedCount)
    //     console.log(result.ops)
    // })
    // db.collection('task').findOne({ _id: ObjectID("5ebf17d4deec3826bc63da97") },(error,task)=>{
    //     console.log(task)
    // })
    // db.collection('task').find({completed:false}).toArray((error,task)=>{
    //     console.log(task)
    // })
    // db.collection('task').find({ completed: false }).count((error, count) => {
    //     console.log(count)
    // })

    // db.collection('task').updateMany({completed : false},{
    //     $set: {
    //         completed : true
    //     }
    // }).then(()=>{
    //     console.log('Document Updated!')
    // }).catch(()=>{
    //     console.log("Grrrr...something went wrong.")
    // })

    db.collection('task').deleteOne({
        description : "Homework"
    }).then((result)=>{
        console.log(result.deletedCount)
    }).catch((error)=>{
        console.log(error)
    })
})