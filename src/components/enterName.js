import React, { useState, useContext } from 'react';
//contexts
import { PlayerDataContext } from '../contexts/playerDataContext';
//firebase
import db from '../Firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

const EnterName = (props) => {
    //contexts
    const [playerData, setPlayerData] = useContext(PlayerDataContext);
    
    //states
    const [name, setName] = useState();
    //functions
    const getUser = async ()=> {
      // if(!name || name.length <= 0) return alert('empty');
      // const docRef = addDoc(collection(db, 'players'), {
      // name: name
      // })
      const docRef = doc(db, 'players', name);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setPlayerData(docSnap.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        const playersRef = collection(db, 'players')
        await setDoc(doc(playersRef, name), {
          name: name
        })
        setPlayerData({
          name: name
        })
      }
    };

    return (
        <div>
            <input onChange={e=> setName(e.target.value)}/>
            <h1 onClick={()=> getUser()}>{'---->'}</h1>
        </div>
    );
};

export default EnterName;