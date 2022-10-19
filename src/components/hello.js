import React, { useEffect, useState } from 'react';
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
    //functions
    const handleChecked = () => {
      setChecked((prev) => true);
    };
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
          <div className='name'>Hello {playerData.name}!</div>
        </Grow>
        <PlayerList 
          onlinePlayers={onlinePlayers}
          />
      </div>
    );
};

export default Hello;