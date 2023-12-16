import React, { useEffect, useRef, useState } from 'react';
import PlayerList from './playerList';
//styles
import '../styles/hello.css'
//mui
import { Slide, Grow } from '@mui/material';

const Hello = props => {
    //props
    const { playerData, onlinePlayers } = props;
    //states
    const [checked, setChecked] = useState(false);
    const [playOn, setPlayOn] = useState(false);
    //ref
    const textAlign = useRef(null);
    //functions
    const handleChecked = () => {
      setChecked((prev) => true);
    };
    const togglePlay = ()=> {
      setPlayOn(!playOn);
      textAlign.current = 'goLeft'
    }
    //life cycle
    useEffect(()=> {
      handleChecked();
    }, [])
    return (
      <div className='hello'>
        <Grow
          in={checked}
          style={{ transformOrigin: '0 0 0' }}
          {...(checked ? { timeout: 500 } : {})}
        >
          <div className={`name ${textAlign.current}`}>Hello {playerData.name}!</div>
        </Grow>
        {
          playOn ? <PlayerList onlinePlayers={onlinePlayers}/> : 
          <div className='playButtonWrapper'>
            <button onClick={togglePlay}>Play</button>
          </div>
        }
      </div>
    );
};

export default Hello;