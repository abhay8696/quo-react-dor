import React, { useEffect, useState } from 'react';
//mui
import { Zoom } from '@mui/material';
import LensIcon from '@mui/icons-material/Lens';
//styles
import '../../styles/board.css'
import { block_boxes_ajacent_to_wall } from '../../functions/boardFunctions';
import { boxClassName, clickBox2, clickWall2, updateNext } from '../../functions/board2Functions';


const Board2 = props => {
    //props
    const { gameData, winner, playerData, updateGameData } = props;
    const { player1, player2, turnNo } = gameData;
    const
    [selected1, setSelected1] = useState(),
    [selected2, setSelected2] = useState(),
    [next1, setNext1] = useState(['64','75', '84', '73']),
    [next2, setNext2] = useState(['24', '13', '04', '15']),
    [standingWalls, setStandingWalls] = useState([]),
    [zoom, setZoom] = useState(false),
    [zoom2, setZoom2] = useState(false),
    [targetRowOfP1, setTargetRowOfP1] = useState(0),
    [targetRowOfP2, setTargetRowOfP2] = useState(8);
    //life cycle
    useEffect(()=> {
        handleZoom(true);
        setSelected1(player1?.position);
        setSelected2(player2?.position);
    }, [])
    useEffect(()=> {
        setNext1(updateNext(player1));
        setNext2(updateNext(player2));
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
                let val = clickWall2({x,y,gameData,updateGameData});
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
            className={boxClassName({ i, targetRowOfP1, targetRowOfP2 })}
            onClick={()=>clickBox2({ i, j, player1, player2, turnNo, updateGameData, next1, next2 })}
            >
                {/* <span className='info'>{i}{j}</span> */}
                {
                    next1?.includes(`${i}${j}`) && turnNo%2===1 ?
                    <LensIcon className='next'/> : <></>
                }
                {
                    next2?.includes(`${i}${j}`) && turnNo%2===0 ?
                    <LensIcon className='next2'/> : <></>
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
    }

    return (
        <div className='board'>
            <div className='normal'>
                {dispBoxes()}
            </div>
        </div>
    );
};

export default Board2;