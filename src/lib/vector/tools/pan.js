let toolData = {
    mouseDrag: ( { viewGroup, delta } ) => {
        viewGroup.position = viewGroup.position.add(delta);
    }
}

export { toolData };