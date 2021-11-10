<script>
    export let gameIdeaObj;

    let style = gameIdeaObj.style;
    let theme = gameIdeaObj.theme;
    let genre = gameIdeaObj.genre;
</script>

<style>
    main{
        color: rgb(242, 244, 247);
        text-align: center;
        font-size: 16px;
    }

    h1{
        color: rgb(250, 203, 73);
        text-shadow: 0px 4px 4px rgb(124, 35, 35);
        margin-top: 4em;
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
    }

    h4{
        margin: 0;
        margin-top: .4em;
        margin-bottom: 1.6em;
        font-size: 1.4em;
        font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        text-shadow: 2px 4px 4px rgb(184, 184, 184);
    }
</style>

<main>
    <h1>Game Idea Generator</h1>

    <div class="card">
        <legend>STYLE</legend>
        <h4>{style}</h4>
        <legend>THEME</legend>
        <h4>{theme}</h4>
        <legend>GENRE</legend>
        <h4>{genre}</h4>
    </div>
</main>
