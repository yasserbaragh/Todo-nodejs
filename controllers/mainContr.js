const todos = require("../models/todoModel")
const user = require("../models/userSchema")
const datee = require("../models/dateModel")
const doneTasks = require("../models/DoneTasks")
const bcrypt = require("bcrypt")
const validator = require("validator")

let existPass = false

const main = async (req, res) => {
    const locals = {
        title: "Tasks",
        description: "Here you will find your tasks"
    }

    const error = req.query.error
    const currUser = req.user

    const data = await todos.aggregate([
        { $match: { userId: req.userId } },
        { $lookup: { from: 'dates', localField: 'dateId', foreignField: '_id', as: 'dateId' } },
        { $unwind: { path: '$dateId' } },
        { $sort: { 'dateId.date': 1, "dateId.time": 1 } }
    ]);
    const todayDate = new Date()
    const today = todayDate.toLocaleDateString('en-US')

    const todayData = data.filter(task => {
        return task.dateId.date.toLocaleDateString('en-US') === today
    })

    data.forEach(async task => {
        if(task.dateId.date.getTime() < todayDate.getTime()) {
            const done = await doneTasks.create({
                title: task.title,
                description: task.description,
                dateId: task.dateId,
                userId: task.userId
            })
            const dele = await todos.findByIdAndDelete(task._id)
        }
    })

    const doneTask = await doneTasks.aggregate([
        { $match: { userId: req.userId } },
        { $lookup: { from: 'dates', localField: 'dateId', foreignField: '_id', as: 'dateId' } },
        { $unwind: { path: '$dateId' } },
        { $sort: { 'dateId.date': 1, "dateId.time": 1 } }
    ]);

    console.log(doneTask)

    if(!req.userId) {
        res.clearCookie("token")
        return res.redirect("/")
    }

    res.render("index", { locals, currUser, data, todayData,doneTask, error })
}

const postTasks = async (req, res) => {
    const { title, description, date, time } = req.body

    try {
        const taskDate = await datee.create({ date, time })
        const task = await todos.create({
            title,
            description,
            userId: req.userId,
            dateId: taskDate._id
        })

        res.redirect("/home")
    } catch (error) {
        console.log(error.message)
        res.redirect(`/home?error=${error.message}`)
    }
}

const getTasks = async (req, res) => {
    try {
        const error = req.query.error
        const taskId = req.params.id

        const task = await todos.findById(taskId).populate("dateId")
        console.log(task)

        const locals = {
            title: task.title,
            description: "Here you can see and edit your task"
        }

        const currUser = req.user
        res.render("task", { locals, task, currUser, error, currentRoute: `/task/${taskId}` })
    } catch (error) {
        console.log(error)
        res.status(400).json({ error })
    }
}

const postDone = async (req,res) => {
    try {
        const taskId = req.params.id

        const task = await todos.findById(taskId)
        const doneTask = await doneTasks.create({
            title: task.title,
            description: task.description,
            dateId: task.dateId,
            userId: task.userId
        })

        const deleteTask = await todos.findByIdAndDelete(taskId)
        res.redirect("/home")
    } catch (error) {
        console.log(error)
        res.redirect(`/task/${taskId}?error=${error.message}`)
    }
}

const postunDone = async (req,res) => {
    try {
        const taskId = req.params.id

        const task = await doneTasks.findById(taskId)
        const doneTask = await todos.create({
            title: task.title,
            description: task.description,
            dateId: task.dateId,
            userId: task.userId
        })

        const deleteTask = await doneTasks.findByIdAndDelete(taskId)
        res.redirect("/home")
    } catch (error) {
        console.log(error)
        res.redirect(`/task/${taskId}?error=${error.message}`)
    }
}

const postTask = async (req, res) => {
    const taskId = req.params.id
    const { title, description, date, time } = req.body

    if(title !== "") {
        try {
            const taskDate = await datee.findByIdAndUpdate(taskId.dateId, {
                date,
                time
            })
            const task = await todos.findByIdAndUpdate(taskId, {
                title,
                description
            })
    
            res.redirect(`/tasks/${taskId}`)
        } catch (error) {
            console.log(error)
            res.redirect(`/tasks/${taskId}?error=${error.message}`)
        }
    } else {
        res.redirect(`/tasks/${taskId}?error=Title required`)
    }
    
}

const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id

        const task = await todos.findByIdAndDelete(taskId)
        const doneTask = await doneTasks.findByIdAndDelete(taskId)
        res.redirect("/home")
    } catch (error) {
        console.log(error)
        res.redirect(`/task/${taskId}?error=${error.message}`)
    }
}

const getProfile = async (req, res) => {
    const locals = {
        title: req.user.username,
        description: "profile information"
    }
    const error = req.query.error

    const currUser = await user.findById(req.user._id)
    console.log(currUser)
    res.render("profile", { locals, currUser, error })
}

const puttProfile = async (req, res) => {
    const locals = {
        title: req.user.username,
        description: "profile information"
    }
    console.log(req.file)
    const { img, username, firstName, lastName, birthday, email } = req.body
    console.log(img)
    //const currUser = await user.findById(req.user._id)

    try {
        await user.findByIdAndUpdate(req.userId, {
            username,
            firstName,
            lastName,
            birthday,
            email,
            img
        })

        res.redirect("/profile")
    } catch (error) {
        console.log(error)
        res.redirect(`/profile?error=${error.message}`)
    }

}

const getPass = async (req, res) => {
    locals = {
        title: "change password",
        description: "here to change your password"
    }

    const error = req.query.error

    const currUser = await user.findById(req.user._id)

    if (currUser.password) {
        existPass = true
    }
    /*const hashedPassword = await bcrypt.hash(password, 10)
    const isStrongPassword = validator.isStrongPassword(hashedPassword)
    if (!isStrongPassword) {
        return res.status(400).json({ message: "not a strong password" })
    }*/

    res.render("changePass", { locals, existPass, currUser, error })
}

const postPass = async (req, res) => {
    try {
        const { password, old_password } = req.body

        const currUser = await user.findById(req.userId)

        if (currUser.password) {
            const authUser = await bcrypt.compare(old_password, currUser.password)
            if (!authUser) {
                return res.redirect(`/changePassword?error=wrong password`)
            }
        }

        const isStrongPassword = validator.isStrongPassword(password)
        if (!isStrongPassword) {
            return res.redirect(`/changePassword?error=not a strong password`)
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const authUser = await bcrypt.compare(password, currUser.password)
        if (authUser) {
            return res.redirect(`/changePassword?error=you can't have the same password`)
        }

        const newUser = await user.findByIdAndUpdate(req.userId, {
            password: hashedPassword
        })

        res.redirect("/profile")
    } catch (error) {
        res.redirect(`/changePassword?error=password required`)
    }
}

module.exports = {
    main,
    postTasks,
    getTasks,
    postTask,
    deleteTask,
    getProfile,
    puttProfile,
    getPass,
    postPass,
    postDone,
    postunDone
}