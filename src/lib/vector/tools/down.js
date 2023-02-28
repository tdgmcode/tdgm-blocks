
let toolData = {
    run: ({ selectedItems }) => { 
        selectedItems.reverse().forEach(item => {
            item.sendToBack();
        })
    }
}

export { toolData };