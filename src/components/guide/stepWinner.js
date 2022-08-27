import React from 'react';
//styles
import '../../styles/guide/stepWinner.css'
//components
import BoardImage from './boardImage';

const StepWinner = () => {
    return (
        <div className='step_w_body'>
            <BoardImage movesW={true}/>
            <span className='textW'>First Pawn To Reach Opposite Side Wins!</span>
        </div>
    );
};

export default StepWinner;