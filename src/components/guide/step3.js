import React, { useEffect, useState } from 'react';
//styles
import '../../styles/guide/step3.css'
//components
import BoardImage from './boardImage';
//mui
import { Grow } from '@mui/material';

const Step3 = props => {
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
        {...(grow ? { timeout: 2000 } : {})}
        >
            <div className='step3Body'>
                <span className='text'>Use Walls As Obstacles For Opponent</span>
                <BoardImage moves3={true}/>
            </div>
        </Grow>
    );
};

export default Step3;