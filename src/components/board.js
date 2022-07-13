import React, { useState } from 'react';
//styles
import '../styles/board.css'
//icons
import pawn from '../../src/icons/pawn.svg'
import StarsIcon from '@mui/icons-material/Stars';
import LensIcon from '@mui/icons-material/Lens';
const Board = () => {
    //states
    const 
    [selected, setSelected] = useState(),
    [next, setNext] = useState([]),
    [selectedWall, setSelectedWall] = useState([]);
    //functions
    const 
    clickBox = (i,j)=> {
        setSelected(`${i}${j}`);
        let t = `${i-1}${j}`, tr=`${i-1}${j+1}`, r=`${i}${j+1}`, br=`${i+1}${j+1}`, b=`${i+1}${j}`, bl=`${i+1}${j-1}`, l=`${i}${j-1}`, tl=`${i-1}${j-1}`;
        let arr = [t, r, b, l];
        setNext(arr);
    },
    clickWall = (x,y)=> {
        console.log(`${x}${y}`);
        setSelectedWall([...selectedWall, `${x}${y}`]);
    },
    dispBoxes = ()=> {
        let rows = [], i=0;
        for(let x=1; x<=11; x++){
            if(x%2===1) i++ ;
            rows.push(
                <div className='row' key={`R${x}`}>
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
            if(selectedWall.includes(`${x}${y}`)){
                cls = 'selectedVerticalWall'
            }else cls = 'verticalWall';
        }else {
            if(selectedWall.includes(`${x}${y}`)){
                cls = 'selectedHorizontalWall'
            }else cls = 'horizontalWall';
        }
        return (
            <div 
            className={cls} 
            onClick={()=> clickWall(x,y)}
            key = {`${x}${y}`}
            ></div>)
    },
    box = (i,j)=> {
        return (<div 
            className={next.includes(`${i}${j}`) ? 'next' : 'box'}
            key={`${i}${j}`} 
            onClick={()=> clickBox(i,j)}
            >
                {selected===`${i}${j}` ? <LensIcon className='pawn'/> : <></>}
            </div>)
    };

    return (
        <div className='board'>
            {dispBoxes()}
        </div>
    );
};

export default Board;













/*const Board = () => {
    //states
    const 
    [selected, setSelected] = useState(),
    [next, setNext] = useState([]);
    //functions
    const 
    clickBox = (i,j)=> {
        setSelected(`${i}${j}`);
        let t = `${i-1}${j}`, tr=`${i-1}${j+1}`, r=`${i}${j+1}`, br=`${i+1}${j+1}`, b=`${i+1}${j}`, bl=`${i+1}${j-1}`, l=`${i}${j-1}`, tl=`${i-1}${j-1}`;
        let arr = [t, r, b, l];
        setNext(arr);
    },
    dispBoxes = ()=> {
        let rows = [];
        for(let i=1; i<=6; i++){
            rows.push(
                <div className='row' key={`R${i}`}>
                    {boxRow(i)}
                </div>
            )
        }
        return rows;
    },
    boxRow = i=> {
        let row = [];
        for(let j=1; j<=6; j++){
            row.push(
            <div 
            className={next.includes(`${i}${j}`) ? 'next' : 'box'}
            key={`${i}${j}`} 
            onClick={()=> clickBox(i,j)}
            >
                {selected===`${i}${j}` ? <img src={pawn} /> : <></>}
            </div>
            )
        }
        return row;
    },
    wall = ()=> {
        return <div className='horizontalWall'></div>
    }

    return (
        <div className='board'>
            {wall()}
            {dispBoxes()}
        </div>
    );
};

export default Board;
*/