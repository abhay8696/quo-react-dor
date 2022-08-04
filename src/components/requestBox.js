import React, { useContext, useEffect } from 'react';
//firebase
import db from '../Firebase';
import { collection, onSnapshot, query, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
//context
import { PlayerDataContext } from '../contexts/playerDataContext';
// import { OpponentContext } from '../contexts/opponentContext';
//functions
import { getHash } from '../functions/helperFunctions';
//styles
import '../styles/dailog.css'
import { MdDone, MdClose } from 'react-icons/md'

const RequestBox = (props) => {
    //context
    const [playerData, setPlayerData] = useContext(PlayerDataContext);

    let timeOut;
    // const [opponent, setOpponent] = useContext(OpponentContext);
    //props
    const { requestFrom } = props;
    //life cycle
    useEffect(()=> {
        timeOut = setTimeout(() => {
            if(playerData && requestFrom) reject();
        }, 15000);

        return ()=> {
            clearTimeout(timeOut);
        }
    }, [])
    //functions
    const
    requestFunc = async val=> {
        if(val){//accept request
            //update my doc
            const playerDataRef = doc(db, "players", playerData.name);
            await updateDoc(playerDataRef, {
                requestFrom: {name: null},
                playingWith: {name: requestFrom.name},
                exitedByOpponent: null,
                requestTo: {
                    name: null,
                    status: null
                }
            })
            //update opponent doc
            const reuesterRef = doc(db, "players", requestFrom.name);
            await updateDoc(reuesterRef, {
                requestFrom: {name: null},
                playingWith: {name: playerData.name},
                exitedByOpponent: null,
                requestTo: {
                    name: playerData.name,
                    status: 'accepted'
                }
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
              const docRef = doc(db, 'players', playerData.name);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                setPlayerData(docSnap.data());
              }
            
        }else{ //deny request
            //delete 'requestFrom' object from my doc
            reject();
        }
    },
    reject = async ()=>{
        const playerDataRef = doc(db, "players", playerData.name);
        await updateDoc(playerDataRef, {
            requestFrom: {name: null}
        })
        //updateDoc of requester. add object replyToRequestBy = {name, hasAccepted  }
        const reuesterRef = doc(db, "players", requestFrom.name);
        await updateDoc(reuesterRef, {
            requestTo: {
                name: playerData.name,
                status: 'rejected'
            }
        });
    }

    return (
        requestFrom ?
        <div className='dailog'>
            <div className='dailogMsg'>You Have Request From {requestFrom.name}</div>
            <div className='buttons'>
                <button onClick={()=> requestFunc(true)}><MdDone/></button>
                <button onClick={()=> requestFunc(false)}><MdClose/></button>
            </div>
        </div>
        : <></>
    );
};

export default RequestBox;