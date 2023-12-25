import React, { useContext, useEffect, useState } from 'react';
//contexts
import { PlayerDataContext } from '../../contexts/playerDataContext';
import { OfflineContext } from '../../contexts/offlineCOntext';
import { GameDataContext } from '../../contexts/gameDataContext';
//components
import Guide from '../guide/Guide';
import WinnerBox from '../winnerBox';
//styles
import '../../styles/playComp.css'

import { Slide, Zoom } from '@mui/material';
import { FaArrowRight } from "react-icons/fa";
import Board from '../board';
import Board2 from './board2';
import { MdFlag } from 'react-icons/md';
import BoardErrorMsg from '../BoardErrorMsg';

const OfflineComp = props => {
    //context
    const [playerData, setPlayerData] = useContext(PlayerDataContext);
    const [offlineMode, setOfflineMode] = useContext(OfflineContext);
    const [gameData, setGameData] = useContext(GameDataContext);
    //states
    const [name1, setName1] = useState(playerData?.name);
    const [name2, setName2] = useState('');
    const[slide, setslide] = useState(false);
    const[zoom, setZoom] = useState(false);
    const[zoomOut, setZoomOut] = useState(true);
    const [wallSwitch, setWallSwitch] = useState(false);
    //variables
    // const {player1,player2} = gameData;
    //life cycle
    useEffect(()=> {
        handleSlide(true);
    },[])
    useEffect(()=> setWallSwitch(false), [gameData]);
    //functions
    const 
    displayInputs = ()=> {

    return (
        <div className='offlineComp'>
            <div className='offlineBar'>
                <span>One Screen 1vs1</span>
                <button className='closeOfflineComp' onClick={()=> setOfflineMode(!offlineMode)}>X</button>
            </div>
            <form onSubmit={(e) => handleSubmit(e)} className="inputForm">
                <input
                    onChange={(e) => setName1(e.target.value)}
                    className="input"
                    id="inputIn"
                    required
                    value={name1}
                    placeholder= {"Player1 Name"}
                    autoComplete='off'
                />
                <div>VS</div>
                
                <input
                    onChange={(e) => setName2(e.target.value)}
                    className="input"
                    id="inputIn"
                    required
                    value={name2}
                    placeholder= {"Player2 Name"}
                    autoComplete='off'
                />
                <button className="arrow" id="arrowIn" type="submit">
                    Start Playing &nbsp;<FaArrowRight />
                </button>
            </form>
        </div>
    )},
    startGame = ()=>{
        setGameData({
            player1: {
                name: name1,
                // position: 'B14',
                position: 'B74',
                walls:12,
                myDirection: ''
            },
            player2: {
                name: name2,
                // position: 'B64',
                position: 'B14',
                walls: 12,
                myDirection: ''
            },
            wallArray : [],
            winner: null,
            loser: null,
            turnNo: 1,
            blockedWays: []
          })
    },
    handleSubmit = e => {
        e.preventDefault();
        startGame();
    },
    handleSlide = val=> {
        setslide(prev=> val)
    },
    displayWallSwitch = (myTurn, data)=> {
        if(myTurn && !gameData?.winner) return(
            <span className='insertWall' 
            onClick={()=> {
                if(data?.walls<=0) return;
                setWallSwitch(!wallSwitch);
            }}>
                {data?.walls<=0 ? <span>Out Of Walls!</span> : <button className=''>Insert Wall {`(${data?.walls})`}</button>}
            </span>
        )
        return <span className='insertWall-disabled'><button className=''>Insert Wall {`(${data?.walls})`}</button></span>
    }
    
    return (<>
        {
            gameData?.winnerName ? 
            <WinnerBox winner={gameData?.winnerName} restart1vs1Game = {startGame}/>
            : null
        }
        {gameData ? 
        <div className='oneOnOneComp'>
            <Slide in={slide} timeout={1000}>
            <div className='opponentInfo' id='opponentInfoOFFLINE'>
                <span className='myInfo2'>
                    <span className='oppoCircle'></span>
                    <span className='oppoInfo'>
                    <span className='infoName' id='infoName2Offline'>
                        {name2}
                        {gameData?.turnNo%2===0 ? <span className='turnIndicator2'></span> : <span className='turnIndicatorDummy'></span>}
                    </span>
                    <span className='wallInfo'>Walls: {gameData?.player2?.walls}</span>
                    </span>
                    {gameData?.turnNo%2===0 && gameData?.errorMsg ? <BoardErrorMsg gameData={gameData} class_name="alertDiv2" /> : null}
                </span>
                {displayWallSwitch(gameData?.turnNo%2===0, gameData?.player2)}
            </div>
            </Slide>
            <Board2 
                wallSwitch={wallSwitch}
            />
            <Slide in={slide} timeout={1000}>
            <div className='myInfo' id='myInfoOFFLINE'>
                    {displayWallSwitch(gameData?.turnNo%2===1, gameData?.player1)}
                    <span className='myInfo2'>
                        <span className='meInfo'>
                        <span className='infoName'>
                        {gameData?.turnNo%2===1 ? <span className='turnIndicator1'></span> :<span className='turnIndicatorDummy'></span>}
                            {name1}
                        </span>
                        <span className='wallInfo'>Walls: {gameData?.player1?.walls}</span>
                        </span>
                        <span className='myCircle'></span>
                        {gameData?.turnNo%2===1 && gameData?.errorMsg ? <BoardErrorMsg gameData={gameData} class_name="alertDiv1" /> : null}
                    </span>
            </div>
            </Slide>
        </div>
        : 
            displayInputs()
        }
    </>)
};

export default OfflineComp;



                {/* <span className='meInfo'>
                <span className='infoName'>
                    {name1}
                </span>
                <span className='wallInfo'>Walls: {gameData?.player1?.walls}</span>
                </span>
                <span className='myCircle'></span> */}