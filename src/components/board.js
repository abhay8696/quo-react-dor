import React, { useEffect, useState } from 'react';
//firebase
import db from '../Firebase';
import { doc, onSnapshot, query, updateDoc } from 'firebase/firestore';
//functions
import { foundWinner, block_boxes_ajacent_to_wall, check_next_collide_with_opponentPawn, clearBoard, clickBox, clickWall, find_box_adjacent_to_wall, giveDirection } from '../functions/boardFunctions';
//styles
import '../styles/board.css'
//icons
import pawn from '../../src/icons/pawn.svg'
import StarsIcon from '@mui/icons-material/Stars';
import LensIcon from '@mui/icons-material/Lens';
import { Zoom, selectClasses } from '@mui/material';
const Board = (props) => {
    //states
    const 
    [gameRef, setGameRef] = useState(),
    [selected, setSelected] = useState(),
    [next, setNext] = useState(),
    [standingWalls, setStandingWalls] = useState([]),
    [blocked, setBlocked] = useState([]),
    [boardType, setBoardType] = useState('normal'),
    [opponentPawn, setOpponentPawn] = useState(),
    [targetRowOfOpponent, setTargetRowOfOpponent] = useState(),
    [myTargetRow, setMyTargetRow] = useState(8),
    [zoom, setZoom] = useState(false),
    [zoom2, setZoom2] = useState(false),
    [inValidMove, setInValidMove] = useState(false);
    // [winner, setwinner] = useState(false);
    //props
    const { gameData, playerData, opponent, myTurn, updateGameData, winner, wallSwitch } = props;
    //life cycle
    useEffect(()=> {
        let unsub = onSnapshot(doc(db, "liveGames", `${gameData?.id}`), (doc) => {
            console.log('snapshot taken');
            console.log(doc.data());
            updateGameData(doc.data())
        });
        console.log('board mounted')
        if(gameData && playerData){
            if(gameData.player1.name === playerData.name){
                setBoardType('normal');
                setTargetRowOfOpponent(8);
                setMyTargetRow(0);
            }else {
                setBoardType('boardInverted');
                console.log('board normaled')
                setTargetRowOfOpponent(0);
                setMyTargetRow(8);
            }
        }

        handleZoom(true);
        setGameRef(doc(db, "liveGames", `${gameData?.id}`));
        
        return ()=> {
            unsub();
        }
    }, [])
    useEffect(()=> {
        if(gameData?.player1.name === playerData.name){
            setOpponentPawn(gameData?.player2);
            setSelected(gameData?.player1);
            //check if opponent has reached
            if(Number(gameData?.player2?.position.split("")[1]) === targetRowOfOpponent){
                foundWinner({winner:gameData?.player2, gameRef});
            }
        }else{
            setOpponentPawn(gameData?.player1);
            setSelected(gameData?.player2);
            //check if opponent has reached
            if(Number(gameData?.player1?.position.split("")[1]) === targetRowOfOpponent){
                foundWinner({winner:gameData?.player1, gameRef});
            }
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
        if(winner){
            setNext(undefined);
        }else setNext(check_next_collide_with_opponentPawn({arr, selected, opponentPawn, blocked}));
        
    }, [selected])
    useEffect(()=> {
        if(winner){ 
            // handleZoom(false);
            handleZoom2(true);
            console.log(winner);
        }
    }, [winner])
    useEffect(()=> {
        if(inValidMove === true){
            alert("invalid move!", setInValidMove(false));
        }
    }, [inValidMove])
    //functions
    const 
    dispBoxes = ()=> {
        let rows = [], i=0;
        for(let x=0; x<=16; x++){
            if(x%2===1) i++ ;
            // if(x===0 || x===16){
            //     rows.push(
            //         <div className='row' key={`B${x}`}>{boxRow(i,x)}</div>
            //     )
            // }else if(x===14){
            //     rows.push(null);
            // }else{
            // rows.push(
            //     <div className='row' key={`B${x}`}>
            //         { x%2 === 1 ? boxRow(i,x) : wallRow(x) } 
            //     </div>
            // )}
            rows.push(
                <div className='row' key={`B${x}`}>
                    { x%2 === 0 ? boxRow(i,x) : wallRow(x) } 
                </div>
            )
        }
        return rows;
    },
    boxRow = (i,x)=> {
        let row = [], j=0, y=0;
        for(let l=1; l<=13; l++){
            if(l%2 === 1) j++;
            else y = y+1;
            l%2 === 1 ? row.push(box(i,j)) : row.push(wall(x,y,'v'));
        }
        // if(!winner){
        // }else{
        //     for(let l=1; l<=13; l++){
        //         if(l%2 === 1) j++;
        //         else y++;
        //         l%2 === 1 ? row.push(winnerBox(i,j)) : row.push(wall(x,y,'v'));
        //     }
        // }
        return row;
    },
    wallRow = (x)=> {
        let row = [];
        for(let y=1; y<=7; y++){
            row.push(wall(x,y,'h'));
        }
        return row;
    },
    wall = (x,y, type)=> {
        // if(x===0 || x===16) return null;
        let cls;
        const t = 50*x+y;
        if(type==='v'){
            if(standingWalls?.includes(`W${x}${y}`)){
                cls = 'selectedVerticalWall'
            }else if(wallSwitch){
                cls = 'verticalWall';
            }else cls = 'verticalWallInvisible';
        }else {
            if(standingWalls?.includes(`W${x}${y}`)){
                cls = 'selectedHorizontalWall'
            }else if(wallSwitch){
                cls = 'horizontalWall';
            }else cls = 'horizontalWallInvisible';
        }
        return(
        <Zoom in={zoom} timeout={t} key = {`W${x}${y}`}>
            <div 
            className={cls} 
            onClick={()=> {
                if(!wallSwitch) return;
                let val = clickWall({myTurn, x,y, standingWalls, gameData, gameRef, playerData, opponentPawn, blocked, targetRowOfOpponent});
                console.log(val);
                setInValidMove(val);
            }}
            
            ></div>
        </Zoom>
        )
    },
    box = (i,j)=> {
        const t = 250*i+j;
        return (
        <Zoom in={zoom} timeout={t} key={`B${i}${j}`} >
        {
        !winner ?
            <div 
            className={boxClassName(i,j)}
            onClick={()=>{  handleBoxClick(i,j)}}
            >
                {/* <span className='info'>{i}{j}</span> */}
                {
                    // next?.includes(`${i}${j}`) && myTurn ?
                    // <LensIcon className={(i===0 || i===8)?'next2':'next'}/> : <></>
                }
                {selected?.position===`B${i}${j}` ? <LensIcon className='pawn' id={`${selected?.myDirection}1`}/> : <></>}
                {opponentPawn?.position===`B${i}${j}` ? <LensIcon className='opponentPawn' id={`${opponentPawn?.myDirection}2`}/> : <></>}
            </div>
        :
            <>
            <Zoom in={zoom2} timeout={t} key={`B${i}${j}`} >
                <div 
                className={winner===playerData?.name ? 'winnerBox1' : 'winnerBox2'}
                >
                </div>
            </Zoom>
            </>
        }
        </Zoom>
        )
    },
    handleBoxClick = (i,j)=> {
        // if(next?.includes(`${i}${j}`) && myTurn){
        //     setMyDirection(giveDirection({
        //         from: selected?.position, 
        //         to: `B${i}${j}`,
        //         boardType
        //     }));
        // }
        clickBox({myTurn ,i, j, gameData, playerData, gameRef, next, oldPosition: selected?.position});
    },
    handleZoom = (val) => {
        setZoom((prev) => val);
    },
    handleZoom2 = (val) => {
        setZoom2((prev) => val);
    },
    boxClassName = (i,j)=> {
        if(next && next.includes(`${i}${j}`) && myTurn) return 'nextBox1';
        if(i===0 || i===8) {
            if(i === myTargetRow){
                return 'targetBox1';
            }
            if(i === targetRowOfOpponent){
                return 'targetBox2';
            }
        }
        return 'box2';
    }

    return (
        <div className='board' id='board1'>
            <div className={boardType}>
                {dispBoxes()}
            </div>
            {/* <button onClick={()=> clearBoard({ gameData, playerData, gameRef, opponent})}>Clear</button> */}
        </div>
    );
};

export default Board;