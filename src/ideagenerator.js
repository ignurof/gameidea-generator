const GenerateIdea = () => {
    // 1-10
    let randomNum = Math.floor((Math.random() * 10) + 1);

    if(randomNum < 1 || randomNum > 10) return "ERROR";

    let gameIdea = IdeaInventor(randomNum);
    return gameIdea;
}

const IdeaInventor = (num) => {
    let idea = "NULL";

    switch(num){
        case 1: idea = "GAME1"; break;
        case 2: idea = "GAME2"; break;
        case 3: idea = "GAME3"; break;
        case 4: idea = "GAME4"; break;
        case 5: idea = "GAME5"; break;
        case 6: idea = "GAME6"; break;
        case 7: idea = "GAME7"; break;
        case 8: idea = "GAME8"; break;
        case 9: idea = "GAME9"; break;
        case 10: idea = "GAME10"; break;
    }

    return idea;
}

module.exports = {
    GenerateIdea
};