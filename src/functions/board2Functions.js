export const
clickBox2 = data=> {
    const { i, j, gameData, updateGameData, next1, next2 } = data;
    let {player1, player2, turnNo, wallArray, winner, loser} = gameData;
    let newPos1=player1?.position, newPos2=player2.position;
    if(turnNo%2===1){
        if(!next1.includes(`${i}${j}`)) return;
        newPos1 = `B${i}${j}`;
        console.log(newPos1);
    }
    if(turnNo%2===0){
        if(!next2.includes(`${i}${j}`)) return;
        newPos2 = `B${i}${j}`;
        console.log(newPos2);
    }
    updateGameData({
        player1: {
            name: player1?.name,
            position: newPos1,
            walls:player1?.walls,
        },
        player2: {
            name: player2?.name,
            position: newPos2,
            walls: player2?.walls
        },
        wallArray : wallArray,
        winner: winner,
        loser: loser,
        turnNo: turnNo+1
    })
},
clickWall2 = data=> {
    const {x,y,gameData,updateGameData} = data;
    let {player1, player2, turnNo, wallArray, winner, loser} = gameData;
    let player;
    console.log(x,y, gameData);
    //check whose turn
    gameData?.turnNo%2===1 ? player = gameData?.player1 : player = gameData?.player2;
    //check remaining walls, if 0 return
    if(player?.walls<=0) return console.log('0 walls left');
    //check wall already built, if true return
    if(gameData?.wallArray.includes(`${x}${y}`)) return;
    //update gamedata
    if(turnNo%2===1){
        player1 = {
            name: player1?.name,
            position: player1?.position,
            walls: player1?.walls-1,
        }
    }else{
        player2 = {
            name: player2?.name,
            position: player2?.position,
            walls: player2?.walls-1,
        }
    }
    
    updateGameData({
        player1: player1,
        player2: player2,
        wallArray : [...wallArray, `${x}${y}`],
        winner: winner,
        loser: loser,
        turnNo: turnNo+1
    })
},
updateNext = player=> {
    const i = Number(player?.position?.split('')[1]);
    const j = Number(player?.position?.split('')[2]);
    let s = `${i}${j}`
    
    let t = `${i-1}${j}`, r=`${i}${j+1}`, b=`${i+1}${j}`, l=`${i}${j-1}`;
    
    return [`${t}`, `${r}`, `${b}`, `${l}`];
},
boxClassName = data=> {
    const { i, targetRowOfP1, targetRowOfP2 } = data;
    console.log(data);
    if(i===0 || i===8) {
        if(i === targetRowOfP1){
            return 'targetBox1';
        }
        if(i === targetRowOfP2){
            return 'targetBox2';
        }
    }
    return 'box2';
},
wallClassName = data=> {
    const {x,y,type, wallArray} = data;
    if(type==='v'){
        if(wallArray?.includes(`${x}${y}`)){
            return 'selectedVerticalWall'
        }else return 'verticalWall';
    }else {
        if(wallArray?.includes(`${x}${y}`)){
            return 'selectedHorizontalWall'
        }else return 'horizontalWall';
    }
}