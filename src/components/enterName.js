import React, { useState } from 'react';
//firebase
import db from '../Firebase';
import { addDoc, collection, getDoc, getDocs} from 'firebase/firestore';

const EnterName = (props) => {
    //props
    const { addCurrentPlayerName } = props;
    //states
    const [name, setName] = useState();

    const fun = async ()=> {
        const querySnapshot = await getDocs(collection(db, "players"));
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
        });
    }
    
      const create = ()=> {
        if(!name || name.length <= 0) return alert('empty');
        const docRef = addDoc(collection(db, 'players'), {
        name: name
        })
        addCurrentPlayerName(name);
      }
    return (
        <div>
            <input onChange={e=> setName(e.target.value)}/>
            <h1 onClick={()=> create()}>{'---->'}</h1>
        </div>
    );
};

export default EnterName;