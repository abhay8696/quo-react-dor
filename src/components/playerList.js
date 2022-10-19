import React, { useContext, useEffect, useState } from 'react';
//contexts
import { PlayerDataContext } from '../contexts/playerDataContext';
import { OfflineContext } from '../contexts/offlineCOntext';
//firebase
import db from '../Firebase';
import {getDocs, collection, onSnapshot, query, doc, updateDoc} from 'firebase/firestore';
//styles
import '../styles/playerList.css'
import { MdHourglassEmpty, MdBlock, MdDone } from 'react-icons/md'

const PlayerList = (props) => {
    //props
    const { currentPlayerName, onlinePlayers, offline } = props;
    //contexts
    const [playerData, setPlayerData] = useContext(PlayerDataContext);
    const [offlineMode, setOfflineMode] = useContext(OfflineContext);
    //states
    const [reqTo, setReqTo] = useState();
    const [reqTimeOut, setReqTimeOut] = useState();
    const [cancelRequestTimeOut, setCancelRequestTimeOut] = useState(false);
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
        let t;
        if(reqTo?.status === null && reqTimeOut){
            clearTimeout(reqTimeOut);
            setReqTimeOut(undefined);
        }
        if(reqTo?.status === 'cancelled' || reqTo?.status === 'rejected' || reqTo?.status === 'accepted'){
            t = setTimeout(() => {
                const playerRef = doc(db, 'players', playerData.name);
                updateDoc(playerRef, {
                    requestTo: {
                        name: null,
                        status: null
                    }
                })
            }, 5000);
            setReqTimeOut(t);
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
    cancelRequest = async opponent=> {
        console.log(opponent);
        if(!opponent) return;
        const opponentRef = doc(db, "players", opponent);
        const playerDataRef = doc(db, "players", playerData.name);
        await updateDoc(opponentRef, {
            requestFrom: {name: null}
        })
        //updateDoc of requester. add object replyToRequestBy = {name, hasAccepted  }
        await updateDoc(playerDataRef, {
            requestTo: {
                name: opponent,
                status: 'cancelled'
            }
        });
        return ;
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
            if(reqTo.status === 'cancelled') return(
                <span className='requestRejected'>
                    <span className='reqText'>request cancelled</span>
                    <MdBlock/>
                </span>
            )
        }
        return null;
    },
    handleClick = p=> {
        if(reqTo?.status === 'pending') return cancelRequest(p.name);
        return sendRequest(p);
    }
    

    const dispOnlinePlayers = ()=> {
        let a = []  
        onlinePlayers.forEach(p=> {
            a.push(
                <div 
                onClick={()=> handleClick(p)} 
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
            <div className='divOffline'>
                <div className='online-offline'>Play Offline</div>
                <div 
                onClick={()=> setOfflineMode(!offlineMode)}
                className='playerName'
                >
                    1 vs 1
                </div>
            </div>
            <div className='online-offline'>Online Players</div>
            { onlinePlayers ? dispOnlinePlayers() : <></>}
        </div>
    );
};

export default PlayerList;