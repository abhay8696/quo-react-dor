import React, { useContext, useEffect, useState } from 'react';
//context
import { GameDataContext } from '../../contexts/gameDataContext';
//mui
import { Zoom } from '@mui/material';
import LensIcon from '@mui/icons-material/Lens';
//styles
import '../../styles/board.css'
import { block_boxes_ajacent_to_wall, check_next_collide_with_opponentPawn } from '../../functions/boardFunctions';
import { boxClassName, checkWinner, clickBox2, clickWall2, updateNext, wallClassName } from '../../functions/board2Functions';


const Board2 = props => {
    //props
    const { winner, playerData, wallSwitch } = props;
    //context
    const [gameData, setGameData] = useContext(GameDataContext);
    //states
    const
    [next1, setNext1] = useState(['64','75', '84', '73']),
    [next2, setNext2] = useState(['24', '13', '04', '15']),
    [zoom, setZoom] = useState(false),
    [zoom2, setZoom2] = useState(false),
    [targetRowOfP1, setTargetRowOfP1] = useState(0),
    [targetRowOfP2, setTargetRowOfP2] = useState(8),
    [blocked, setBlocked] = useState([]);
    //life cycle
    useEffect(()=> {
        handleZoom(true);
    }, [])

    const updateGameData = dataObject=> {
        if(dataObject){
            setGameData(dataObject)
        };
    }
    const { player1, player2, turnNo } = gameData;
    useEffect(()=> {
        setNext1(updateNext(player1, gameData?.blockedWays, player2?.position));
        setNext2(updateNext(player2, gameData?.blockedWays, player1?.position));
        if(!gameData?.winner){ 
            checkWinner({
                position1: player1?.position,
                target1: targetRowOfP1,
                position2: player2?.position,
                target2: targetRowOfP2,
                gameData,
                updateGameData
            })
        }else{ 
            handleZoom2(true);
        }; 
    }, [gameData])
    //functions
    const 
    dispBoxes = ()=> {
        let rows = [], i=0;
        for(let x=0; x<=16; x++){
            if(x%2===1) i++ ;
            
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
        const t = 50*x+y;
        let wallArray = gameData?.wallArray;
        return(
        <Zoom in={zoom} timeout={t} key = {`W${x}${y}`}>
            <div 
            className={wallClassName({x,y,type,wallArray, wallSwitch})} 
            onClick={()=> {
                if(!wallSwitch) return;
                clickWall2({x,y,gameData,updateGameData,targetRowOfP1,targetRowOfP2})
            }}
            ></div>
        </Zoom>
        )
    },
    box = (i,j)=> {
        let t = 250*i+j, animeDelay;
        let oldPosition;
        gameData?.winner===1 ? animeDelay = i*100 : animeDelay = (8-i)*100;

        if(turnNo%2===1) oldPosition = gameData?.player1?.position;
        else oldPosition = gameData?.player2?.position;
        return (
        <Zoom in={zoom} timeout={t} key={`B${i}${j}`} >
        {
        !gameData?.winner ?
            <div 
            className={boxClassName({ i, j, targetRowOfP1, targetRowOfP2, next1, next2, turnNo })}
            onClick={()=>clickBox2({ i, j, gameData, updateGameData, next1, next2, oldPosition })}
            >
                {/* <span className='info'>{i}{j}</span> */}
                {/* {
                    next1?.includes(`${i}${j}`) && turnNo%2===1 ?
                    <LensIcon className='next'/> : <></>
                }
                {
                    next2?.includes(`${i}${j}`) && turnNo%2===0 ?
                    <LensIcon className='next2'/> : <></>
                } */}
                {player1?.position===`B${i}${j}` ? <LensIcon className='pawn' id={`${player1?.myDirection}1`}/> : <></>}
                {player2?.position===`B${i}${j}` ? <LensIcon className='opponentPawn' id={`${player2?.myDirection}2`}/> : <></>}
            </div>
        :
            <>
            <div 
            className={gameData?.winner===1 ? 'winnerBox1 winnerBoxAppear' : 'winnerBox2 winnerBoxAppear'}
            style={{animationDelay: `${animeDelay}ms`}}
            >
            </div>
            </>
        }
        </Zoom>
        )
    },
    handleZoom = (val) => {
        setZoom((prev) => val);
    },
    handleZoom2 = (val) => {
        setZoom2((prev) => val);
    }

    return (
        <div className='board' id='board2'>
            <div className='normal'>
                {dispBoxes()}
            </div>
        </div>
    );
};

export default Board2;