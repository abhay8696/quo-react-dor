import React from 'react';
import Step1 from './step1';

const Guide = () => {
    return (
        <div>
            <h2>How To Play?</h2>
            <Step1/>
            <div>
                <h4>Move Your Pawn Like This</h4>
            </div>
            <div>
                <h4>Use Walls As Obstacles For Your Opponent </h4>
            </div>
            <div>
                <h4>Pawn Cannot Pass through Walls</h4>
            </div>
            <div>
                <h4>You Cannot Block Pawn Completely From Opposite Side</h4>
            </div>
            <div>
                <h4>First Player To Reach Opposite Side Wins!</h4>
            </div>
        </div>
    );
};

export default Guide;