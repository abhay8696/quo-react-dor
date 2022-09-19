import { useEffect, useState } from 'react';
//contexts
import { PlayerDataContext } from './contexts/playerDataContext';
import { OpponentContext } from './contexts/opponentContext';
import { OfflineContext } from './contexts/offlineCOntext';
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


const App = ()=> {
  //states
  const [playerData, setPlayerData] = useState();
  const [offlineMode, setOfflineMode] = useState(false);
  const [opponent, setOpponent] = useState();
  const [requestDailog, setRequestDailog] = useState(false);
  const [requestFrom, setRequestFrom] = useState();

  //functions
  const 
  toggleRequestDailog = (val, from)=> {
    setRequestDailog(val);
    setRequestFrom(from);
  },
  exitGame = async (exitByMe, source)=> {
    console.log('exit called from' + source);
    setOpponent(null);
    //update playingWith on db
    const playerRef = doc(db, "players", playerData.name);
    await updateDoc(playerRef, {
        playingWith: {name: null}
    })
    if(opponent && exitByMe){
      const opponentRef = doc(db, "players", opponent)
      await updateDoc(opponentRef, {
        exitedByOpponent: true
      })
    }
    //reset playerData
    const docRef = doc(db, 'players', playerData.name);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setPlayerData(docSnap.data());
    }
    //
  },
  logout = ()=> {
    setPlayerData(undefined);
    window.localStorage.setItem("userData", null);
  };

  return (
    <div className="App">
      <PlayerDataContext.Provider value={[playerData, setPlayerData]}>
      <OfflineContext.Provider value={[offlineMode, setOfflineMode]}>
        <div className='appHead'>
        <h1>QUO-REACT-DOR</h1>
        {/* <p>A QUORIDOR GAME</p> */}
        </div>
        {
          playerData ?
        <AppBody 
          logout = {logout}
          opponent = {opponent}
          exitGame = {exitGame}
          toggleRequestDailog = {toggleRequestDailog}
        />
        :
        <div className='body'>
          <EnterName disappear={false}/>
        </div>
        }
        {
          requestDailog ? <RequestBox requestFrom={requestFrom} playerData={playerData} /> : <></>
        }
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