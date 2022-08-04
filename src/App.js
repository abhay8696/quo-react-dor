import { useEffect, useState } from 'react';
//contexts
import { PlayerDataContext } from './contexts/playerDataContext';
import { OpponentContext } from './contexts/opponentContext';
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


const App = ()=> {
  //states
  const [playerData, setPlayerData] = useState();
  const [opponent, setOpponent] = useState();
  const [currentPlayerName, setCurrentPlayerName] = useState();
  const [requestDailog, setRequestDailog] = useState(false);
  const [requestFrom, setRequestFrom] = useState();
  const [onlinePlayers, setonlinePlayers] = useState();
  const [gameData, setGameData] = useState(null);

  //functions
  const 
  addCurrentPlayerName = name=> {
    setCurrentPlayerName(name);
  },
  exitGame = async (oppo)=> {
    setOpponent(null);
    setGameData(null);
    //update playingWith on db
    const playerRef = doc(db, "players", playerData.name);
    await updateDoc(playerRef, {
        playingWith: {name: null}
    })
    if(opponent){
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
  },
  updateGameData = dataObject=> {
    setGameData(dataObject);
  },
  logout = ()=> {
    setPlayerData(undefined);
    window.localStorage.setItem("userData", null);
  };
  //life cycle methods
  useEffect(()=> {
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
    if(!requestFrom || !requestFrom?.name) setRequestDailog(false);
  }, [requestFrom])
  useEffect(()=> {
    if(opponent){
      console.log('game')
      console.log(opponent)
      console.log('game')
      const gameId = getHash(playerData.name, opponent);
      setTimeout(() => {
        getGame(gameId)
      }, 5000);
    }

  }, [opponent])
  const getGame = async gameId=> {
    console.log('getting game')
    const gameRef = collection(db, 'liveGames');
    const snap = await getDocs(gameRef);
    if(gameId){
      snap.forEach(doc=> {
        if(Number(doc.id) === gameId ) setGameData(doc.data());
      });
    }else console.log(`gameId not found! ${gameId}`)
  }
  return (
    <div className="App">
      <PlayerDataContext.Provider value={[playerData, setPlayerData]}>
      {/* <OpponentContext.Provider value={[opponent, setOpponent]}> */}
      <h1>QUO-REACT-DOR</h1>
      {
        playerData ? 
        <>
        <SideBar  playerData={playerData} onlinePlayers={onlinePlayers} />
        {/* <EnterName addCurrentPlayerName={addCurrentPlayerName} disappear={true} text={playerData.name}/> */}
        <button onClick={()=> logout()}className='logout'>Exit App</button>
        </>
        :
        <EnterName addCurrentPlayerName={addCurrentPlayerName}  disappear={false}/>
      }
      {
        playerData && !opponent ?
        <Guide />
        : null
      }
      {
        requestDailog ? 
          <RequestBox 
          requestFrom={requestFrom}
          playerData={playerData}
          /> : <></>
      }
      {
        opponent && gameData?
        <PlayComp 
        opponent={opponent} 
        exitGame={exitGame} 
        gameData={gameData} 
        updateGameData={updateGameData}
        />
        : <></>
      }
    {/* </OpponentContext.Provider> */}
    </PlayerDataContext.Provider>
    </div>
  );
}

export default App;
