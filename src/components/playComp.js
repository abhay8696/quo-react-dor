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
import OpponentQuit from './opponentQuit';
//styles
import '../styles/playComp.css'

const PlayComp = (props) => {
    //states
    const [opponentExit, setOpponentExit] = useState(null);
    //context
    const [playerData, setplayerData] = useContext(PlayerDataContext);
    //props
    const { opponent, exitGame , gameData, updateGameData} = props;
    //life cycle
    useEffect(()=> {
        let unsub = onSnapshot(doc(db, "liveGames", `${gameData?.id}`), (doc) => {
            updateGameData(doc.data())
        });
        let checkExit = onSnapshot(doc(db, 'players', playerData.name), doc=> {
            if(doc?.data().exitedByOpponent){
              console.log(`${doc.data().playingWith.name} quit the game`);
              setOpponentExit(doc.data().playingWith.name);
            }
        })


        return()=> {
            unsub();
            checkExit();
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
            <button onClick={()=> exitGame()}>Surrender</button>
            </>
            : 
            <h1>Loading Game</h1>
        }
        {
          opponentExit ? <OpponentQuit name = {opponentExit} exitGame={exitGame}/> : null
        }
        </div>
    );
};

export default PlayComp;