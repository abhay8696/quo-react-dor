export const alertUser = e=> {
    e.preventDefault()
    alert("unload!!!")
    e.returnValue = ''
}
export const alertUserB = e=> {
    e.preventDefault()
    alert("beforeunload!!!")
    e.returnValue = ''
}