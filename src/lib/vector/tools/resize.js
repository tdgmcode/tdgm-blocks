let toolData = {
    doubleClickInner: ({ target }) => {
        target.selected = !target.selected;
        target.bounds.selected = target.selected;
    },

    mouseDrag: ( {selectedItems, point, delta, nodeDist} ) => {
        selectedItems.forEach(item => {
            var nearestPoint = point;

            if (!item.bounds.selected) return;


            let seg = [
                item.bounds.topLeft,
                item.bounds.topRight,
                item.bounds.bottomLeft,
                item.bounds.bottomRight,
                item.bounds.topCenter,
                item.bounds.bottomCenter,
                item.bounds.leftCenter,
                item.bounds.rightCenter
            ];

            let segOpp = [
                item.bounds.bottomRight,
                item.bounds.bottomLeft,
                item.bounds.topRight,
                item.bounds.topLeft,
                item.bounds.bottomCenter,
                item.bounds.topCenter,
                item.bounds.rightCenter,
                item.bounds.leftCenter
            ]

            let closestPoint = seg[0];
            let closestDist = 10000;
            let i = -1;

            seg.forEach((segment,index) => {
                let dist = segment.getDistance(nearestPoint);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestPoint = segOpp[index]; 
                    i = index;
                }
            });

            if (closestDist < nodeDist) {
                var signX = (i == 1 || i == 3 || i == 7) ? 1 : -1;
                var signY = (i == 1 || i == 0 || i == 4) ? -1 : 1;
                if (i > 5) {
                    item.scale(1 + signX *  delta.x / item.bounds.width, 1, closestPoint);
                } else if (i > 3) {
                    item.scale(1, 1 + signY * delta.y / item.bounds.height, closestPoint);
                } else {
                    item.scale(1 + signX * delta.x / item.bounds.width, 1 + signY * delta.y / item.bounds.height, closestPoint);
                }
            }
        })
    }
}

export { toolData };