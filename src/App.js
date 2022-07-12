import { useEffect, useState } from 'react';
//contexts
import { PlayerDataContext } from './contexts/playerDataContext';
import { OpponentContext } from './contexts/opponentContext';
//components
import EnterName from './components/enterName';
import PlayerList from './components/playerList';
import RequestBox from './components/requestBox';
import PlayComp from './components/playComp';
//firebase
import db from './Firebase';
import { collection, onSnapshot, query, doc } from 'firebase/firestore';
//functions
import { alertUser, alertUserB } from './functions/unActiveUser';
//styles
import './App.css';


const App = ()=> {
  //states
  const [playerData, setPlayerData] = useState();
  const [opponent, setOpponent] = useState();
  const [currentPlayerName, setCurrentPlayerName] = useState();
  const [requestDailog, setRequestDailog] = useState(false);
  const [requestFrom, setRequestFrom] = useState();
  const [onlinePlayers, setonlinePlayers] = useState();

  //functions
  const 
  addCurrentPlayerName = name=> {
    setCurrentPlayerName(name);
  };
  //life cycle methods
  useEffect(()=> {
    if(playerData){
      console.log(playerData.name)
      const onlinePlayersRef = query(collection(db, 'players'));
      const getonlinePlayers = onSnapshot(onlinePlayersRef, snap=> {
        
        const a = [];
        snap.forEach(doc=> {
          console.log(doc.data())
          if(doc.data().name !== playerData.name) {
            a.push(doc.data());
          } 
        });
        setonlinePlayers(a);
      })
      const docRef = query(doc(db, "players", playerData.name));
        console.log(docRef)
        
        const request = onSnapshot(docRef, snap=> {
          if(snap.data().requestFrom.name){
            setRequestDailog(true);
            setRequestFrom(snap.data().requestFrom)
          }else setRequestFrom(null)
        })
        //set Match
        const playRef = query(doc(db, 'players', playerData.name));
        const checkPlaying = onSnapshot(playRef, snap=> {
          if(snap.data().playingWith){
            if(snap.data().playingWith.name){
              setOpponent(snap.data().playingWith.name);
            }
          }else setOpponent(null);
          
        })
    }
  }, [db, playerData])
  useEffect(()=> {
    if(requestFrom) {
      if(!requestFrom.name) setRequestDailog(false);
    }
  }, [requestFrom])
  return (
    <div className="App">
      <PlayerDataContext.Provider value={[playerData, setPlayerData]}>
      {/* <OpponentContext.Provider value={[opponent, setOpponent]}> */}
      <h1>QUO-REACT-DOR</h1>
      {
        playerData ? 
        <div>
        <h1>Hello {playerData.name}!</h1>
        <PlayerList 
        onlinePlayers={onlinePlayers}
        />
        </div>
        :
        <EnterName addCurrentPlayerName={addCurrentPlayerName}/>
      }
      {
        requestDailog ? 
          <RequestBox 
          requestFrom={requestFrom}
          playerData={playerData}
          /> : <></>
      }
      {
        opponent ?
        <PlayComp opponent={opponent}/>
        : <></>
      }
    {/* </OpponentContext.Provider> */}
    </PlayerDataContext.Provider>
    </div>
  );
}

export default App;
