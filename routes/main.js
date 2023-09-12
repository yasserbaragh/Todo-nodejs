const express = require("express")
const requireAuth = require("../middlwares/token")

const {
    main,
    postTasks,
    getProfile,
    puttProfile,
    getPass,
    postPass,
    getTasks,
    postTask,
    deleteTask,
    postDone,
    postunDone
} = require("../controllers/mainContr")

const router = express.Router()

router.use(requireAuth)

router.route("/home").get(main)
router.route("/tasks").post(postTasks)
router.route("/tasks/:id").get(getTasks).post(postTask)
router.route("/tasks/delete/:id").post(deleteTask)
router.route("/tasks/done/:id").post(postDone)
router.route("/tasks/undone/:id").post(postunDone)
router.route("/profile").get(getProfile).post(puttProfile)
router.route("/changePassword").get(getPass).post(postPass)




module.exports = router