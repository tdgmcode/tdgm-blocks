<script>
    import Slider from './Slider.svelte';

    export let color;

    let extractColor = (color) => {
        var colors = [0,1,2,3];
        var out = colors.map(x => parseInt(color.substring(x*2+1,x*2+3),16));
        out.push(currColor[4]);
        console.log(out);
        return out;
    }

    var currColor = [0,0,0,255,15];
    $: currColor = extractColor(color) || [0,0,0,255];

    let parseColor = (color) => {
        return [
            '#' + [color[0],color[1],color[2],color[3]].map(x => Math.floor(x).toString(16).padStart(2,0)).join(''),
            color[4]
        ];
    }

    let calcComp = (color, i, comp) => {
        if (i == 3)
            comp = 255 - comp;
        let outColor = [...color];
        outColor[i] = comp;
        return outColor;
    }

    let getComp = (color, i) => {
        let comp = color[i];
        if (i == 3)
            comp = 255 - comp;
        return comp;
    }
    
    export let bindColor = () => {};

    bindColor(parseColor(currColor));

    let comp = [0,1,2,3,4];
    let compnames = ['Red','Green','Blue','Alpha','Size']
</script>

{#each comp as index}
    <p>{compnames[index]} ({getComp(currColor,index)})</p>
    <Slider 
        startColor={parseColor(
            calcComp(currColor,index,0)
        )[0]}
        endColor={parseColor(
            calcComp(currColor,index,255)
        )[0]}
        sliderPos={getComp(currColor,index) / 255 * 100}
        sliderCall={
            (slider) => {
                currColor = calcComp(currColor,index,slider*255/100);
                bindColor(parseColor(currColor));
            }
        }
    />
{/each}