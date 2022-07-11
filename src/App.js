import './App.css';
import EnterName from './components/enterName';
import PlayerList from './components/playerList';
import { useState } from 'react';

const App = ()=> {
  //states
  const [playerData, setPlayerData] = useState();
  const [currentPlayerName, setCurrentPlayerName] = useState();
  const [opponent, setOpponent] = useState();

  const addPlayerData = data=> {
    console.log('setting player data')
    setPlayerData(data);
  }
  const addCurrentPlayerName = name=> {
    setCurrentPlayerName(name);
  }
  const addOpponent = name=> {
    setOpponent(name);
  }
  return (
    <div className="App">
      <h1>QUO-REACT-DOR</h1>
      {
        currentPlayerName ? 
        <div>
        <h1>Hello {currentPlayerName}!</h1>
        <PlayerList 
        currentPlayerName={currentPlayerName} 
        addOpponent={addOpponent}
        addPlayerData={addPlayerData}
        />
        </div>
        :
        <EnterName addCurrentPlayerName={addCurrentPlayerName}/>
      }
    </div>
  );
}

export default App;
