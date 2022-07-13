import React, { useState } from 'react';
//styles
import '../styles/board.css'
//icons
import pawn from '../../src/icons/pawn.svg'
const Board = () => {
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
        let rows = [], i=0;
        for(let k=1; k<=11; k++){
            if(k%2===1) i++ ;
            rows.push(
                <div className='row' key={`R${k}`}>
                    { k%2 === 1 ? boxRow(i) : wallRow(i) } 
                </div>
            )
        }
        return rows;
    },
    boxRow = i=> {
        let row = [], j=0;
        for(let l=1; l<=11; l++){
            if(l%2 === 1) j++;
            l%2 === 1 ? row.push(box(i,j)) : row.push(verticalWall());
        }
        return row;
    },
    wallRow = (i)=> {
        let row = [];
        for(let m=1; m<=6; m++){
            row.push(horizontalWall());
        }
        return row;
    },
    horizontalWall = ()=> {
        return <div className='horizontalWall'></div>
    },
    verticalWall = ()=> {
        return <div className='verticalWall'></div>
    },
    box = (i,j)=> {
        return (<div 
            className={next.includes(`${i}${j}`) ? 'next' : 'box'}
            key={`${i}${j}`} 
            onClick={()=> clickBox(i,j)}
            >
                {selected===`${i}${j}` ? <img src={pawn} /> : <></>}
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