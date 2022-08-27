import React, { useEffect } from 'react';
import '../styles/dailog.css'

const OpponentQuit = (props) => {
    const { name, exitMatch } = props;

    const time = setTimeout(() => {
        exitMatch(false, 'from time out');
    }, 5000);
    
    useEffect(()=> {
        return ()=> clearTimeout(time);
    }, [])
    return (
        <div onClick={()=> {
            exitMatch(false, 'from dailog')}
        } className='dailog'>
            <h1>{name} quit the game!</h1>
        </div>
    );
};

export default OpponentQuit;