import React, { useState, useContext, useEffect } from "react";
//contexts
import { PlayerDataContext } from "../contexts/playerDataContext";
//firebase
import db from "../Firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
//styles
import "../styles/enterName.css";
import { FaArrowRight, FaLeaf } from "react-icons/fa";
//mui
import { Grow, Slide } from "@mui/material";
import IntroAnimation from "./introAnimation";

const EnterName = (props) => {
  //props
  const { disappear, text } = props;
  //contexts
  const [playerData, setPlayerData] = useContext(PlayerDataContext);

  //life cycle
  useEffect(() => {
    const timeOut = setTimeout(() => {
      handleChecked();
      handleCheckout();
    }, 500);
    const userData = JSON.parse(window.localStorage.getItem("userData"));
    if (userData) {
      setPlayerData(userData);
    } else {
      console.log("no user data needs to login");
    }

    return () => clearTimeout(timeOut);
  }, []);

  //states
  const [name, setName] = useState("");
  const [checked, setChecked] = useState(false);
  const [checkout, setCheckout] = useState(true);
  const [showButton, setShowButton] = useState(false);
  //functions
  const getUser = async (evt) => {
    evt.preventDefault();
    const docRef = doc(db, "players", name);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setPlayerData(docSnap.data());
      window.localStorage.setItem("userData", JSON.stringify(docSnap.data()));
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      const playersRef = collection(db, "players");
      await setDoc(doc(playersRef, name), {
        name: name,
        requestFrom: { name: null },
        playingWith: { name: null },
        exitedByOpponent: null,
        requestTo: {
          name: null,
          status: null,
        },
      });
      setPlayerData({
        name: name,
        requestFrom: { name: null },
        playingWith: { name: null },
        exitedByOpponent: null,
        requestTo: {
          name: null,
          status: null,
        },
      });
    }
  };
  const handleInput = (evt) => {
    setName(`${evt.target.value}`.toLowerCase());
    handleButton();
  };
  const handleChecked = () => {
    setChecked((prev) => true);
  };
  const handleButton = () => setShowButton((prev) => true);
  const handleCheckout = () => setCheckout((prev) => false);
  const displayDIv = () => {
    return (
      <div className="enterName">
      <IntroAnimation/>
        <div className="appTitle">
          <h1>QUO-REACT-DOR</h1>
          <p className="msg" id="msgIn">
            A Quoridor Game
          </p>
        </div>
        <div className="divider"></div>
        <form onSubmit={(e) => getUser(e)} className="form">
          <div className="text" id="textIn">
            What Is Your Name?
          </div>
          <input
            onChange={(e) => handleInput(e)}
            className="input"
            id="inputIn"
            required
            value={name}
          />
          <button className="arrow" id="arrowIn" type="submit">
            <FaArrowRight />
          </button>
        </form>
      </div>
    );
  };
  const disappear_this = () => {
    return (
      <div className="enterName">
        <p className="msg" id="msgOut">
          A Quoridor Game
        </p>
        <form onSubmit={(e) => getUser(e)} className="form">
          <div className="text" id="textOut">
            What Is Your Name?
          </div>
          <input value={text} className="input" id="inputOut" disabled />
          <button className="arrow" id="arrowOut" type="submit">
            <FaArrowRight />
          </button>
        </form>
        <div></div>
      </div>
    );
  };
  return disappear ? disappear_this() : displayDIv();
};

export default EnterName;
