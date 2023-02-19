<style>
    .button {
        padding: 0.5rem;
        background-color: var(--primary-1);
        border: none;

        font-family: 'Open Sans';
        
        border-radius: 2rem;

        margin: 0.2rem;
    }

    .button a {
        color: var(--light-1);
        font-weight: bold;
        text-decoration: none;
    }

</style>

<script>
    export let clickFunc = () => {
        
    }
</script>

<button on:click={clickFunc} class='button'>
    <a href='#'><slot/></a>
</button>