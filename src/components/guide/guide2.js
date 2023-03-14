import React, { useEffect, useState } from 'react';
//styles
import '../../styles/guide/guide2.css'
//mui
import { Grow } from '@mui/material';
import BoardImage from './boardImage';
// assets
import demo1 from '../../assets/demo1.png'
import demo2 from '../../assets/demo2.png'
import demo3 from '../../assets/demo3.webm'
import demo4 from '../../assets/demo4.png'
import demo5 from '../../assets/demo5.png'

const Guide2 = props => {
    const { disappearThis } = props;
    //states
    const [demoNo, setDemoNo] = useState();

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
    ],
    boardImages = ['', demo1, demo2, demo3, demo4, demo5];
    // functions
    const
    displayHowToPlay = ()=> {
        if(demoNo) return null;
        return(
            <div className='guideTitle' onClick={()=> setDemoNo(1)}>
                <span>How To Play? Click here.</span>
                <span className='introCube' style={{opacity:0}}></span>
            </div>
        )
    },
    guideIntro = ()=>{ 
        if(demoNo) return null;
        return(
            <div className='guideIntro'>
                <div className='guideTitle'>
                    <span className='introCube'></span>
                    <span style={{opacity:0}}>How To Play? Click here.</span>
                </div>
            </div>
        )
    },
    displayDemos = ()=> {
        if(!demoNo) return null;
        // return <h1>DEMOS</h1>
        let arr = [];
        for(let i=1; i<boardArray.length; i++){
            arr.push(
                <section 
                className={`demo${i} demo`} 
                key={`demo${i}`}
                id={`demo${i}`}
                >
                    <img src={boardImages[i]}/>
            <div className='demoButtons'>
                {
                i > 1 ? 
                <a href={`#demo${i-1}`} className='demoButton1 demoButton'><button>Previous</button></a>
                : <span></span>
                }
                {
                i <= 4 ? 
                <a href={`#demo${i+1}`} className='demoButton2 demoButton'><button>Next</button></a>
                : <span></span>
                }
            </div>
                </section>
            )
        }
        return <div className='demoCarousel'>{arr}</div>
    }
    return (
        
        <div className='guide2'>
            {displayHowToPlay()}
            {guideIntro()}
            {displayDemos()}
        </div>
    );
};

export default Guide2;