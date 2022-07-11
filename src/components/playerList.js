import React, { useEffect, useState } from 'react';
//firebase
import db from '../Firebase';
import {getDocs, collection, onSnapshot, query} from 'firebase/firestore';

const PlayerList = (props) => {
    //props
    const { currentPlayerName, addOpponent, addPlayerData } = props;
    //states
    const [onlinePlayers, setonlinePlayers] = useState();
    useEffect(()=> {
    //     console.log('aaaaaaa')
    //     fun();
        const onlinePlayersRef = query(collection(db, 'players'));
        const getonlinePlayers = onSnapshot(onlinePlayersRef, snap=> {
            console.log('realtime')
            const a = [];
            snap.forEach(doc=> {
                
                if(doc.data().name === currentPlayerName) {
                    addPlayerData({name: doc.data().name, id: doc.id});
                }else a.push({name: doc.data().name, id: doc.id});
            });
            setonlinePlayers(a);
        })
    }, [db])

    

    const dispOnlinePlayers = ()=> {
        let a = []  
        onlinePlayers.forEach(p=> {
            if(currentPlayerName !== p.name) a.push(
                <p onClick={()=> addOpponent(p)} key={p.id}>{p.name}</p>
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