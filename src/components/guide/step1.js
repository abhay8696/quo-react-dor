import React, { useEffect, useState } from 'react';
//styles
import '../../styles/guide/step1.css'
//components
import BoardImage from './boardImage';
//mui
import { Grow } from '@mui/material';

const Step1 = props => {
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
        {...(grow ? { timeout: 1000 } : {})}
        >
        <div className='stepBody'>
            <span className='start'>Start Here</span>
            <BoardImage noWalls = {true} start_finish = {true}/>
            <span className='finish'>Finish Here</span>
        </div>
        </Grow>
    );
};

export default Step1;