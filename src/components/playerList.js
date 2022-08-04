import React, { useContext, useEffect, useState } from 'react';
//contexts
import { PlayerDataContext } from '../contexts/playerDataContext';
//firebase
import db from '../Firebase';
import {getDocs, collection, onSnapshot, query, doc, updateDoc} from 'firebase/firestore';
//styles
import '../styles/playerList.css'
import { MdHourglassEmpty, MdBlock, MdDone } from 'react-icons/md'

const PlayerList = (props) => {
    //props
    const { currentPlayerName, onlinePlayers } = props;
    //contexts
    const [playerData, setPlayerData] = useContext(PlayerDataContext);
    //states
    const [reqTo, setReqTo] = useState();
    //life cycle
    useEffect(()=> {
        const playerSnap = onSnapshot(doc(db, 'players', playerData.name), doc=> {
            setReqTo(doc.data()?.requestTo);
        })

        return ()=> {
            playerSnap();
        }
    }, [])
    useEffect(()=> {
        if(reqTo?.status === 'rejected' || reqTo?.status === 'accepted'){
            setTimeout(() => {
                const playerRef = doc(db, 'players', playerData.name);
                updateDoc(playerRef, {
                    requestTo: {
                        name: null,
                        status: null
                    }
                })
            }, 5000);
        }
    }, [reqTo])
    //functionsreqTo?.status === 'rejected'
    const sendRequest = async opponent=> {
        if(playerData?.playingWith?.name) return console.log('already in the game!!');

        const opponentRef = doc(db, "players", opponent.name);
        const playerRef = doc(db, 'players', playerData.name)
        await updateDoc(opponentRef, {
            requestFrom: {name: playerData.name}
        })
        await updateDoc(playerRef, {
            requestTo: {
                name: opponent.name,
                status: 'pending'
            }
        })
    },
    reqStatus = (name)=> {
        if(name === reqTo?.name){
            if(reqTo.status === 'pending') return(
                <span className='requestSent'>
                    <span className='reqText'>request sent</span>
                    <MdHourglassEmpty/>
                </span>
            )
            if(reqTo.status === 'rejected') return(
                <span className='requestRejected'>
                    <span className='reqText'>request rejected</span>
                    <MdBlock/>
                </span>
            )
            if(reqTo.status === 'accepted') return(
                <span className='requestAccepted'>
                    <span className='reqText'>request accepted</span>
                    <MdDone/>
                </span>
            )
        }
        return null;
    }
    

    const dispOnlinePlayers = ()=> {
        let a = []  
        onlinePlayers.forEach(p=> {
            a.push(
                <div 
                onClick={()=> sendRequest(p)} 
                key={p.name}
                className='playerName'
                >
                        {p.name}
                        {reqStatus(p.name)}
                </div>
            )
        })
        
        return a;
    }
    return (
        <div className='playerList'>
            { onlinePlayers ? dispOnlinePlayers() : <></>}
        </div>
    );
};

export default PlayerList;