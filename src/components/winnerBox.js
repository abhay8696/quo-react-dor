import React, { useContext, useEffect, useState } from 'react';
//firebase
import db from '../Firebase';
import { collection, onSnapshot, query, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
//context
import { PlayerDataContext } from '../contexts/playerDataContext';
//styles
import '../styles/dailog.css'
import { MdDone, MdClose } from 'react-icons/md'
//mui
import { Zoom } from '@mui/material';

const WinnerBox = (props) => {
    //context
    const [playerData, setPlayerData] = useContext(PlayerDataContext);
    //states
    const [checked, setChecked] = useState(false);

    let timeOut;
    // const [opponent, setOpponent] = useContext(OpponentContext);
    //props
    const { winner, closeGame } = props;
    //life cycle
    useEffect(()=> {
        // timeOut = setTimeout(() => {
        //     if(playerData && requestFrom){
        //         handleZoom(false);
        //         reject();
        //     }
        // }, 15000);
        handleZoom(true);
        return ()=> {
            // clearTimeout(timeOut);
        }
    }, [])
    //functions
    const
    handleZoom = (val) => {
        setChecked((prev) => val);
    };

    return (
        <Zoom in={checked}>
        <div className='dailog'>
            <div className='dailogMsg1'>{winner} won!</div>
            <div className='buttons'>
                <button className='exitButton' onClick={()=> {handleZoom(false); closeGame()}}>exit</button>
            </div>
        </div>
        </Zoom>
    );
};

export default WinnerBox;