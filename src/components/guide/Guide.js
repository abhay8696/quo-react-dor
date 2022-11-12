import React, { useEffect, useState } from 'react';
//styles
import '../../styles/guide/guide.css'
//mui
import { Grow } from '@mui/material';
import BoardImage from './boardImage';

const Guide = props => {
    const { disappearThis } = props;
    //states
    const [grow, setGrow] = useState(false);
    const [grow1, setGrow1] = useState(false);

    //life cycle
    useEffect(()=> {
        const t = setTimeout(() => {
            handleGrow(true);
            handleGrow1(true);
        }, 1000);
        return ()=> clearTimeout(t);
    }, [])

    const texts = [
        '',
        'Start At One End And Reach Other',
        'Coin/Pawn Can Move One Step In Adjacent Sqaures',
        'Use Walls As Obstacles For Opponent',
        'Coin/Pawn Cannot Pass Through Walls',
        'Coin/Pawn Should Have Atleast One Way To Reach Destination',
        'First Coin/Pawn To Reach Opposite Side Wins!',
    ]
    const boardArray = [
        '',
        <BoardImage noWalls = {true} start_finish = {true}/>,
        <BoardImage noWalls = {true} moves = {true}/>,
        <BoardImage moves3={true}/>,
        <BoardImage moves4={true}/>,
        <BoardImage moves5={true}/>,
        <BoardImage movesW={true}/>
    ]
    const handleGrow = val=> {
        setGrow(prev=> val);
    }
    const handleGrow1 = val=> {
        setGrow1(prev=> val);
    }
    const showBoards = ()=> {
        let arr = [];
        for(let i=1; i<=6; i++){
            arr.push(
                <Grow
                in={grow1}
                style={{ transformOrigin: '0 0 0' }}
                {...(grow1 ? { timeout: 1000 } : {})}
                >
                    <div className='stepBody'>
                        {boardArray[i]}
                        <span className='text'>{texts[i]}</span>
                    </div>
                </Grow>
            )
        }
        return arr;
    }
    return (
        
        <div className='guide'>
            <Grow
            in={grow}
            style={{ transformOrigin: '0 0 0' }}
            {...(grow ? { timeout: 100 } : {})}
            >
                <div className='howToPlay'>How To Play?</div>
            </Grow>
            <div className='guideBody'>
                {showBoards()}
            </div>
        </div>
    );
};

export default Guide;



// <Step1 disappearThis={disappearThis}/>
// <Step2 disappearThis={disappearThis}/>
// <Step3 disappearThis={disappearThis}/>
// <Step4 disappearThis={disappearThis}/>
// <div className='combinedSteps'>
// </div>
// <Step5/>
// <StepWinner/>