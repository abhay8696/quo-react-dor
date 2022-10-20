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
        blockedWays: blockedWays
    })
},
clickWall2 = data=> {
    const {x,y,gameData,updateGameData,targetRowOfP1,targetRowOfP2} = data;
    let {player1, player2, turnNo, wallArray, winner, loser, blockedWays, myDirection} = gameData;
    let player, opponent, opponentTargetRow
    // console.log(x,y, gameData);
    //check whose turn
    // gameData?.turnNo%2===1 ? player = gameData?.player1 : player = gameData?.player2;
    if(gameData?.turnNo%2===1){
        player = gameData?.player1;
        opponent = gameData?.player2;
        opponentTargetRow = targetRowOfP2;
    }else{
        player = gameData?.player2;
        opponent = gameData?.player1;
        opponentTargetRow = targetRowOfP1;
    }
    //check remaining walls, if 0 return
    if(player?.walls<=0) return console.log('0 walls left');
    //check wall already built, if true return
    if(gameData?.wallArray.includes(`${x}${y}`)) return;
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
    //update blocked boxes
    let {blockBox1, blockBox2} = find_box_adjacent_to_wall(x,y);
    //if wall doesn't isolate pawn from all sides update gameData
    if(check_possible_ways(opponent?.position, [...gameData?.blockedWays, `${blockBox1}${blockBox2}`], opponentTargetRow)){
        console.log({p:opponent?.position, opponentTargetRow, ways:[...gameData?.blockedWays, `${blockBox1}${blockBox2}`]})
        updateGameData({
            player1: player1,
            player2: player2,
            wallArray : [...wallArray, `${x}${y}`],
            winner: winner,
            loser: loser,
            turnNo: turnNo+1,
            blockedWays: [...blockedWays, `${blockBox1}${blockBox2}`]
        })
    }else{
        console.log({a:"You Cannot Block Opponent Completely!", opponentTargetRow});
        // return invalidMove = true;
    }
},
updateNext = (player, blockedWays)=> {
    const i = Number(player?.position?.split('')[1]);
    const j = Number(player?.position?.split('')[2]);
    let s = `${i}${j}`, arr = [];
    
    let t = `${i-1}${j}`, r=`${i}${j+1}`, b=`${i+1}${j}`, l=`${i}${j-1}`;
    let next = [`${t}${s}`, `${s}${r}`, `${s}${b}`, `${l}${s}`];
    if(!blockedWays.includes(next[0])) arr.push(t);
    if(!blockedWays.includes(next[1])) arr.push(r);
    if(!blockedWays.includes(next[2])) arr.push(b);
    if(!blockedWays.includes(next[3])) arr.push(l);
    return arr;
},
boxClassName = data=> {
    const { i, targetRowOfP1, targetRowOfP2 } = data;
    
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