const GenerateIdea = async() => {
    // Object vars
    let theme = "";
    let genre = "";
    let style = "";
    
    /*
        Generate all the ideas using random numbers between 1-10, 
        always wait for return Promise before moving forward.
    */
    let randomNum = await RandomNumber(10);
    theme = ThemeInventor(randomNum);

    randomNum = await RandomNumber(10);
    genre = GenreInventor(randomNum);
    
    randomNum = await RandomNumber(10);
    style = StyleInventor(randomNum);

    // I need to declare the object after filling the vars
    let ideasObj = {
        theme,
        genre,
        style
    };

    return ideasObj;
}

const RandomNumber = (randomLimit) => {
    return new Promise((resolve, reject) => {
        let rNum = Math.floor((Math.random() * randomLimit) + 1);
        if(rNum < 1 || rNum > randomLimit) reject(1);
        resolve(rNum);
    });
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