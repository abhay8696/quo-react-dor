import React, { useEffect, useState } from 'react';
//firebase
import db from '../Firebase';
import {getDocs, collection, onSnapshot, query} from 'firebase/firestore';

const PlayerList = (props) => {
    //props
    const { currentPlayerName, addOpponent, addPlayerData } = props;
    //states
    const [players, setPlayers] = useState();
    useEffect(()=> {
    //     console.log('aaaaaaa')
    //     fun();
        const playersRef = query(collection(db, 'players'));
        const getPlayers = onSnapshot(playersRef, snap=> {
            console.log('realtime')
            const a = [];
            snap.forEach(doc=> {
                a.push({name: doc.data().name, id: doc.id});
                if(doc.data().name === currentPlayerName) addPlayerData({name: doc.data().name, id: doc.id});
            });
            setPlayers(a);
        })
    }, [db])

    

    const dispPlayers = ()=> {
        let a = []  
        players.forEach(p=> {
            if(currentPlayerName !== p.name) a.push(
                <p onClick={()=> addOpponent(p)}>{p.name}</p>
            )
        })
        
        return a;
    }
    return (
        <div>
            Online Players:
            { players ? dispPlayers() : <></>}
        </div>
    );
};

export default PlayerList;