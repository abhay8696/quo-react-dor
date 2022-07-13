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
    };

    return (
        <div className='board'>
            {dispBoxes()}
        </div>
    );
};

export default Board;