
let toolData = {
    run: ({ selectedItems, innerGroup }) => { 
        selectedItems.forEach(item => {
            if (!item.children || item.className != 'Group' || item == innerGroup) return;
            item.selected = false;
            item.children.forEach(child => {
                innerGroup.addChild(child);
            })
        })
    }
}

export { toolData };