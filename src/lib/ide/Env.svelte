<style>
    .ide {
        width: 100vw;
        height: calc(100vh - 50px);
        display: grid;
        grid-template-columns: 300px 1fr 300px;
    }

    .ide-left, .ide-mid, .ide-right {
        height: 100%;
    }

    .ide-left  {
        border-right: var(--border-1);
    }

    .ide-right  {
        border-left: var(--border-1);
    }

    .ide-mid {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: none;
    }

    canvas {
        width: 100%;
        height: 100%;
    }
</style>

<script>
    

    import { paper } from "paper";
    import { onMount } from 'svelte';

    import EditButton from '$lib/page/EditButton.svelte';
    import Color from './Color.svelte';
    import { Group } from "paper/dist/paper-core";
    import { group_outros } from "svelte/internal";

    let tools = [
        'edit',
        'pan',
        'select',
        'group',
        'ungroup',
        'resize',
        'rotate',
        'deleter',
        'node',
        'up',
        'down',
        'import',
        'export',
    ]

    let mode = 'edit';
    let colorType = 'stroke';

    let fillColor = '#446699ff';
    let strokeColor = '#000000ff';

    let darkStroke = '#d8d8d8';
    let white = 'white';

    let nodeDist = 25;
    let grabDist = 15;
    
    let color = strokeColor;
    let stroke = 12;
  
    let origin = new paper.Point([0,0]);
    
    let viewGroup, innerGroup, canvas, mainPath, lastPoint, file, files, download;

    let importFile = () => {
        file.click();
    }

    let getBase64 = (filee) => {
        const reader = new FileReader();
        reader.readAsDataURL(filee);
        reader.onload = e => {
            let preview = e.target.result;
            paper.project.importSVG(preview, function (item) {
                innerGroup.addChild(item);
                recurseChild(innerGroup);
            });
        };
    }

    let exportFile = () => {
        var data = new Blob(['<svg>' + innerGroup.exportSVG({asString: true}) + '</svg>'], {type: 'image/svg'});

        var url = window.URL.createObjectURL(data);

        download.href = url;
        download.click();
    }

    let setMode = (modeSet) => {
        if (modeSet)
            mode = modeSet;

        if (mode == 'group') {
            group();
        } else if (mode == 'ungroup') {
            ungroup();
        } else if (mode == 'import') {
            importFile();
        } else if (mode == 'export') {
            exportFile();
        } else if (mode == 'deleter') {
            deleter();
        } else if (mode == 'up') {
            layerUp();
        } else if (mode == 'down') {
            layerDown();
        }

        return mode;
    }

    let setColorMode = (modeSet) => {
        if (modeSet)
            colorType = modeSet;

        color = (modeSet == 'stroke') ? strokeColor : fillColor;

        return colorType;
    }

    let setColor = ([colorIn, strokeIn]) => {
        color = colorIn;
        stroke = strokeIn / 5;

        if (colorType == 'stroke') {
            strokeColor = color
        } else {
            fillColor = color;
        }

        if (!paper.project || !paper.project.selectedItems) return;

        paper.project.selectedItems.forEach(item => {
            if (colorType == 'stroke') {
                item.strokeColor = color
            } else {
                item.fillColor = color;
            }
        })
    }

    let initPath = () => {
        mainPath = new paper.Path();

        mainPath.strokeColor = strokeColor;
        mainPath.fillColor = fillColor;
        mainPath.strokeWidth = stroke;
        mainPath.strokeCap = 'butt';
        mainPath.strokeJoin = 'bevel';

        innerGroup.addChild(mainPath);

        recurseChild(innerGroup);

    }

    let mouseDown = (event) => {
        if (mode == 'edit') {
            initPath();
        }
    }

    let layerDown = () => {
        paper.project.selectedItems.reverse().forEach(item => {
            item.sendToBack();
        })
    };

    let layerUp = () => {
        paper.project.selectedItems.forEach(item => {
            item.bringToFront();
        })
    };

    let group = () => {
        var group = new paper.Group(paper.project.selectedItems);
        innerGroup.addChild(group);
    };

    let ungroup = () => {
        paper.project.selectedItems.forEach(item => {
            if (!item.children || item.className != 'Group' || item == innerGroup) return;
            item.selected = false;
            item.children.forEach(child => {
                innerGroup.addChild(child);
            })
        })
    }

    let deleter = () => {
        paper.project.selectedItems.forEach(item => {
            item.remove();
        })
    }

    let mouseDownInner = (event) => {
        event.stopPropagation();

        console.log(event.target);

        var target = event.target;

        while (target.parent != innerGroup) {
            target = target.parent;
        }

        console.log(target);

        if (mode == 'select') {
            target.selected = !target.selected;
        } else if (mode == 'node') {
            var nearestPoint = target.getNearestPoint(event.point);

            if (nearestPoint.getDistance(event.point) > nodeDist) return;

            target.segments.forEach(segment => {
                segment.selected = false;
            });

            let closestPoint = target.segments[0];
            let closestDist = 10000;

            target.segments.forEach(segment => {
                let dist = segment.point.getDistance(nearestPoint);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestPoint = segment.point;
                }
            });

            let newPoint;

            if (nearestPoint.getDistance(closestPoint) > grabDist) {
                newPoint = target.divideAt(target.getLocationOf(nearestPoint));
            } else {
                newPoint = closestPoint;
            }

            newPoint.selected = true;
        } else if (mode == 'resize' || mode == 'rotate') {
            target.selected = !target.selected;
            target.bounds.selected = target.selected;
        }
    }

    let mouseDrag = (event) => {
        if (mode == 'pan') {
            viewGroup.position = viewGroup.position.add(event.delta);
        } else if (mode == 'edit') {
            lastPoint = event.point;
            
            mainPath.add(event.point);
        } else if (mode == 'select' || mode == 'node') {
            paper.project.selectedItems.forEach(item => {
                if ((mode == 'select' && item.parent != innerGroup)) return;

                if (mode == 'node') {
                    if (item.className == 'Path') {
                        item.segments.forEach(segment => {
                            if (segment.selected)
                                segment.point = segment.point.add(event.delta)
                        })
                    }
                } else {
                    item.position = item.position.add(event.delta)
                }

                
            });
        } else if (mode == 'resize') {
            paper.project.selectedItems.forEach(item => {
                var nearestPoint = event.point;

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
                        item.scale(1 + signX *  event.delta.x / item.bounds.width, 1, closestPoint);
                    } else if (i > 3) {
                        item.scale(1, 1 + signY * event.delta.y / item.bounds.height, closestPoint);
                    } else {
                        item.scale(1 + signX * event.delta.x / item.bounds.width, 1 + signY * event.delta.y / item.bounds.height, closestPoint);
                    }
                }  
            });
        } else if (mode == 'rotate') {
            paper.project.selectedItems.forEach(item => {
                if (!item.bounds.selected) return;
                var rotAngle = event.point.subtract(item.bounds.center).angle - event.point.add(event.delta).subtract(item.bounds.center).angle;
                item.rotate(-rotAngle);
            });
        }
    }

    let mouseUp = (event) => {
        if (mode == 'edit') {
            if (mainPath.lastSegment.point.getDistance(mainPath.firstSegment.point) < nodeDist) {
                mainPath.closePath();
            }
        }
    }

    let mouseDragInner = (event) => {

    }

    let recurseChild = (parent) => {
        if (!parent.children || parent.children.length == 0) {
            parent.onMouseDrag = mouseDragInner;
            parent.onDoubleClick = mouseDownInner;
            return;
        } else {
            parent.onMouseDrag = () => {};
            parent.onDoubleClick = () => {};
        }

        parent.children.forEach(child => {
            if (child == parent) return;
            recurseChild(child);
        })
    }

    let initView = () => {
        let rect = new paper.Rectangle(0,0,480,360);

        let path = new paper.Path.Rectangle(rect);
        path.fillColor = 'white';

        let pathOut = new paper.Path.Rectangle(rect);

        pathOut.strokeColor = darkStroke;
        pathOut.strokeWidth = '3';

        innerGroup = new paper.Group([]);

        viewGroup = new paper.Group([path,innerGroup,pathOut]);

        /*paper.project.importSVG("/logo.svg", function (item) {
            innerGroup.addChild(item);
            recurseChild(innerGroup);
        })*/

        viewGroup.onMouseDrag = mouseDrag;
        viewGroup.onMouseDown = mouseDown;
        viewGroup.onMouseUp = mouseUp;
    }
    

    onMount(() => {
        if (!canvas) return;
        
        paper.setup(canvas);

        initView();
        initPath();

        console.log(paper.view);
    });

</script>

<div class='ide'>
    <div class='ide-left'>
        {#each tools as tool}
            <EditButton bindMode={setMode} modeIn={mode} mode={tool} />
        {/each}
    </div>
    <div class='ide-mid'>
        <canvas class='canvas' resize bind:this={canvas}></canvas>
    </div>
    <div class='ide-right'>
        <EditButton bindMode={setColorMode} modeIn={colorType} mode={'stroke'} />
        <EditButton bindMode={setColorMode} modeIn={colorType} mode={'fill'} />
        <Color bindColor={setColor} color={color} />    
        <input type="file"  style="display:none" bind:files on:change={() => getBase64(files[0])} bind:this={file}>
        <a download="export.svg" bind:this={download} hidden></a>
    </div>
</div>