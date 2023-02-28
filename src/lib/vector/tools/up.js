
let toolData = {
    run: ({ selectedItems }) => { 
        selectedItems.forEach(item => {
            item.bringToFront();
        })
    }
}

export { toolData };