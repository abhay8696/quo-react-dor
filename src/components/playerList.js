import React, { useContext, useEffect, useState } from 'react';
//contexts
import { PlayerDataContext } from '../contexts/playerDataContext';
//firebase
import db from '../Firebase';
import {getDocs, collection, onSnapshot, query, doc, updateDoc} from 'firebase/firestore';

const PlayerList = (props) => {
    //props
    const { currentPlayerName, onlinePlayers } = props;
    //contexts
    const [playerData, setPlayerData] = useContext(PlayerDataContext);
    //states
    //functions
    const sendRequest = async opponent=> {
        const playerRef = doc(db, "players", opponent.name);
        await updateDoc(playerRef, {
            requestFrom: {name: playerData.name}
        })
    }
    

    const dispOnlinePlayers = ()=> {
        let a = []  
        onlinePlayers.forEach(p=> {
            a.push(
                <p onClick={()=> sendRequest(p)} key={p.name}>{p.name}</p>
            )
        })
        
        return a;
    }
    return (
        <div>
            Online Players:
            { onlinePlayers ? dispOnlinePlayers() : <></>}
        </div>
    );
};

export default PlayerList;