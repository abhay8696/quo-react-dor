import React, { useEffect, useState } from 'react';
//mui
import { Zoom } from '@mui/material';
import LensIcon from '@mui/icons-material/Lens';
//styles
import '../../styles/board.css'


const Board2 = props => {
    //props
    const { gameData, winner, playerData } = props;
    const { player1, player2 } = gameData;
    const
    [selected, setSelected] = useState(),
    [selected2, setSelected2] = useState(),
    [standingWalls, setStandingWalls] = useState([]),
    [zoom, setZoom] = useState(false),
    [zoom2, setZoom2] = useState(false),
    [targetRowOfP1, setTargetRowOfP1] = useState(0),
    [targetRowOfP2, setTargetRowOfP2] = useState(8),
    [myTargetRow, setMyTargetRow] = useState(8);
    //life cycle
    useEffect(()=> {

        handleZoom(true);
    }, [])
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
        let cls;
        const t = 50*x+y;
        if(type==='v'){
            if(standingWalls?.includes(`W${x}${y}`)){
                cls = 'selectedVerticalWall'
            }else cls = 'verticalWall';
        }else {
            if(standingWalls?.includes(`W${x}${y}`)){
                cls = 'selectedHorizontalWall'
            }else cls = 'horizontalWall';
        }
        return(
        <Zoom in={zoom} timeout={t} key = {`W${x}${y}`}>
            <div 
            className={cls} 
            onClick={()=> {
                // let val = clickWall({myTurn, x,y, standingWalls, gameData, gameRef, playerData, opponentPawn, blocked, targetRowOfOpponent});
                // console.log(val);
                // setInValidMove(val);
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
            // onClick={()=>{  handleBoxClick(i,j)}}
            >
                {/* <span className='info'>{i}{j}</span> */}
                {
                    // next?.includes(`${i}${j}`) && myTurn ?
                    // <LensIcon className={(i===0 || i===8)?'next2':'next'}/> : <></>
                }
                {player1?.position===`B${i}${j}` ? <LensIcon className='pawn'/> : <></>}
                {player2?.position===`B${i}${j}` ? <LensIcon className='pawn2'/> : <></>}
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
    handleZoom = (val) => {
        setZoom((prev) => val);
    },
    handleZoom2 = (val) => {
        setZoom2((prev) => val);
    },
    boxClassName = (i,j)=> {
        if(i===0 || i===8) {
            if(i === targetRowOfP1){
                return 'targetBox1';
            }
            if(i === targetRowOfP2){
                return 'targetBox2';
            }
        }
        return 'box2';
    };

    return (
        <div className='board'>
            <div className='normal'>
                {dispBoxes()}
            </div>
            {/* <button onClick={()=> clearBoard({ gameData, playerData, gameRef, opponent})}>Clear</button> */}
        </div>
    );
};

export default Board2;