import React, { useContext } from 'react';
//firebase
import db from '../Firebase';
import { collection, onSnapshot, query, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
//context
import { PlayerDataContext } from '../contexts/playerDataContext';
// import { OpponentContext } from '../contexts/opponentContext';
//functions
import { getHash } from '../functions/helperFunctions';

const RequestBox = (props) => {
    //context
    const [playerData, setplayerData] = useContext(PlayerDataContext);
    // const [opponent, setOpponent] = useContext(OpponentContext);
    //props
    const { requestFrom } = props;
    //functions
    const
    requestFunc = async val=> {
        if(val){//accept request
            //update my doc
            const playerDataRef = doc(db, "players", playerData.name);
            await updateDoc(playerDataRef, {
                requestFrom: {name: null},
                replyToRequestBy: {hasAccepted: null, name: null},
                playingWith: {name: requestFrom.name}
            })
            //update opponent doc
            const reuesterRef = doc(db, "players", requestFrom.name);
            await updateDoc(reuesterRef, {
                requestFrom: {name: null},
                replyToRequestBy: {hasAccepted: null, name: null},
                playingWith: {name: playerData.name}
            })
            //create new id with hash
            let id = getHash(playerData.name, requestFrom.name);
            //create new game room
            const gameRef = collection(db, 'liveGames');
            await setDoc(doc(gameRef, `${id}`), {
                id: id,
                player1: {
                    name: playerData.name,
                    position: 'B84',
                    walls:12,
                },
                player2: {
                    name: requestFrom.name,
                    position: 'B14',
                    walls: 12
                },
                wallArray : [],
                winner: null,
                loser: null,
                turnNo: 1
              })
            
        }else{ //deny request
            //delete 'requestFrom' object from my doc
            const playerDataRef = doc(db, "players", playerData.name);
            await updateDoc(playerDataRef, {
                requestFrom: {name: null}
            })
            //updateDoc of requester. add object replyToRequestBy = {name, hasAccepted  }
            const reuesterRef = doc(db, "players", requestFrom.name);
            await updateDoc(reuesterRef, {
                replyToRequestBy: {
                    name: playerData.name,
                    hasAccepted: false
                }
            });

        }
    };

    return (
        requestFrom ?
        <div>
            <h1>Request From {requestFrom.name}</h1>
            <button onClick={()=> requestFunc(true)}>Yes</button>
            <button onClick={()=> requestFunc(false)}>No</button>
        </div>
        : <></>
    );
};

export default RequestBox;