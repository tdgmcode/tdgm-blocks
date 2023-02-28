let toolData = {
    doubleClickInner: ({ target }) => {
        target.selected = !target.selected;
        target.bounds.selected = target.selected;
    },

    mouseDrag: ( {selectedItems, point, delta} ) => {
        selectedItems.forEach(item => {
            if (!item.bounds.selected) return;
            var rotAngle = point.subtract(item.bounds.center).angle - point.add(delta).subtract(item.bounds.center).angle;
            item.rotate(-rotAngle);
        });
    }
}

export { toolData };