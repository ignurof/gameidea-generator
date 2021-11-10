const GenerateIdea = async() => {
    // Object vars
    let theme = "";
    let genre = "";
    let style = "";
    
    // Generate random number between 1-10
    let randomNum = Math.floor((Math.random() * 10) + 1);
    // Early return out with an error if something went wrong, but it shouldnt
    if(randomNum < 1 || randomNum > 10) return console.error("ERROR: GenerateIdeas()");

    // Generate all the ideas
    theme = ThemeInventor(randomNum);
    genre = GenreInventor(randomNum);
    style = StyleInventor(randomNum);

    // I need to declare the object after filling the vars
    let ideasObj = {
        theme,
        genre,
        style
    };

    return ideasObj;
}

const ThemeInventor = (num) => {
    let idea = "NULL";

        switch(num){
            case 1: idea = "Pirate"; break;
            case 2: idea = "Future"; break;
            case 3: idea = "Horror"; break;
            case 4: idea = "Western"; break;
            case 5: idea = "Medieval"; break;
            case 6: idea = "Fantasy"; break;
            case 7: idea = "Aliens"; break;
            case 8: idea = "Crime"; break;
            case 9: idea = "War"; break;
            case 10: idea = "Alchemy"; break;
        }
    
    return idea;
}

const GenreInventor = (num) => {
    let idea = "NULL";

    switch(num){
        case 1: idea = "Platformer"; break;
        case 2: idea = "Shooter"; break;
        case 3: idea = "Fighting"; break;
        case 4: idea = "Stealth"; break;
        case 5: idea = "Survival"; break;
        case 6: idea = "Roguelike"; break;
        case 7: idea = "Tower defence"; break;
        case 8: idea = "Racing"; break;
        case 9: idea = "Simulation"; break;
        case 10: idea = "Puzzle"; break;
    }

    return idea;
}

const StyleInventor = (num) => {
    let idea = "NULL";

    switch(num){
        case 1: idea = "Casual"; break;
        case 2: idea = "Hardcore"; break;
        case 3: idea = "Trippy"; break;
        case 4: idea = "For kids"; break;
        case 5: idea = "Slow paced"; break;
        case 6: idea = "Feelgood"; break;
        case 7: idea = "2D"; break;
        case 8: idea = "3D"; break;
        case 9: idea = "VR"; break;
        case 10: idea = "Adult"; break;
    }

    return idea;
}

module.exports = {
    GenerateIdea
};