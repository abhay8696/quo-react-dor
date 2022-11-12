import React, { useEffect, useState } from 'react';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import Step4 from './step4';
import Step5 from './step5';
import StepWinner from './stepWinner';
//styles
import '../../styles/guide/guide.css'
//mui
import { Grow } from '@mui/material';

const Guide = props => {
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
        
        <div className='guide'>
            <Grow
            in={grow}
            style={{ transformOrigin: '0 0 0' }}
            {...(grow ? { timeout: 500 } : {})}
            >
                <div className='header'>How To Play?</div>
            </Grow>
            <div className='guideBody'>
                {/* <Step1 disappearThis={disappearThis}/>
                <Step2 disappearThis={disappearThis}/>
                <div className='combinedSteps'>
                    <Step3 disappearThis={disappearThis}/>
                    <Step4 disappearThis={disappearThis}/>
                </div>
                <Step5/>
                <StepWinner/> */}
            </div>
        </div>
    );
};

export default Guide;