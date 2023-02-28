<script>
    export let startColor = '#000000';
    export let endColor = '#ffffff';
    export let sliderCall = () => {};
    export let sliderPos = 0;

    let mouseDown = false;

    let slider;

    let drag = (e) => {
        if (!mouseDown) return;
    
        if (slider != e.target) {
            sliderPos = e.offsetX / 2 * 1.1 - 5 + sliderPos;
        } else {
            sliderPos = e.offsetX / 2 * 1.1 - 5;
        }

        sliderPos = Math.max(sliderPos,0);
        sliderPos = Math.min(sliderPos,100);

        sliderCall(sliderPos);
    }
</script>

<style>
    .slider {
        width: 200px;
        padding-left: 5px;
        padding-right: 30px;
        margin: 0.5rem;
        height: 25px;
        border-radius: 12.5px;

        display: block;

        background: linear-gradient(to right, var(--startColor), var(--endColor));
    }

    .sliderMarker {
        background: var(--light-1);
        width: 25px;
        height: 25px;
        border-radius: 100%;
    }
</style>

<div 
    class='slider' 
    style='--startColor: {startColor}; --endColor: {endColor}'
    bind:this={slider}
    on:mousemove={drag} 
    on:mousedown={() => { mouseDown = true; }} 
    on:touchstart={() => { mouseDown = true; }} 
    on:mouseup={() => { mouseDown = false; }}
    on:touchstop={() => { mouseDown = false; }}
    on:mouseleave={() => { mouseDown = false; }}
>
    <div 
        class='sliderMarker' 
        style='margin-left: {sliderPos * 2 + 'px'}'       
    ></div>
</div>
