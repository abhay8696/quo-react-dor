import { useEffect, useState } from 'react';
//contexts
import { PlayerDataContext } from './contexts/playerDataContext';
import { OpponentContext } from './contexts/opponentContext';
import { OfflineContext } from './contexts/offlineCOntext';
import { GameDataContext } from './contexts/gameDataContext';
//components
import Hello from './components/hello';
import EnterName from './components/enterName';
import PlayerList from './components/playerList';
import RequestBox from './components/requestBox';
import PlayComp from './components/playComp';
import OpponentQuit from './components/opponentQuit';
import Guide from './components/guide/Guide';
//firebase
import db from './Firebase';
import { collection, onSnapshot, query, doc, updateDoc, getDoc, deleteDoc, getDocs } from 'firebase/firestore';
//functions
import { alertUser, alertUserB } from './functions/unActiveUser';
import { getHash } from './functions/helperFunctions';
//styles
import './App.css';
import { async } from '@firebase/util';
import SideBar from './components/sideBar';
import AppBody from './components/appBody';
import { MdLogout } from 'react-icons/md';


const App = ()=> {
  //states
  const [playerData, setPlayerData] = useState();
  const [offlineMode, setOfflineMode] = useState(false);
  const [requestDailog, setRequestDailog] = useState(false);
  const [requestFrom, setRequestFrom] = useState();
  const [gameData, setGameData] = useState(null);

  //functions
  const 
  toggleRequestDailog = (val, from)=> {
    setRequestDailog(val);
    setRequestFrom(from);
  },
  exitMatch = async (byMe, source)=> {
    if(offlineMode){
        setGameData(undefined);
        return setOfflineMode(false);
    }
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
  logout = ()=> {
    setPlayerData(undefined);
    window.localStorage.setItem("userData", null);
  },
  displayExitButton = ()=>{
    if(!gameData) return <button onClick={()=> logout()} className='signOut'><span>signout</span> <MdLogout/></button>
    return <button onClick={()=> exitMatch(true, 'from appbar')} className='signOut'><span>Exit Game</span> <MdLogout/></button>
  };

  return (
    <div className="App">
      <PlayerDataContext.Provider value={[playerData, setPlayerData]}>
      <OfflineContext.Provider value={[offlineMode, setOfflineMode]}>
      <GameDataContext.Provider value={[gameData, setGameData]}>
        {
          playerData ?
        <>
          <div className='appHead'>
          <span className='appH1'>
            <h1>QUO-REACT-DOR</h1>
            <span className='appCube'></span>
          </span>
          {displayExitButton()}
          {/* <p>A QUORIDOR GAME</p> */}
          </div>
          <AppBody 
            logout = {logout}
            exitMatch={exitMatch}
            toggleRequestDailog = {toggleRequestDailog}
          />
        </>
        :
        <div className='body'>
          <EnterName disappear={false}/>
        </div>
        }
        {
          requestDailog ? <RequestBox requestFrom={requestFrom} playerData={playerData} /> : <></>
        }
      </GameDataContext.Provider>
      </OfflineContext.Provider>
      </PlayerDataContext.Provider>
    </div>
  );
}

export default App;



/*
if(playerData){
      const onlinePlayersRef = query(collection(db, 'players'));
      const getonlinePlayers = onSnapshot(onlinePlayersRef, snap=> {
        
        const a = [];
        snap.forEach(doc=> {
          if(doc.data().name !== playerData.name) {
            a.push(doc.data());
          } 
        });
        setonlinePlayers(a);
      })
      const docRef = query(doc(db, "players", playerData.name));
        
        const request = onSnapshot(docRef, snap=> {
          if(snap?.data().requestFrom.name){
            setRequestDailog(true);
            setRequestFrom(snap.data().requestFrom)
          }else setRequestFrom(null)
        })
        //set Match
        const playRef = query(doc(db, 'players', playerData.name));
        const checkPlaying = onSnapshot(playRef, snap=> {
          if(snap.data().playingWith){
            if(snap.data().playingWith.name){
              setPlayerData(snap.data());
              setOpponent(snap.data().playingWith.name);
            }
          }else setOpponent(null);
        })
    } */