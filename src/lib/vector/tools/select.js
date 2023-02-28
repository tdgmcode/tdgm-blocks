let toolData = {
    doubleClickInner: ({ target }) => {
        target.selected = !target.selected;
    },

    mouseDragInner: ( {selectedItems, delta, innerGroup} ) => {
        selectedItems.forEach(item => {
            if ((item.parent != innerGroup)) return;

            item.position = item.position.add(delta)
        })

    }
}

export { toolData };