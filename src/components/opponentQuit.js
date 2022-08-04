import React from 'react';
import '../styles/dailog.css'

const OpponentQuit = (props) => {
    const { name, exitGame } = props;

    const time = setTimeout(() => {
        exitGame();
    }, 5000);
    return (
        <div onClick={()=> {
            exitGame(); clearTimeout(time)}
        } className='dailog'>
            <h1>{name} quit the game!</h1>
        </div>
    );
};

export default OpponentQuit;