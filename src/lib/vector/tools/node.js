let toolData = {
    doubleClickInner: (event) => {
        var nearestPoint = event.target.getNearestPoint(event.point);

        if (nearestPoint.getDistance(event.point) > event.nodeDist) return;

        event.target.segments.forEach(segment => {
            segment.selected = false;
        });

        let closestPoint = event.target.segments[0];
        let closestDist = 10000;

        event.target.segments.forEach(segment => {
            let dist = segment.point.getDistance(nearestPoint);
            if (dist < closestDist) {
                closestDist = dist;
                closestPoint = segment.point;
            }
        });

        let newPoint;

        if (nearestPoint.getDistance(closestPoint) > event.grabDist) {
            newPoint = event.target.divideAt(event.target.getLocationOf(nearestPoint));
        } else {
            newPoint = closestPoint;
        }

        newPoint.selected = true;
    },

    mouseDrag : ( {selectedItems, delta} ) => {
        selectedItems.forEach(item => {
            if (item.className == 'Path') {
                item.segments.forEach(segment => {
                    if (segment.selected)
                        segment.point = segment.point.add(delta)
                })
            }
        })
    }
}

export { toolData };