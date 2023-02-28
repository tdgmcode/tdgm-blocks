
let toolData = {
    run: ({ selectedItems }) => { 
        selectedItems.forEach(item => {
            item.remove();
        })
    }
}

export { toolData };