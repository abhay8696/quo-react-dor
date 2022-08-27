import React, { useEffect, useState } from 'react';
//styles
import '../../styles/guide/step2.css'
//components
import BoardImage from './boardImage';
//mui
import { Grow } from '@mui/material';

const Step2 = () => {
    //states
    const [grow, setGrow] = useState(false);

    //life cycle
    useEffect(()=> {
        const t = setTimeout(() => {
            handleGrow(true);
        }, 1000);
        return ()=> clearTimeout(t);
    }, [])

    const handleGrow = val=> {
        setGrow(prev=> val);
    }
    return (
        <Grow
        in={grow}
        style={{ transformOrigin: '0 0 0' }}
        {...(grow ? { timeout: 1500 } : {})}
        >
            <div className='step2Body'>
                <div className='board'>
                <BoardImage noWalls = {true} moves = {true}/>
                </div>
                <span className='step2_text'>Pawn Can Move One Step In Adjacent Sqaures </span>
                {/* <div className='board'>
                <BoardImage noWalls = {true} moves2 = {true}/>
                </div> */}
            </div>
        </Grow>
    );
};

export default Step2;