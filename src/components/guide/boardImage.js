import React, { useEffect, useState } from 'react';
//styles
import '../../styles/guide/boardImage.css'
//icons
import LensIcon from '@mui/icons-material/Lens';
import CloseIcon from '@mui/icons-material/Close';
import { MdCancel } from 'react-icons/md' 

const BoardImage = (props) => {
    //props
    const { start_finish, moves, moves3, walls, moves4, moves5, movesW } = props;
    //states
    //functions
    const
    dispBoxes = ()=> {
        let rows = [], i=0, r;
        for(let x=1; x<=9; x++){
            if(x%2===1){
                i++;
                r = 'iboxRow';
            }else r = 'iwallRow';

            rows.push(
                <div className={r} key={`B${x}`}>
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
        let cls = '';
        cls = display_specific_walls(x,y, type);
        return (
            <div 
            className={cls} 
            key = {`W${x}${y}`}
            onClick={()=> console.log({x,y})}
            >

            {moves5 && (`${x}${y}`===`33` || `${x}$${y}`===`65`) ? <span className='wrong'><MdCancel /></span> : null}
            </div>)
    },
    box = (i,j)=> {
        let boxStyle = 'ibox';
        if((i===1 || i===5) && start_finish){
            boxStyle = 'start_finish'
        }
        if(moves&&(`${i}${j}`===`23` || `${i}${j}`===`34` || `${i}${j}`===`43` || `${i}${j}`===`32`)){
            boxStyle = 'boxHighlighted'
        }
        if((moves4 || moves5)){
            if(`${i}${j}`===`14` || `${i}${j}`===`23` || `${i}${j}`===`42` ||`${i}${j}`===`44`||`${i}${j}`===`53`){
                boxStyle = 'boxHighlighted';
            }
        }
        if(movesW && i===1){
            boxStyle = 'iFinBox1';
        }
        if(movesW && i===5){
            boxStyle = 'iFinBox2';
        }
        return (<div 
            className={boxStyle}
            key={`B${i}${j}`} 
            >
                {dispPawn(`${i}${j}`)}
                {/* <span style={{color:'black'}}>{i}{j}</span> */}
            </div>)
    },
    dispPawn = ij=> {
        if(moves && ij==='33') return <span className='pawn1'><LensIcon /></span>;

        if(moves3 && ij === '42') return <span className='pawn1'><LensIcon /></span>;
        if(moves3 && ij === '13') return <span className='pawn2'><LensIcon /></span>;

        if((moves4 || moves5) && ij === '43') return <span className='pawn1'><LensIcon /></span>;
        if((moves4 || moves5) && ij === '24') return <span className='pawn2'><LensIcon /></span>;

        if(movesW && ij === '12') return <span className='pawn1'><LensIcon /></span>;
        if(movesW && ij === '44') return <span className='pawn2'><LensIcon /></span>;
    },
    display_specific_walls = (x,y, type)=> {
        if(moves3 && (`${x}${y}`===`12` || `${x}${y}`===`23` || `${x}`===`6` || `${x}`===`6` || `${x}`===`6`)){
            if(`${x}${y}`===`64` || `${x}${y}`===`65` || `${x}${y}`===`66`) return 'hideHorizontalWall';
            if(type==='v'){
                return 'vertical_wall';
            }else {
                return 'horizontal_wall';
            }
        }

        if((moves4 || moves5 || movesW) && (`${x}${y}`===`14` || `${x}${y}`===`12` || `${x}${y}`===`34` || x===2 || x===4 || x===6)){
            if(`${x}${y}`===`41` || `${x}${y}`===`42` || `${x}${y}`===`43` || `${x}${y}`===`45`) return 'hideHorizontalWall';
            if(`${x}${y}`===`21` || `${x}${y}`===`22` || `${x}${y}`===`24` || `${x}${y}`===`25`) return 'hideHorizontalWall';
            if(`${x}${y}`===`65`) return 'hideHorizontalWall';
            if(type==='v'){
                return 'vertical_wall';
            }else {
                return 'horizontal_wall';
            }
        }

        if(moves5 && `${x}${y}`===`33`){
            if(type==='v'){
                return 'wrong_v_wall';
            }else {
                return 'wrong_h_wall';
            }
        }
    };
    return (
        <div className='boardImage'>
            {dispBoxes()}
        </div>
    );
};

export default BoardImage;