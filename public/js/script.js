
const profiles = document.querySelectorAll("header .profile img")

profiles.forEach(profile => {
    profile.addEventListener("click", () => {
        const hidden = profile.parentElement.children[1]

        hidden.classList.toggle("active")
    })
    
})


const hidButton = document.querySelector(".separator .tasks .dash .hid")

hidButton.addEventListener("click", () => { 
    const separator = hidButton.parentNode.parentNode.parentNode
    const addTask = separator.children[1].children[1]

    addTask.classList.add("active")
})

const closeButton = document.querySelector(".separator .addTasks .close")

closeButton.addEventListener("click", () => {
    const addTask = closeButton.parentNode

    addTask.classList.remove("active")
})




