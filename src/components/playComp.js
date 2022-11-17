import React, { useEffect, useContext, useState } from 'react';
//context
import { PlayerDataContext } from '../contexts/playerDataContext';
//functions
import { getHash } from '../functions/helperFunctions';
//firebase
import db from '../Firebase';
import { collection, doc, getDocs, onSnapshot, query } from 'firebase/firestore';
//components
import Board from './board';
import OpponentQuit from './opponentQuit';
//styles
import '../styles/playComp.css'
import { MdFlag } from 'react-icons/md';
import { Slide, Zoom } from '@mui/material';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import WinnerBox from './winnerBox';

const PlayComp = (props) => {
    //states
    const 
    [opponentExit, setOpponentExit] = useState(null),
    [myGameData, setMyGameData] = useState(),
    [opponentData, setopponentData] = useState(),
    [myTurn, setMyturn] = useState(false),
    [slide, setslide] = useState(false),
    [zoom, setZoom] = useState(false),
    [zoomOut, setZoomOut] = useState(true),
    [wallSwitch, setWallSwitch] = useState(false),
    [getGameTimer, setGetGameTimer] = useState(), 
    [winner, setWinner] = useState();
    //context
    const [playerData, setplayerData] = useContext(PlayerDataContext);
    //props
    const { opponent, exitMatch , gameData, updateGameData} = props;
    //life cycle
    useEffect(()=> {
        let checkExit = onSnapshot(doc(db, 'players', playerData.name), doc=> {
            if(doc?.data().exitedByOpponent && playerData?.playingWith?.name){
              console.log(`${doc.data().playingWith.name} quit the game`);
              setOpponentExit(doc.data().playingWith.name);
            }
        })
        if(!gameData) getGame();
        handleSlide(true);
        handleZoom(true);
        return()=> {
            // unsub();
            checkExit();
            updateGameData(null);
        }
    }, [])
    useEffect(()=> {
        setWallSwitch(false);
        if(gameData){
            handleZoomOut();
        }
        if(gameData?.winner){
            setWinner(gameData?.winner);
        }
        if(gameData && getGameTimer) {
            console.log('clearing time out!!!!!!!!!')
            setGetGameTimer(clearTimeout(getGameTimer));
        }
        if(gameData?.player1.name === playerData?.name){
            setMyGameData(gameData?.player1);
            setopponentData(gameData?.player2);
            if(gameData?.turnNo){
                if(gameData.turnNo%2 === 1) setMyturn(true);
                if(gameData.turnNo%2 === 0) setMyturn(false);
            }
        }else{
            setMyGameData(gameData?.player2);
            setopponentData(gameData?.player1);
            if(gameData?.turnNo){
                if(gameData.turnNo%2 === 1) setMyturn(false);
                if(gameData.turnNo%2 === 0) setMyturn(true);
            }
        }
    }, [gameData])
    //functions
    const getGame = async ()=> {
        console.log('getting game');
        let d;
        const t = setTimeout(async () => {
            const gameRef = collection(db, 'liveGames');
            const snap = await getDocs(gameRef);
            console.log(snap)
            snap.forEach(doc=> {
                console.log(doc.data());
                if(Number(doc.id) === getHash(playerData.name, opponent) ){
                    updateGameData(doc.data());
                    d = doc.data();
                }
            });
        }, 2000);
        setGetGameTimer(t);
    },
    closeGame = ()=> {
        return exitMatch(true, 'from winner box');
    },
    handleSlide = val=> {
        setslide(prev=> val)
    },
    handleZoom = val=> {
        setZoom((prev) => val);
    },
    handleZoomOut = ()=> setZoomOut(prev=> false),
    displayWallSwitch = ()=> {
        if(myTurn) return(
            <span className='insertWall' 
            onClick={()=> {
                if(myGameData?.walls<=0) return;
                setWallSwitch(!wallSwitch);
            }}>
                {myGameData?.walls<=0 ? <span>Out Of Walls!</span> : <span>Insert Wall {`(${myGameData?.walls})`}</span>}
            </span>
        )
        return <span></span>
    }

    return (
        <>
        <div className='playComp'>
        {
            winner ? <WinnerBox winner={winner} closeGame={closeGame}/>
            : null}

        {
            gameData ?
            <>
            <Zoom in={zoomOut}
            style={{ transformOrigin: '0 0 0' }}
            {...(zoomOut ? { timeout: 0 } : {})}>
                <div className='loadingDiv'>
                    <DownloadForOfflineIcon/>
                    <span>loading game</span>
                </div>
            </Zoom>
            <Slide in={slide} timeout={1000}>
            <div className='opponentInfo'>
                <span className='opponentInfo2'>
                <span className='oppoCircle'></span>
                <span className='oppoInfo'>
                <span className='infoName'>
                    {opponent}
                    {!myTurn ? <span className='turnIndicator2'></span> : null}
                </span>
                <span className='wallInfo'>Walls: {opponentData?.walls}</span>
                </span>
                </span>
                <span id='dummySpan'></span>
            </div>
            </Slide>
            <Board 
            gameData={gameData} 
            opponent={opponent} 
            playerData={playerData} 
            myTurn={myTurn}
            updateGameData={updateGameData}
            winner={winner}
            wallSwitch={wallSwitch}
            />
            <Slide in={slide} timeout={500}>
                <div className='myInfo' id='myInfoOnline'>
                    {displayWallSwitch()}
                    <span className='myInfo2'>
                    <span className='meInfo'>
                    <span className='infoName'>
                        {myTurn ? <span className='turnIndicator1'></span> : null}
                        {playerData?.name}
                    </span>
                    <span className='wallInfo'>Walls: {myGameData?.walls}</span>
                    </span>
                    <span className='myCircle'></span>
                    </span>
                </div>
            </Slide>
            </>
            : 
            <Zoom in={zoom}>
                <div className='loadingDiv'>
                    <DownloadForOfflineIcon/>
                    <span>loading game</span>
                </div>
            </Zoom>
        }
        {
          opponentExit ? <OpponentQuit name = {opponentExit} exitMatch={exitMatch} /> : null
        }
        </div>
        </>
    );
};

export default PlayComp;




{/* 
        <button onClick={()=> exitMatch(true, 'from board')} className='giveUp'>
            give up
            <MdFlag/>
        </button> */}