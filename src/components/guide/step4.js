import React, { useEffect, useState } from 'react';
//styles
import '../../styles/guide/step4.css'
//components
import BoardImage from './boardImage';
//mui
import { Grow } from '@mui/material';

const Step4 = props => {
    const { disappearThis } = props;
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
        in={disappearThis ? null : grow}
        style={{ transformOrigin: '0 0 0' }}
        {...(grow ? { timeout: 2500 } : {})}
        >
            <div className='step4Body'>
                <BoardImage moves4={true}/>
                <span className='text4'>Pawn Cannot Pass Through Walls</span>
            </div>
        </Grow>
    );
};

export default Step4;