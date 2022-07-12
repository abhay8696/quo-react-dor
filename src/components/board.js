import React from 'react';
import '../styles/board.css'
const Board = () => {

    //functions
    const 
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
            className='box' 
            key={`${i}${j}`} 
            onClick={()=> console.log(`${i}${j}`)}>
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