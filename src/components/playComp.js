import React, { useEffect, useContext, useState } from 'react';
//context
import { PlayerDataContext } from '../contexts/playerDataContext';
//functions
import { getHash } from '../functions/helperFunctions';
//firebase
import db from '../Firebase';
import { collection, doc, getDocs, onSnapshot, query } from 'firebase/firestore';
//components
import Board from './board';
//styles
import '../styles/playComp.css'

const PlayComp = (props) => {
    //context
    const [playerData, setplayerData] = useContext(PlayerDataContext);
    //props
    const { opponent, exitGame , gameData, updateGameData} = props;
    //life cycle
    useEffect(()=> {
        console.log("Entered PlayComp")

        let unsub = onSnapshot(doc(db, "liveGames", `${gameData?.id}`), (doc) => {
            updateGameData(doc.data())
        });

        return()=> {
            unsub();
        }
    }, [])
    //functions

    return (
        <div className='playComp'>
        {
            gameData ?
            <>
            Playing With: {opponent}
            <Board gameData={gameData} opponent={opponent} playerData={playerData}/>
            <button onClick={()=> exitGame()}>Exit</button>
            </>
            : 
            <h1>Loading Game</h1>
        }
        </div>
    );
};

export default PlayComp;