import { check_possible_ways, find_box_adjacent_to_wall, giveDirection } from "./boardFunctions";

export const
clickBox2 = data=> {
    const { i, j, gameData, updateGameData, next1, next2, oldPosition } = data;
    let {player1, player2, turnNo, wallArray, winner, loser, blockedWays} = gameData;
    let newPos1=player1?.position, newPos2=player2.position, movingDirection1, movingDirection2;
    if(turnNo%2===1){
        if(!next1.includes(`${i}${j}`)) return;
        newPos1 = `B${i}${j}`;
        console.log(newPos1);
        movingDirection1 = giveDirection({from:oldPosition, to: newPos1});
    }
    if(turnNo%2===0){
        if(!next2.includes(`${i}${j}`)) return;
        newPos2 = `B${i}${j}`;
        console.log(newPos2);
        movingDirection2 = giveDirection({from:oldPosition, to: newPos2});
    }
    updateGameData({
        player1: {
            name: player1?.name,
            position: newPos1,
            walls:player1?.walls,
            myDirection: movingDirection1
        },
        player2: {
            name: player2?.name,
            position: newPos2,
            walls: player2?.walls,
            myDirection: movingDirection2
        },
        wallArray : wallArray,
        winner: winner,
        loser: loser,
        turnNo: turnNo+1,
        blockedWays: blockedWays,
        errorMsg: undefined
    })
},
clickWall2 = data=> {
    const {x,y,gameData,updateGameData,targetRowOfP1,targetRowOfP2} = data;
    let {player1, player2, turnNo, wallArray, winner, loser, blockedWays, myDirection} = gameData;
    let player, opponent, opponentTargetRow, playerTargetRow, errorMsg;
    // console.log(x,y, gameData);
    //check whose turn
    // gameData?.turnNo%2===1 ? player = gameData?.player1 : player = gameData?.player2;
    if(gameData?.turnNo%2===1){
        player = gameData?.player1;
        opponent = gameData?.player2;
        opponentTargetRow = targetRowOfP2;
        playerTargetRow = targetRowOfP1;
    }else{
        player = gameData?.player2;
        opponent = gameData?.player1;
        opponentTargetRow = targetRowOfP1;
        playerTargetRow = targetRowOfP2;
    }
    //check remaining walls, if 0 return
    if(player?.walls<=0) return console.log('0 walls left');
    //check wall already built, if true return
    if(gameData?.wallArray.includes(`${x}${y}`)) return;
    //update blocked boxes
    let {blockBox1, blockBox2} = find_box_adjacent_to_wall(x,y);

    const checkConditions = ()=> {
        console.log('**************checking parameters*********8')
        if (!check_possible_ways(opponent?.position, [...gameData?.blockedWays, `${blockBox1}${blockBox2}`], opponentTargetRow)){
            errorMsg = 'Invalid Move!';
            return false;
        }if (!check_possible_ways(player?.position, [...gameData?.blockedWays, `${blockBox1}${blockBox2}`], playerTargetRow)){
            errorMsg = 'Invalid Move!';
            return false;
        }
        return true;
    }
    //if wall doesn't isolate pawn from all sides update gameData
    if(checkConditions()){
        //update player info
        if(turnNo%2===1){
            player1 = {
                name: player1?.name,
                position: player1?.position,
                walls: player1?.walls-1,
                myDirection
            }
        }else{
            player2 = {
                name: player2?.name,
                position: player2?.position,
                walls: player2?.walls-1,
                myDirection
            }
        }
        console.log({p:opponent?.position, opponentTargetRow, ways:[...gameData?.blockedWays, `${blockBox1}${blockBox2}`]})
        updateGameData({
            player1: player1,
            player2: player2,
            wallArray : [...wallArray, `${x}${y}`],
            winner: winner,
            loser: loser,
            turnNo: turnNo+1,
            blockedWays: [...blockedWays, `${blockBox1}${blockBox2}`],
            errorMsg: undefined
        });
        errorMsg=undefined;
    }else {
        let msg1 = 'Invalid Move!';
        return updateGameData({player1, player2, turnNo, wallArray, winner, loser, blockedWays, myDirection, errorMsg:{msg1, msg2:errorMsg}})
    };
},
updateNext = (player, blockedWays, opponentPosition)=> {
    const i = Number(player?.position?.split('')[1]);
    const j = Number(player?.position?.split('')[2]);
    const opCoords = `${opponentPosition[1]}${opponentPosition[2]}`;
    console.log(opCoords);
    let s = `${i}${j}`, arr = [];
    
    let t = `${i-1}${j}`, r=`${i}${j+1}`, b=`${i+1}${j}`, l=`${i}${j-1}`;
    let next = [`${t}${s}`, `${s}${r}`, `${s}${b}`, `${l}${s}`];
    if(!blockedWays.includes(next[0]) && t!=opCoords) {
        arr.push(t);
        console.log(next[0])
    }
    if(!blockedWays.includes(next[1]) && r!=opCoords) {
        arr.push(r);
        console.log(next[1])
    }
    if(!blockedWays.includes(next[2]) && b!=opCoords) {
        arr.push(b);
        console.log(next[2])
    }
    if(!blockedWays.includes(next[3]) && l!=opCoords) {
        arr.push(l);
        console.log(next[3])
    }
    return arr;
},
boxClassName = data=> {
    const { i, j, targetRowOfP1, targetRowOfP2, next1, next2, turnNo } = data;
    
    if(next1.includes(`${i}${j}`) && turnNo%2===1) return 'nextBox1';
    if(next2.includes(`${i}${j}`) && turnNo%2===0) return 'nextBox2';
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
    const {x,y,type, wallArray, wallSwitch} = data;
    if(type==='v'){
        if(wallArray?.includes(`${x}${y}`)){
            return 'selectedVerticalWall'
        }else if(wallSwitch){
            return 'verticalWall';
        }else return 'verticalWallInvisible';
    }else {
        if(wallArray?.includes(`${x}${y}`)){
            return 'selectedHorizontalWall'
        }else if(wallSwitch){
            return 'horizontalWall';
        }else return 'horizontalWallInvisible';
    }
},
checkWinner = (data)=> {
    const {position1, position2, target1, target2, gameData, updateGameData} = data;
    let w, l, winnerName;
    if(+position1.split('')[1] === target1){
        w=1; 
        l=2;
        winnerName = gameData?.player1?.name;
    }else if(+position2.split('')[1] === target2){
        w=2; 
        l=1;
        winnerName = gameData?.player2?.name;
    }else return false;

    return updateGameData({
        player1: gameData?.player1,
        player2: gameData?.player2,
        wallArray: gameData?.wallArray,
        winner: w,
        loser: l,
        turnNo: gameData?.turnNo,
        blockedWays: gameData?.blockedWays,
        errorMsg: gameData?.errorMsg,
        winnerName: winnerName
    });
}