<script>
    let style = "";
    let theme = "";
    let genre = "";

    let styleLock = false;
    let themeLock = false;
    let genreLock = false;

    // Request idea object from backend
    const FetchNewIdea = async() => {
        let response = await fetch("/generate");

        if(!response.ok) return console.error("Something went wrong with generate request!");

        let result = await response.json();

        if(!styleLock) style = result.style;
        if(!themeLock) theme = result.theme;
        if(!genreLock) genre = result.genre;
    }
</script>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300&display=swap');

    main{
        color: rgb(242, 244, 247);
        font-size: 16px;
        overflow: hidden;
        font-family: 'Rubik';
    }

    .play-icon svg{
        width: 4em;
        fill: #B67AFF;
        position: relative;
        bottom: 2em;
        left: 42.5%;
        margin-bottom: 1.6em;
        background-image: linear-gradient(to right,#d5c0ee, rgb(194, 195, 255));
        border-radius: 50%;
    }

    h1{
        color: #F5F5EB;
        font-size: 4em;
        text-align: center;
    }

    .card{
        margin-top: 3em;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 1em;
        border: 0;
        border-radius: .6em;
        background: #FFFFFF;
        width: 420px;
        height: 560px;
        box-shadow: 0px 6px 6px #00000042;
        padding-bottom: 1em;
    }

    legend{
        color: #A6AAA9;
        font-size: 1.6em;
        width: 3.2em;
        margin-left: .6em;
    }

    .field{
        display:grid;
        grid-template-columns: repeat(2, 1fr);
    }

    .field svg{
        width: 1em;
        cursor:pointer;
        fill: #47b39d;
        margin-left: -6em;
        margin-top: .4em;
    }

    #closed-lock{
        fill: #eb6b56;
    }

    h4{
        margin: 0;
        font-size: 1.4em;
        background: #EBF4F2;
        color: black;
        width: 90%;
        height: 6%;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 2em;
        border-radius: 8px;
        padding-left: .6em;
        padding-top: .4em;
    }

    button{
        border: 0;
        border-radius: 3em;
        background-image: linear-gradient(to right,#8D7BFF,#D779FE);
        box-shadow: 0px 3px 6px #D779FE;
        color: white;
        font-size: 3em;
        padding: .2em;
        padding-left: 1em;
        padding-right: 1em;
        margin-left: 1em;
        cursor: pointer;
    }

    button:hover{
        color:#ccfff8;
    }

    footer{
        background: #3B3747;
        position:absolute;
        bottom: 0;
        width: 100%;
        padding-bottom: 2em;
        color: #d8cce4;
        text-align: center;
    }

    footer a{
        text-decoration: none;
        color: #d8cce4;
    }

    .credits{
        padding-top: 2em;
    }

    /* Fix iPad issue */
    @media all and (max-device-width:1025px) and (orientation:landscape) {
        footer{
            position:absolute;
            bottom: -20em;
        }
    }
</style>

<main>
    <h1>Game Idea Generator</h1>

    <div class="card">
        <div class="play-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
            </svg>
        </div>
        
        <div class="field">
            <legend>STYLE</legend>
            {#if !styleLock}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" on:click={() => {styleLock = !styleLock}}>
                    <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                </svg>
            {:else}
                <svg id="closed-lock" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" on:click={() => {styleLock = !styleLock}}>
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
            {/if}
        </div>

        <h4>{style}</h4>

        <div class="field">
            <legend>THEME</legend>
            {#if !themeLock}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" on:click={() => {themeLock = !themeLock}}>
                    <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                </svg>
            {:else}
                <svg id="closed-lock" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" on:click={() => {themeLock = !themeLock}}>
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
            {/if}
        </div>

        <h4>{theme}</h4>
        
        <div class="field">
            <legend>GENRE</legend>
            {#if !genreLock}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" on:click={() => {genreLock = !genreLock}}>
                    <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                </svg>
            {:else}
                <svg id="closed-lock" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" on:click={() => {genreLock = !genreLock}}>
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
            {/if}
        </div>

        <h4>{genre}</h4>
            
        <button on:click={() => FetchNewIdea()}>GENERATE</button>
    </div>

    

    <footer>
        <div class="credits">
            Copyright 2021 - <a href="https://ignurof.xyz" target="_blank">ignurof.xyz</a>
        </div>
    </footer>
</main>

