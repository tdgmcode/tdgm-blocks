<style>
    .button {
        width: 2rem;
        height: 2rem;
        border: none;
 
        font-family: 'Open Sans';
        
        border-radius: 100%;

        margin: 0.2rem;

        padding: 0.3rem;

    }

    .selected {
        background: var(--dark-2);
    }

</style>

<script>
    
    let clickFunc = () => {
        bindMode(mode);
    }

    export let bindMode = () => {};

    export let modeIn = '';

    export let mode = '';

    let selected;
    
    $: selected = (mode == modeIn);

    export let img = `/${mode}.svg`;

</script>

<a href='#'>
    <img src={img} on:click={clickFunc} class={selected ? 'button selected' : 'button '}>
</a>