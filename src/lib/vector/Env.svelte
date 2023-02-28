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
    

    import pkg from 'paper';
    const { paper } = pkg;
    
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

    let toolData = {};

    tools.forEach(async tool => {
        toolData[tool] = await import(`./tools/${tool}.js`);
    })

    
    let viewGroup, canvas, mainPath, lastPoint, file, files, download, settings;

    let darkStroke = '#000000';

    let mode = 'edit';

    settings = {
        colorType: 'stroke',

        fill: {
            color: '#446699ff',
            stroke: '#000000ff'
        },

        color: '#000000ff',

        stroke: 12,

        innerGroup: null,

        viewGroup: null,

        mainPath: null,

        nodeDist: 45,

        grabDist: 15,

        doc: {
            
        }

    };

    let getBase64 = (filee) => {
        const reader = new FileReader();
        reader.readAsDataURL(filee);
        reader.onload = e => {
            let preview = e.target.result;
            paper.project.importSVG(preview, function (item) {
                settings.innerGroup.addChild(item);
                recurseChild(settings.innerGroup);
            });
        };
    }
  
    let execFunc = (obj, val, args) => {
        obj = obj.toolData;
        if (obj[val]) {
            let result = obj[val]({
                ...args, 
                ...settings, 
                delta: args.delta, 
                point: args.point,
                target: args.target,
                selectedItems: paper.project.selectedItems
            });
            settings = result || settings;
            recurseChild(settings.innerGroup);
        }
    }

    let origin = new paper.Point([0,0]);


    let setMode = (modeSet) => {
        if (modeSet)
            mode = modeSet;

        execFunc(toolData[mode],'run',[])

        return mode;
    }

    let setColorMode = (modeSet) => {
        if (modeSet)
            settings.colorType = modeSet;

        color = (modeSet == 'stroke') ? settings.fill.stroke : settings.fill.color;

        return settings.colorType;
    }

    let setColor = ([colorIn, strokeIn]) => {
        settings.color = colorIn;
        settings.stroke = strokeIn / 5;

        if (settings.colorType == 'stroke') {
            settings.fill.stroke = settings.color
        } else {
            settings.fill.color = settings.color;
        }

        if (!paper.project || !paper.project.selectedItems) return;

        paper.project.selectedItems.forEach(item => {
            if (settings.colorType == 'stroke') {
                item.strokeColor = settings.color
            } else {
                item.fillColor = settings.color;
            }
        })
    }

    let mouseEvent = (type) => {
        return (event) => {
            execFunc(toolData[mode],type,event);
        }
    }

    let mouseEventInner = (type) => {
        return (event) => {
            event.stopPropagation();

            var target = event.target;

            while (target.parent != settings.innerGroup && target.parent != settings.viewGroup && target.parent) {
                target = target.parent;
            }

            event.target = target;

            execFunc(toolData[mode],type,event);
        }
    }

    let recurseChild = (parent) => {
        if (!parent.children || parent.children.length == 0) {
            parent.onMouseDrag = mouseEventInner('mouseDragInner');
            parent.onDoubleClick = mouseEventInner('doubleClickInner');
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

        settings.innerGroup = new paper.Group([]);

        settings.viewGroup = new paper.Group([path,settings.innerGroup,pathOut]);

        /*paper.project.importSVG("/logo.svg", function (item) {
            innerGroup.addChild(item);
            recurseChild(innerGroup);
        })*/

        settings.viewGroup.onMouseDrag = mouseEvent('mouseDrag');
        settings.viewGroup.onMouseDown = mouseEvent('mouseDown');
        settings.viewGroup.onMouseUp = mouseEvent('mouseUp');
    }
    

    onMount(() => {
        if (!canvas) return;
        
        paper.setup(canvas);

        initView();

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
        <EditButton bindMode={setColorMode} modeIn={settings.colorType} mode={'stroke'} />
        <EditButton bindMode={setColorMode} modeIn={settings.colorType} mode={'fill'} />
        <Color bindColor={setColor} color={settings.color} />    
        <input type="file"  style="display:none" bind:files on:change={() => getBase64(files[0])} bind:this={settings.doc.file}>
        <a download="export.svg" bind:this={settings.doc.download} hidden></a>
    </div>
</div>