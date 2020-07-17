const express = require('express')
const Task = require('../models/task');
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks',auth, async (req, res) => {
    //const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id

    })
    try {
        await task.save();
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})
//GET /task?completed=true|false
//GET /task?limit=1&skip=2
router.get("/tasks",auth, async (req, res) => {
    match={}
    sort = {}
    if(req.query.completed){
        match.completed = req.query.completed ==='true' 
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]]= parts[1] === 'desc'? -1:1
    }
    try {
        // const tasks = await Task.find({});
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }
});

router.get("/tasks/:id", async (req, res) => {
    const _id = req.params.id;
    if (_id.match(/^[0-9a-fA-F]{24}$/)) {
        try {
            const task = await Task.findById(_id);
            if (!task) {
                return res.status(404).send("Not Found");
            }
            res.send(task)
        } catch (error) {
            res.status(500).send(error);
        }
    } else {
        return res.status(404).send("Not Found");
    }
});

router.patch("/tasks/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedudates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowedudates.includes(update))
    if (!isValidOperation) {
        res.status(400).send({ error: "invalid" });
    }
    try {
        const task = await Task.findById(req.params.id)

        updates.forEach((update)=>task[update]= req.body[update])
        await task.save()
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!task) {
            return res.status(404).send("Not Found");
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
});

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            return res.status(400).send("Not Found");
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }

})

module.exports = router