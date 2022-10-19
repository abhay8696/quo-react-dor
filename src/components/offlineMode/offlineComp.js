import React, { useContext, useState } from 'react';
//contexts
import { PlayerDataContext } from '../../contexts/playerDataContext';
//components
import Guide from '../guide/Guide';
//styles
import '../../styles/enterName.css'

import { FaArrowRight } from "react-icons/fa";
import Board from '../board';
import Board2 from './board2';

const OfflineComp = props => {
    const { exitMatch, gameData, updateGameData } = props;
    //context
    const [playerData, setPlayerData] = useContext(PlayerDataContext);
    //states
    const [name1, setName1] = useState(playerData?.name);
    const [name2, setName2] = useState('');
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
            },
            player2: {
                name: name2,
                position: 'B14',
                walls: 12
            },
            wallArray : [],
            winner: null,
            loser: null,
            turnNo: 1
          })
    };
    
    return (<>
        {gameData ? 
            <Board2 gameData={gameData} playerData={playerData}/>
        : 
            displayInputs()
        }
    </>)
};

export default OfflineComp;