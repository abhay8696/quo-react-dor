import React from 'react';
//components
import Board from './board';
//styles
import '../styles/playComp.css'

const PlayComp = (props) => {
    //props
    const { opponent, exitGame } = props;
    //functions
    
    return (
        <div className='playComp'>
            Playing With: {opponent}
            <Board/>
            <button onClick={()=> exitGame()}>Exit</button>
        </div>
    );
};

export default PlayComp;