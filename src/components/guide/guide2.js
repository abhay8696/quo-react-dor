import React, { useEffect, useState } from 'react';
//styles
import '../../styles/guide/guide2.css'
//mui
import { Grow } from '@mui/material';
import BoardImage from './boardImage';

const Guide2 = props => {
    const { disappearThis } = props;
    //states
    const [grow, setGrow] = useState(false);
    const [grow1, setGrow1] = useState(false);

    //life cycle
    

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
    // functions
    const
    guideIntro = ()=> <div className='guideIntro'>
        <div className='guideTitle'>
            <span className='introCube'></span>
            <span style={{opacity:0}}>How To Play? Click here.</span>
        </div>
    </div>
    return (
        
        <div className='guide2'>
            <div className='guideTitle'>
                <span>How To Play? Click here.</span>
                <span className='introCube' style={{opacity:0}}></span>
            </div>
            {guideIntro()}
        </div>
    );
};

export default Guide2;