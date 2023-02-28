import pkg from 'paper';
const { paper } = pkg;

let lastPoint;

let toolData = {
    mouseDown: (settings) => {
        let { innerGroup, mainPath, fill, stroke } = settings;
        mainPath = new paper.Path();

        mainPath.strokeColor = fill.stroke;
        mainPath.fillColor = fill.color;

        mainPath.strokeWidth = stroke;
        mainPath.strokeCap = 'butt';
        mainPath.strokeJoin = 'bevel';

        innerGroup.addChild(mainPath);

        settings.mainPath = mainPath;
        return settings;

    },

    mouseDrag: ( {mainPath, point}) => {
        lastPoint = point;
            
        mainPath.add(point);
    },

    mouseUp: ( {mainPath, nodeDist }) => {
        if (mainPath.lastSegment.point.getDistance(mainPath.firstSegment.point) < nodeDist) {
            mainPath.closePath();
        }
    }
}

export { toolData };