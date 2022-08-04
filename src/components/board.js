import React, { useEffect, useState } from 'react';
//firebase
import db from '../Firebase';
import { doc, query, updateDoc } from 'firebase/firestore';
//functions
import { block_boxes_ajacent_to_wall, check_next_collide_with_opponentPawn, clearBoard, clickBox, clickWall, find_box_adjacent_to_wall } from '../functions/boardFunctions';
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
    [myGameData, setMyGameData] = useState(),
    [selected, setSelected] = useState(),
    [next, setNext] = useState(),
    [standingWalls, setStandingWalls] = useState([]),
    [blocked, setBlocked] = useState([]),
    [boardType, setBoardType] = useState('normal'),
    [opponentPawn, setOpponentPawn] = useState(),
    [targetRowOfOpponent, setTargetRowOfOpponent] = useState(1),
    [myTurn, setMyturn] = useState(false);
    //props
    const { gameData, playerData, opponent } = props;
    //life cycle
    useEffect(()=> {
        if(gameData?.player1.name === playerData.name){
            setBoardType('normal');
            setTargetRowOfOpponent(8);
        }else {
            setBoardType('boardInverted');
            setTargetRowOfOpponent(1);
        }

        setGameRef(doc(db, "liveGames", `${gameData?.id}`));
        
        return ()=> {
        }
    }, [])
    useEffect(()=> {
        if(gameData?.player1.name === playerData.name){
            setMyGameData(gameData.player1)
            setSelected(gameData?.player1);
            setOpponentPawn(gameData?.player2);
            if(gameData.turnNo%2 === 1) setMyturn(true);
            if(gameData.turnNo%2 === 0) setMyturn(false);
        }else{
            setMyGameData(gameData.player2)
            setSelected(gameData?.player2);
            setOpponentPawn(gameData?.player1);
            if(gameData.turnNo%2 === 1) setMyturn(false);
            if(gameData.turnNo%2 === 0) setMyturn(true);
        }
        setStandingWalls(gameData?.wallArray);
        setBlocked(gameData?.blockedWays);

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
    
            setNext(block_boxes_ajacent_to_wall({x, y, blocked, gameRef, selected, next}));
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
            if(!blocked?.includes(i)){
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
        setNext(check_next_collide_with_opponentPawn({arr, selected, opponentPawn, blocked}));
    }, [selected])
    //functions
    const 
    dispBoxes = ()=> {
        let rows = [], i=0;
        for(let x=1; x<=15; x++){
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
        for(let l=1; l<=15; l++){
            if(l%2 === 1) j++;
            else y++;
            l%2 === 1 ? row.push(box(i,j)) : row.push(wall(x,y,'v'));
        }
        return row;
    },
    wallRow = (x)=> {
        let row = [];
        for(let y=1; y<=8; y++){
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
            onClick={()=> clickWall({myTurn, x,y, standingWalls, gameData, gameRef, playerData, opponentPawn, blocked, targetRowOfOpponent})}
            key = {`W${x}${y}`}
            ></div>)
    },
    box = (i,j)=> {
        return (<div 
            className={next?.includes(`${i}${j}`) && myTurn ? 'next' : 'box'}
            key={`B${i}${j}`} 
            onClick={()=> clickBox({myTurn ,i, j, gameData, playerData, gameRef, next})}
            >
                <span className='info'></span>
                {selected?.position===`B${i}${j}` ? <LensIcon className='pawn'/> : <></>}
                {opponentPawn?.position===`B${i}${j}` ? <LensIcon className='opponentPawn'/> : <></>}
            </div>)
    };

    return (
        <div className=''>
            <div className={boardType}>
                <div>
                    Walls : {myGameData?.walls}
                </div>
                {dispBoxes()}
            </div>
            <p>{myTurn ? 'Your Turn' : "Opponent's Turn"}</p>
            <button onClick={()=> clearBoard({ gameData, playerData, gameRef, opponent})}>Clear</button>
        </div>
    );
};

export default Board;