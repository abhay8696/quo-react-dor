import React, { useState, useContext, useEffect } from 'react';
//contexts
import { PlayerDataContext } from '../contexts/playerDataContext';
//firebase
import db from '../Firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
//styles
import '../styles/enterName.css'
import { FaArrowRight, FaLeaf } from 'react-icons/fa'
//mui
import { Grow, Slide } from '@mui/material';

const EnterName = (props) => {
    //props
    const { disappear, text } = props;
    //contexts
    const [playerData, setPlayerData] = useContext(PlayerDataContext);

    //life cycle
    useEffect(()=> {
      const timeOut = setTimeout(() => {
        handleChecked();
        handleCheckout();
      }, 500);
      const userData = JSON.parse(window.localStorage.getItem("userData"));
      if(userData){
        setPlayerData(userData)
      }else{
        console.log('no user data needs to login')
      }

      return ()=> clearTimeout(timeOut);
    }, [])
    
    //states
    const [name, setName] = useState();
    const [checked, setChecked] = useState(false);
    const [checkout, setCheckout] = useState(true);
    const [showButton, setShowButton] = useState(false);
    //functions
    const getUser = async evt=> {
      evt.preventDefault();
      // if(!name || name.length <= 0) return alert('empty');
      // const docRef = addDoc(collection(db, 'players'), {
      // name: name
      // })
      const docRef = doc(db, 'players', name);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setPlayerData(docSnap.data());
        window.localStorage.setItem("userData",JSON.stringify(docSnap.data()));
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
    const handleInput = evt=> {
      setName(`${evt.target.value}`.toLowerCase())
      handleButton()
    }
    const handleChecked = () => {
      setChecked((prev) => true);
    };
    const handleButton = ()=> setShowButton(prev => true);
    const handleCheckout = ()=> setCheckout(prev=> false);
    const displayDIv = ()=> {
      return(
      <div className='enterName'>
      <Grow in={checked}>
        <p className='msg'>
          Reach opposite side before your opponent reaches his
        </p>
      </Grow>
      
      <Grow in={checked}>
        <form onSubmit={e=> getUser(e)} className='form'>
          <Grow
            in={checked}
            style={{ transformOrigin: '0 0 0' }}
            {...(checked ? { timeout: 500 } : {})}
          >
            <div className='text'>Enter Your Name</div>
          </Grow>
          <Grow
            in={checked}
            style={{ transformOrigin: '0 0 0' }}
            {...(checked ? { timeout: 1000 } : {})}
          >
            <input 
            onChange={e=> handleInput(e)}   
            className='input'
            required
            />
          </Grow>
          <Grow
            in={showButton}
            style={{ transformOrigin: '0 0 0' }}
            {...(showButton ? { timeout: 2000 } : {})}
          >
          <button 
          className='arrow'
          type='submit'
          >
            <FaArrowRight/>
          </button>
          </Grow>
        </form>
      </Grow>
      <div></div>
    </div>
    )
    }
    const disappear_this = ()=> {
      return (
        <Grow 
        in={checkout}
        style={{ transformOrigin: '0 0 0' }}
        {...(checkout ? { timeout: 0 } : {})}>
        <div className='enterName'>
          <p className='msg'>
            Reach opposite side before your opponent reaches his
          </p>
          <form onSubmit={e=> getUser(e)} className='form'>
              <div className='text'>Enter Your Name</div>
              <input 
              value={text}
              className='input'
              required
              />
              <button 
              className='arrow'
              type='submit'
              >
                <FaArrowRight/>
              </button>
          </form>
          <div></div>
        </div> 
        </Grow>
      )
    }
    return (
      disappear ?  disappear_this() : displayDIv()
    );
};

export default EnterName;