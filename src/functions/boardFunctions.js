import { updateDoc, doc } from "firebase/firestore";

export const clickBox = data=> {
    const {myTurn, i, j, gameData, playerData, gameRef, next, oldPosition} = data;
    if(!myTurn) return;
    let s = `${i}${j}`
    if(!next?.includes(s)) return;
    let myDirection = giveDirection({from: oldPosition, to: `B${i}${j}`});
    
    // setSelected(`B${i}${j}`);

    if(gameData.player1.name === playerData.name){
        updateDoc(gameRef, {
            player1:{
                position : `B${i}${j}`,
                name: playerData.name,
                walls: gameData.player1.walls,
                myDirection: myDirection
            }
        })
    }else{
        updateDoc(gameRef, {
        player2:{
            position : `B${i}${j}`,
            name: playerData.name,
            walls: gameData.player2.walls,
            myDirection: myDirection
        }
        })
    }
    //shuffle player
    updateDoc(gameRef, {
        turnNo: gameData.turnNo+1
    })

}

export const clickWall = data => {
    let {myTurn, x,y, standingWalls, gameData, gameRef, playerData, opponentPawn, blocked, targetRowOfOpponent} = data;
    let invalidMove = false;
    if(!myTurn) return;
    if(standingWalls?.length){
        if(standingWalls?.includes(`W${x}${y}`)) return;
    }
    if(gameData?.player1.name === playerData.name && gameData?.player1.walls <= 0) return;
    if(gameData?.player2.name === playerData.name && gameData?.player2.walls <= 0) return;
    if(blocked === undefined){
        blocked = [];
        console.log(blocked); 
    }
    let {blockBox1, blockBox2} = find_box_adjacent_to_wall(x,y);
    
    if(check_possible_ways(opponentPawn.position, [...blocked, `${blockBox1}${blockBox2}`], targetRowOfOpponent
    )){
        updateDoc(gameRef, {
            wallArray:[...standingWalls, `W${x}${y}`],
            turnNo: gameData.turnNo + 1
            })
        if(gameData?.player1.name === playerData.name){
            updateDoc(gameRef, {
                player1:{
                    position : gameData.player1.position,
                    name: playerData.name,
                    walls: gameData.player1.walls - 1
                }
            })
        }else{
            updateDoc(gameRef, {
            player2:{
                position : gameData.player2.position,
                name: playerData.name,
                walls: gameData.player2.walls - 1
            }
            })
        }
        return invalidMove = false;
    }else{
        console.log({a:"You Cannot Block Opponent Completely!", targetRowOfOpponent});
        return invalidMove = true;
    }
}

export const find_box_adjacent_to_wall = (x,y)=> {
    let blockBox1, blockBox2;
    if(x%2===0){ //vWall
        let iLeft = x/2, jLeft=y, iRight = x/2, jRight=y+1;
        blockBox1 = `${iLeft}${jLeft}`;
        blockBox2 = `${iRight}${jRight}`;
    }
    if(x%2===1){ //hWall
        let iTop = (x-1)/2, jTop=y, iBot = (x+1)/2, jBot=y;
        blockBox1 = `${iTop}${jTop}`;
        blockBox2 = `${iBot}${jBot}`;
    }

    return {blockBox1, blockBox2}
}

export const check_possible_ways = (position, blocked=[], targetRow)=> {
    let  i = Number(position.split('')[1]), j = Number(position.split('')[2]), loopNo = 0,
    newBlocked = [...blocked];
    console.log('***************checking...****************');

    const checkBlocked = (i, j, m, n)=> {
        // console.log('checkin blocked...')
        // console.log(newBlocked)
        for(let l = 0; l < newBlocked.length; l++){
            let b1 = `${newBlocked[l][0]}${newBlocked[l][1]}`, b2 = `${newBlocked[l][2]}${newBlocked[l][3]}`;
            if(b1 === `${i}${j}` && b2 === `${m}${n}`){
                newBlocked.splice(l, 1);
                return true;
            }
            if(b1 === `${m}${n}` && b2 === `${i}${j}`){
                newBlocked.splice(l, 1);
                return true;
            }
        }
        return false;
    }
    
    const findWay = (i,j, visited = [])=> {
        loopNo++;
        // console.log({loopNo, visited, blocked})
        // console.log(`${i}${j}`)
        // console.log(`at BOX: ${i}${j}`);
        if(i===targetRow) {
            visited = [];
            blocked = [];
            return true;
        }
        if(visited.length){
            if(visited.includes(`${i}${j}`)) return false;
        }
        
        visited.push(`${i}${j}`);

        let next = [], stop = false;
        let 
        push_box_on_top = ()=> {
            if(!visited.includes(`${i-1}${j}`) && i-1>=0){
                if(!checkBlocked(i, j, i-1, j)) return next.push(`${i-1}${j}`);
            }
        },
        push_box_on_left = ()=> {
            if(!visited.includes(`${i}${j-1}`) && j-1>0){
                if(!checkBlocked(i, j, i, j-1)) return next.push(`${i}${j-1}`);
            }
        },
        push_box_on_right = ()=> {
            if(!visited.includes(`${i}${j+1}`) && j+1<8){
                if(!checkBlocked(i, j, i, j+1)) return next.push(`${i}${j+1}`);
            }
        },
        push_box_on_bottom = ()=> {
            if(!visited.includes(`${i+1}${j}`) && i+1<=8){
                if(!checkBlocked(i, j, i+1, j)) return next.push(`${i+1}${j}`);
            }
        }

        if(targetRow === 0){
            push_box_on_top();
            push_box_on_right();
            push_box_on_left();
            push_box_on_bottom();
        }else{
            push_box_on_bottom();
            push_box_on_left();
            push_box_on_right();
            push_box_on_top();
        }
        
        
        while(next.length > 0){
            let str = next.shift();

            stop = findWay(Number(str.split('')[0]), Number(str.split('')[1]), visited);
            if(stop){
                visited = [];
                blocked = [];
                next = [];
                return true;
            }
        }
        if(next.length <= 0) return false;
    }
    return findWay(i,j);
}

export const check_next_collide_with_opponentPawn = data=> {
    let {arr, selected, opponentPawn, blocked} = data;
    let x,y, includesBlockedList = false;
    let oPosition = opponentPawn?.position, sPosition = selected?.position;
    const coord = oPosition?.split("")[1].concat(oPosition?.split("")[2])
    if(arr.indexOf(coord) >= 0 && oPosition && sPosition){ //nextBox Collides with oPosition
        //check if both pawns align is same row or same column
        if(oPosition[1] === sPosition[1]){//same row
            console.log('same row')
            x = oPosition[1];
            //if oppo is at rhs of slected
            if(oPosition[2]-sPosition[2] > 0){
                y = `${Number(oPosition[2])+1}`;
            }else{
                //else oppo is at lhs of slected
                y = `${Number(oPosition[2])-1}`;
            }
        }else if(oPosition[2] === sPosition[2]){//same column
            console.log('same column')
            y = oPosition[2];
            //if oppo is at bottom of slected
            if(oPosition[1]-sPosition[1] > 0){
                x = `${Number(oPosition[1])+1}`;
            }else{
                //else oppo is at top of slected
                x = `${Number(oPosition[1])-1}`;
            }
        }
        //check if blocked includes xy
        blocked?.forEach(i=> {
            let b1 = `${i[0]}${i[1]}`, b2 = `${i[2]}${i[3]}`;
            if(b1 === `${x}${y}` || b2 === `${x}${y}`){
                if(b1 === `${oPosition[1]}${oPosition[2]}` || b2 === `${oPosition[1]}${oPosition[2]}`) includesBlockedList = true;
            }
        })
        if(includesBlockedList){
            arr[arr.indexOf(coord)] = null;
        }else arr[arr.indexOf(coord)] = `${x}${y}`;
    }
    return arr;
}

export const block_boxes_ajacent_to_wall = data=> {
    let {x, y, blocked, gameRef, selected, next} = data;
    let newNext = [];

    let {blockBox1, blockBox2} = find_box_adjacent_to_wall(Number(x), Number(y));

    if(!blocked?.includes(`${blockBox1}${blockBox2}`)){
        if(blocked?.length){
            updateDoc(gameRef, {
            blockedWays: [...blocked, `${blockBox1}${blockBox2}`]
            })
        }else{
            updateDoc(gameRef, {
                blockedWays: [`${blockBox1}${blockBox2}`]
            })
        }
    }
    
    //check clicked wall is adjacent to selected box
    //if(yes) update next boxes
    if(selected === `B${blockBox1}` || selected === `B${blockBox2}`){
        console.log('blocking next block too')
        // setNext()
        next.forEach(i=> {
            if(i !== blockBox1 && i !== blockBox2){
                newNext.push(i)
            }
        })
        return newNext
    }else return next;
}

export const clearBoard = data=> {
    let { gameData, playerData, gameRef, opponent} = data;
    if(gameData?.player1.name === playerData.name){
        updateDoc(gameRef, {
            player1:{
                position : "B84",
                name: playerData.name,
                walls: 12
            }
        })
        updateDoc(gameRef, {
        player2:{
            position : "B14",
            name: opponent,
            walls: 12
        }
        })
    }else{
        updateDoc(gameRef, {
            player2:{
                position : "B14",
                name: playerData.name,
                walls: 12
            }
        })
        updateDoc(gameRef, {
        player1:{
            position : "B84",
            name: opponent,
            walls: 12
        }
        })
    }
    updateDoc(gameRef, { wallArray : [], turnNo: 1 })
    updateDoc(gameRef, { blockedWays : [] })
}

export const foundWinner = data=> {
    const { winner, gameRef } = data;
    updateDoc(gameRef, {
        winner: winner.name
    })
    return;
}

export const giveDirection = data=> {
    const { from, to } = data;
    let i1 = from.split("")[1];
    let j1 = from.split("")[2];
    let i2 = to.split("")[1];
    let j2 = to.split("")[2];
    // if(boardType === 'normal'){
        if(i1 > i2) return 'to-up';
        if(i1 < i2) return 'to-down';
        if(j1 > j2) return 'to-left';
        if(j1 < j2) return 'to-right';
    // }else {//board is inverted
    //     if(i1 > i2) return 'to-down';
    //     if(i1 < i2) return 'to-up';
    //     if(j1 > j2) return 'to-right';
    //     if(j1 < j2) return 'to-left';
    // }

}