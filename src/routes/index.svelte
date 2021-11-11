<script>
    export let gameIdeaObj;

    let style = gameIdeaObj.style;
    let theme = gameIdeaObj.theme;
    let genre = gameIdeaObj.genre;

    let styleLock = false;
    let themeLock = false;
    let genreLock = false;

    let styleTempField;
    let themeTempField;
    let genreTempField;

    // Request idea object from backend
    const FetchNewIdea = async() => {
        let response = await fetch("/generate");

        if(!response.ok) return console.error("Something went wrong with generate request!");

        let result = await response.json();

        style = result.style;
        theme = result.theme;
        genre = result.genre;
    }

    // Change lock and update fields accordingly
    const ChangeLockStatus = (fieldType) => {
        if(fieldType === "style"){
            if(!styleLock){
                styleTempField = style;
            } else style = styleTempField;
            styleLock = !styleLock;
        }
        if(fieldType === "theme"){
            if(!themeLock){
                themeTempField = theme;
            } else theme = themeTempField;
            themeLock = !themeLock;
        }
        if(fieldType === "genre"){
            if(!genreLock){
                genreTempField = genre;
            } else genre = genreTempField;
            genreLock = !genreLock;
        }
    }
</script>

<style>
    main{
        color: rgb(242, 244, 247);
        text-align: center;
        font-size: 16px;
        overflow: hidden;
    }

    h1{
        color: rgb(250, 203, 73);
        text-shadow: 0px 4px 4px rgb(124, 35, 35);
        margin-top: 3em;
    }

    button{
        margin: 4em;
        border: 0;
        border-radius: .6em;
        background: rgb(216, 92, 61);
        color: white;
        font-size: 1.6em;
        font-weight: bold;
        padding: 1em;
        cursor: pointer;
        transition: .4s;
    }

    button:hover{
        box-shadow: -4px 4px 0px rgb(226, 152, 133),
            4px 4px 0px rgb(226, 152, 133),
            -4px -4px 0px rgb(226, 152, 133),
            4px -4px 0px rgb(226, 152, 133);
    }

    .card{
        color: rgb(20, 20, 20);
        margin-top: 6em;
        margin-left: auto;
        margin-right: auto;
        border: 0;
        border-radius: .6em;
        background: rgb(240, 240, 240);
        width: 18em;
        box-shadow: 2px 8px 4px rgba(0, 0, 0, 0.24),
        -2px 8px 4px rgba(0, 0, 0, 0.24);
        padding-top: 1em;
        padding-bottom: 1em;
    }

    legend{
        color: rgb(101, 95, 104);
        font-size: 1em;
        font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
        margin-left: auto;
    }

    .field{
        display:flex;
        flex-direction: row;
    }

    svg{
        width: 1em;
        margin-bottom: 1.4em;
        margin-left: .6em;
        margin-right: 6em;
        fill:rgb(101, 119, 141);
        cursor:pointer;
    }

    #closed-lock{
        fill: red;
    }

    h4{
        margin: 0;
        margin-top: .4em;
        margin-bottom: 1.6em;
        font-size: 1.4em;
        font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        text-shadow: 2px 4px 4px rgb(184, 184, 184);
    }

    footer{
        background: rgb(56, 90, 90);
        position:absolute;
        bottom: 0;
        width: 100%;
        padding-bottom: 2em;
    }

    footer a{
        text-decoration: none;
        color: white;
    }

    .credits{
        padding-top: 2em;
    }
</style>

<main>
    <h1>Game Idea Generator</h1>

    <div class="card">

        <div class="field">
            <legend>STYLE</legend>
            {#if !styleLock}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" on:click={() => ChangeLockStatus("style")}>
                    <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                </svg>
            {:else}
                <svg id="closed-lock" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" on:click={() => ChangeLockStatus("style")}>
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
            {/if}
        </div>
        {#if !styleLock}
            <h4>{style}</h4>
        {:else}
            <h4>{styleTempField}</h4>
        {/if}

        <div class="field">
            <legend>THEME</legend>
            {#if !themeLock}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" on:click={() => ChangeLockStatus("theme")}>
                    <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                </svg>
            {:else}
                <svg id="closed-lock" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" on:click={() => ChangeLockStatus("theme")}>
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
            {/if}
        </div>
        {#if !themeLock}
            <h4>{theme}</h4>
        {:else}
            <h4>{themeTempField}</h4>
        {/if}
        <div class="field">
            <legend>GENRE</legend>
            {#if !genreLock}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" on:click={() => ChangeLockStatus("genre")}>
                    <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                </svg>
            {:else}
                <svg id="closed-lock" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" on:click={() => ChangeLockStatus("genre")}>
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
            {/if}
        </div>
        {#if !genreLock}
            <h4>{genre}</h4>
        {:else}
            <h4>{genreTempField}</h4>
        {/if}
            
    </div>

    <button on:click={() => FetchNewIdea()}>GENERATE</button>

    <footer>
        <div class="credits">
            Copyright 2021 - <a href="ignurof.xyz" target="_blank">ignurof.xyz</a>
        </div>
    </footer>
</main>

