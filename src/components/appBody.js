import React, { useContext, useEffect, useState } from 'react';
//contexts
import { PlayerDataContext } from '../contexts/playerDataContext';
import { OfflineContext } from '../contexts/offlineCOntext';
//components
import EnterName from './enterName';
import Guide from './guide/Guide';
import PlayComp from './playComp';
import SideBar from './sideBar';
//firebase
import db from '../Firebase';
import { collection, onSnapshot, query, doc, updateDoc, getDoc, deleteDoc, getDocs } from 'firebase/firestore';
//icons
import { MdLogout } from 'react-icons/md';

const AppBody = props => {
    //props
    const { logout, opponent, toggleRequestDailog} = props;
    //states
    const [gameData, setGameData] = useState(null);
    //context
    const [playerData, setPlayerData] = useContext(PlayerDataContext);
    const [offlineMode, setOfflineMode] = useContext(OfflineContext);
    //useeffect
    useEffect(()=> {
        // if(playerData){
        const docRef = query(doc(db, "players", playerData.name));
        
        const changes = onSnapshot(docRef, snap=> {
            console.log('changes');
            if(snap?.data().requestFrom.name){
                const from = snap.data().requestFrom;
                toggleRequestDailog(true, from);
            }else toggleRequestDailog(false, null);
            
            if(snap.data()){
                setPlayerData(snap.data());
            }
        })
        return ()=> changes();
        // }
    }, [])
    //functions
    const
    updateGameData = dataObject=> {
        if(dataObject){
            setGameData(dataObject)
        };
    },
    exitMatch = async (byMe, source)=> {
        //update my doc playingwiht: null
        const playerRef = doc(db, "players", playerData.name);
        await updateDoc(playerRef, {
            playingWith: {name: null}
        })
        //byme
        //update oppo's doc exitedByOpponent: true
        if(playerData?.playingWith?.name && byMe){
            console.log('Exit by me');
            const opponentRef = doc(db, "players", playerData?.playingWith?.name)
            await updateDoc(opponentRef, {
            exitedByOpponent: true
            })
        }
        
        //!byMe
        //delete gameData doc from liveGames
        if(!byMe){
            console.log('Exit by opponent');
            console.log(gameData.id);
            if(gameData.id){
                await deleteDoc(doc(db, 'liveGames', `${gameData.id}`));
            }
        }
        setGameData(null);
        console.log(`source: ${source}`);
        
    },

    gameMode = ()=> {
        if(offlineMode || playerData?.playingWith?.name){
            if(offlineMode) return <h1>OFFLINE MODE</h1>
            if(playerData?.playingWith?.name){
                return( <PlayComp 
                opponent={playerData?.playingWith?.name} 
                exitMatch={exitMatch} 
                gameData={gameData} 
                updateGameData={updateGameData}
                />)
            }
        }
        return <Guide/> 
    }
    return (
        <>
        <div className='body'>
            {/* <SideBar  playerData={playerData}/> */}
            {
            !gameData ? 
            <>
            <SideBar  playerData={playerData}/>
            <button onClick={()=> logout()}className='logout'><MdLogout/>signout</button>
            </>
            : null
            }
            {gameMode()}
        </div>
        <EnterName disappear={true} text={playerData.name}/> 
        </>
    );
};

export default AppBody;

/* 

            {
            playerData?.playingWith?.name ? 
            <PlayComp 
                opponent={playerData?.playingWith?.name} 
                exitMatch={exitMatch} 
                gameData={gameData} 
                updateGameData={updateGameData}
            />
            : 
            <Guide opponent={opponent}/> 
            // null
            }
*/