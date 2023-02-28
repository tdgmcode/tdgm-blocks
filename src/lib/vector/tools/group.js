
import pkg from 'paper';
const { paper } = pkg;

let toolData = {
    run: ({ selectedItems, innerGroup }) => { 
        var group = new paper.Group(selectedItems);
        innerGroup.addChild(group);
    }
}

export { toolData };