import React, { useEffect, useState } from 'react';
//firebase
import db from '../Firebase';
import { doc, query, updateDoc } from 'firebase/firestore';
//styles
import '../styles/board.css'
//icons
import pawn from '../../src/icons/pawn.svg'
import StarsIcon from '@mui/icons-material/Stars';
import LensIcon from '@mui/icons-material/Lens';
import { selectClasses } from '@mui/material';
const Board = (props) => {
    //states
    const 
    [gameRef, setGameRef] = useState(),
    [selected, setSelected] = useState(),
    [next, setNext] = useState(),
    [standingWalls, setStandingWalls] = useState([]),
    [blocked, setBlocked] = useState([]),
    [boardType, setBoardType] = useState('normal'),
    [opponentPawn, setOpponentPawn] = useState();
    //props
    const { gameData, playerData, opponent } = props;
    //life cycle
    useEffect(()=> {
        if(gameData?.player1.name === playerData.name){
            setBoardType('normal')
        }else setBoardType('boardInverted');
        setGameRef(doc(db, "liveGames", `${gameData?.id}`));

        return ()=> {
            setStandingWalls([]);
        }
    }, [])
    useEffect(()=> {
        if(gameData?.player1.name === playerData.name){
            setSelected(gameData?.player1);
            setOpponentPawn(gameData?.player2);
        }else{
            setSelected(gameData?.player2);
            setOpponentPawn(gameData?.player1);
        }
        setStandingWalls(gameData?.wallArray);
        setBlocked(gameData?.blockedWays)
    }, [gameData])
    useEffect(()=> {
        if(standingWalls?.length){
            let str = standingWalls[standingWalls.length-1], x, y;
            //below code will only work for board size below 10x10
            if(str.length === 3){
                x = standingWalls[standingWalls.length-1].split('')[1];
                y = standingWalls[standingWalls.length-1].split('')[2];
            }else if(str.length === 4){ 
                x = standingWalls[standingWalls.length-1].split('')[1].concat(standingWalls[standingWalls.length-1].split('')[2])
                y = standingWalls[standingWalls.length-1].split('')[3];
            }
    
            block_boxes_ajacent_to_wall(Number(x), Number(y));
        }
    }, [standingWalls])
    useEffect(()=> {
        const i = Number(selected?.position?.split('')[1]);
        const j = Number(selected?.position?.split('')[2]);
        let s = `${i}${j}`
        
        let t = `${i-1}${j}`, r=`${i}${j+1}`, b=`${i+1}${j}`, l=`${i}${j-1}`;
        let arr = [];
        const checkThis = [`${t}${s}`, `${s}${r}`, `${s}${b}`, `${l}${s}`]
        checkThis.forEach(i=> {
            if(!blocked.includes(i)){
                //i.split
                let splitedStr = i.split(''); 
                //join 0+1 and 2+3
                let str1 = splitedStr[0].concat(splitedStr[1])
                let str2 = splitedStr[2].concat(splitedStr[3])
                //if(0+1 === s) arr.push(2+3) else arr.push(0+1)
                if(str1 === s) arr.push(str2);
                else arr.push(str1);
            }
        })
        setNext(check_next_collide_with_opponentPawn(arr))
    }, [selected])
    //functions
    const 
    clickBox = (i,j)=> {
        let s = `${i}${j}`
        if(!next?.includes(s)) return;
        
        // setSelected(`B${i}${j}`);

        if(gameData.player1.name === playerData.name){
            updateDoc(gameRef, {
                player1:{
                    position : `B${i}${j}`,
                    name: playerData.name,
                    walls: gameData.player1.walls
                }
            })
        }else{
            updateDoc(gameRef, {
            player2:{
                position : `B${i}${j}`,
                name: playerData.name,
                walls: gameData.player2.walls
            }
            })
        }
    },
    clickWall = (x,y)=> {
        if(standingWalls?.length){
            if(standingWalls?.includes(`W${x}${y}`)) return;
        }
        if(gameData?.player1.name === playerData.name && gameData?.player1.walls <= 0) return;
        if(gameData?.player2.name === playerData.name && gameData?.player2.walls <= 0) return;
        
        updateDoc(gameRef, {
            wallArray:[...standingWalls, `W${x}${y}`]
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

    },
    block_boxes_ajacent_to_wall = (x, y)=> {
        let blockBox1, blockBox2, newNext = [];
        //if x%2===0 hWall else vWall
        if(x%2===1){ //vWall
            let iLeft = (x+1)/2, jLeft=y, iRight = (x+1)/2, jRight=y+1;
            blockBox1 = `${iLeft}${jLeft}`;
            blockBox2 = `${iRight}${jRight}`;
        }
        if(x%2===0){ //hWall
            let iTop = x/2, jTop=y, iBot = (x/2)+1, jBot=y;
            blockBox1 = `${iTop}${jTop}`;
            blockBox2 = `${iBot}${jBot}`;
            }
        if(!blocked.includes(`${blockBox1}${blockBox2}`)){
            updateDoc(gameRef, {
                blockedWays: [...blocked, `${blockBox1}${blockBox2}`]
            })
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
            setNext(newNext);
        }
    },
    check_next_collide_with_opponentPawn = arr=> {
        let x,y, includesBlockedList = false;
        let oPosition = opponentPawn.position, sPosition = selected.position;
        const coord = oPosition.split("")[1].concat(oPosition.split("")[2])
        if(arr.indexOf(coord) >= 0){ //nextBox Collides with oPosition
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
            blocked.forEach(i=> {
                let b1 = `${i[0]}${i[1]}`, b2 = `${i[2]}${i[3]}`;
                if(b1 === `${x}${y}` || b2 === `${x}${y}`){
                    includesBlockedList = true;
                }
            })
            if(includesBlockedList){
                arr[arr.indexOf(coord)] = null;
            }else arr[arr.indexOf(coord)] = `${x}${y}`;
        }
        return arr;
    },
    dispBoxes = ()=> {
        let rows = [], i=0;
        for(let x=1; x<=11; x++){
            if(x%2===1) i++ ;
            rows.push(
                <div className='row' key={`B${x}`}>
                    { x%2 === 1 ? boxRow(i,x) : wallRow(x) } 
                </div>
            )
        }
        return rows;
    },
    boxRow = (i,x)=> {
        let row = [], j=0, y=0;
        for(let l=1; l<=11; l++){
            if(l%2 === 1) j++;
            else y++;
            l%2 === 1 ? row.push(box(i,j)) : row.push(wall(x,y,'v'));
        }
        return row;
    },
    wallRow = (x)=> {
        let row = [];
        for(let y=1; y<=6; y++){
            row.push(wall(x,y,'h'));
        }
        return row;
    },
    wall = (x,y, type)=> {
        let cls;
        if(type==='v'){
            if(standingWalls?.includes(`W${x}${y}`)){
                cls = 'selectedVerticalWall'
            }else cls = 'verticalWall';
        }else {
            if(standingWalls?.includes(`W${x}${y}`)){
                cls = 'selectedHorizontalWall'
            }else cls = 'horizontalWall';
        }
        return (
            <div 
            className={cls} 
            onClick={()=> clickWall(x,y)}
            key = {`W${x}${y}`}
            ></div>)
    },
    box = (i,j)=> {
        return (<div 
            className={next?.includes(`${i}${j}`) ? 'next' : 'box'}
            key={`B${i}${j}`} 
            onClick={()=> clickBox(i,j)}
            >
                {selected?.position===`B${i}${j}` ? <LensIcon className='pawn'/> : <></>}
                {opponentPawn?.position===`B${i}${j}` ? <LensIcon className='opponentPawn'/> : <></>}
            </div>)
    }, 
    clearBoard = ()=> {
        if(gameData?.player1.name === playerData.name){
            updateDoc(gameRef, {
                player1:{
                    position : "B64",
                    name: playerData.name,
                    walls: 10
                }
            })
            updateDoc(gameRef, {
            player2:{
                position : "B14",
                name: opponent,
                walls: 10
            }
            })
        }else{
            updateDoc(gameRef, {
                player2:{
                    position : "B14",
                    name: playerData.name,
                    walls: 10
                }
            })
            updateDoc(gameRef, {
            player1:{
                position : "B64",
                name: opponent,
                walls: 10
            }
            })
        }
        updateDoc(gameRef, { wallArray : [] })
        updateDoc(gameRef, { blockedWays : [] })
    };

    return (
        <div className=''>
            <div className={boardType}>
                {dispBoxes()}
            </div>
            <button onClick={()=> clearBoard()}>Clear</button>
            <h1>
            {
                gameData ? gameData.player1.name : null 
            }
            </h1>
        </div>
    );
};

export default Board;