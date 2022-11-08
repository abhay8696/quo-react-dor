import React, { useContext, useEffect, useState } from 'react';
//contexts
import { PlayerDataContext } from '../../contexts/playerDataContext';
//components
import Guide from '../guide/Guide';
//styles
import '../../styles/playComp.css'

import { Slide, Zoom } from '@mui/material';
import { FaArrowRight } from "react-icons/fa";
import Board from '../board';
import Board2 from './board2';
import { MdFlag } from 'react-icons/md';

const OfflineComp = props => {
    const { exitMatch, gameData, updateGameData } = props;
    //context
    const [playerData, setPlayerData] = useContext(PlayerDataContext);
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
            <div className='offlineTitle'>1 VS 1</div>
            <form onSubmit={(e) => handleSubmit(e)} className="form">
                <input
                    onChange={(e) => setName1(e.target.value)}
                    className="input"
                    id="inputIn"
                    required
                    value={name1}
                    placeholder= {"Player1 Name"}
                />
                <div>VS</div>
                
                <input
                    onChange={(e) => setName2(e.target.value)}
                    className="input"
                    id="inputIn"
                    required
                    value={name2}
                    placeholder= {"Player2 Name"}
                />
                <button className="arrow" id="arrowIn" type="submit">
                    <FaArrowRight />
                </button>
            </form>
        </div>
    )},

    handleSubmit = e => {
        e.preventDefault();
        updateGameData({
            player1: {
                name: name1,
                position: 'B74',
                walls:12,
                myDirection: ''
            },
            player2: {
                name: name2,
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
                {data?.walls<=0 ? <span>Out Of Walls!</span> : <span>Insert Wall {`(${data?.walls})`}</span>}
            </span>
        )
        return <span></span>
    }
    
    return (<>
        {gameData ? 
        <div className='oneOnOneComp'>
            <Slide in={slide} timeout={1000}>
            <div className='opponentInfo' id='opponentInfoOFFLINE'>
                <span className='myInfo2'>
                <span className='oppoCircle'></span>
                <span className='oppoInfo'>
                <span className='infoName'>
                    {name2}
                </span>
                <span className='wallInfo'>Walls: {gameData?.player2?.walls}</span>
                </span>
                </span>
                {displayWallSwitch(gameData?.turnNo%2===0, gameData?.player2)}
            </div>
            </Slide>
            <Board2 
                gameData={gameData} 
                playerData={playerData} 
                updateGameData={updateGameData}
                wallSwitch={wallSwitch}
            />
            <Slide in={slide} timeout={1000}>
            <div className='myInfo' id='myInfoOFFLINE'>
                    {displayWallSwitch(gameData?.turnNo%2===1, gameData?.player1)}
                    <span className='myInfo2'>
                    <span className='meInfo'>
                    <span className='infoName'>
                        {name1}
                    </span>
                    <span className='wallInfo'>Walls: {gameData?.player1?.walls}</span>
                    </span>
                    <span className='myCircle'></span>
                    </span>
            </div>
            </Slide>
            <button onClick={()=> exitMatch(true, 'from board')} className='giveUp'>
                Exit Match
                <MdFlag/>
            </button>
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