import React from 'react';
import '../styles/introAnimation.css'

const IntroAnimation = () => {
    const 
    dispBoxes = x=> {
        let arr = [];
        for(let i=0; i<50; i++){
            arr.push(<div className={`introBox${x}`} key={i}></div>);
        }
        return arr;
    }
    return (
        <div className='introAnimation'>
            <div className='boxArray1'>
                {dispBoxes(1)}
            </div>
            <div className='circle1'></div>
            <div className='boxArray2'>
                {dispBoxes(2)}
            </div>
            <div className='circle2'></div>
        </div>
    );
};

export default IntroAnimation;