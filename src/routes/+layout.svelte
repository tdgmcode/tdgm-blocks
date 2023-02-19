<style> 
    :global(:root) {
        font-family: 'Open Sans';
        
        --dark-1: #2b2f36;
        --dark-2: #d8d8d8;

        --primary-1: #498aec;

        --light-1: #ffffff;
        --light-2: #f8f8f8;

        --border-1: solid var(--dark-2) 5px;
    }
</style>

<script>
    import Header from '$lib/page/Header.svelte';
</script>

<Header />

<slot ></slot>