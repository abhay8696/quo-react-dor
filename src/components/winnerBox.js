import React, { useContext, useEffect, useState } from 'react';
//firebase
import db from '../Firebase';
import { collection, onSnapshot, query, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
//context
import { PlayerDataContext } from '../contexts/playerDataContext';
import { GameDataContext } from '../contexts/gameDataContext';
import { OfflineContext } from '../contexts/offlineCOntext';
//styles
import '../styles/dailog.css';
//mui

const WinnerBox = (props) => {
    //context
    const [offlineMode, setOfflineMode] = useContext(OfflineContext);
    const [gameData, setGameData] = useContext(GameDataContext);
    
    //props
    const { winner, closeGame, restart1vs1Game } = props;
    
    //functions
    const
    exitMatch = ()=>{
        if(offlineMode){
            setGameData(undefined);
            return setOfflineMode(false);
        }
    }

    return (
        <div className='dailog'>
            <div className='dailogMsg1'>{winner} won!</div>
            <div className='buttons'>
                <button className='exitButton' onClick={exitMatch}>exit</button>
                <button className='exitButton' onClick={restart1vs1Game}>Play Again</button>
            </div>
        </div>
    );
};

export default WinnerBox;