import React from 'react';
//styles
import '../../styles/guide/boardImage.css'

const BoardImage = () => {
    //functions
    const
    dispBoxes = ()=> {
        let rows = [], i=0;
        for(let x=1; x<=9; x++){
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
        for(let l=1; l<=9; l++){
            if(l%2 === 1) j++;
            else y++;
            l%2 === 1 ? row.push(box(i,j)) : row.push(wall(x,y,'v'));
        }
        return row;
    },
    wallRow = (x)=> {
        let row = [];
        for(let y=1; y<=5; y++){
            row.push(wall(x,y,'h'));
        }
        return row;
    },
    wall = (x,y, type)=> {
        let cls;
        if(type==='v'){
            cls = 'verticalWall';
        }else {
            cls = 'horizontalWall';
        }
        return (
            <div 
            className={cls} 
            key = {`W${x}${y}`}
            ></div>)
    },
    box = (i,j)=> {
        return (<div 
            className='box'
            key={`B${i}${j}`} 
            >
            </div>)
    };
    return (
        <div className='boardImage'>
            {dispBoxes()}
        </div>
    );
};

export default BoardImage;