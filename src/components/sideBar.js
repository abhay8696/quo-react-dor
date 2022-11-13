import React, { useEffect, useState } from 'react';
//components
import Hello from './hello';
import PlayerList from './playerList';
//firebase
import db from '../Firebase';
import { collection, getDocs, onSnapshot, query } from 'firebase/firestore';
//styles
import '../styles/sideBar.css'
import { FaBars } from 'react-icons/fa'
//mui
import { Grow } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const SideBar = (props) => {
    //props
    const { playerData } = props;
    //states
    const [onlinePlayers, setonlinePlayers] = useState();
    const [checked, setChecked] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [tempStyle, setTempStyle] = useState({});
    //varaibles
    // const tempStyle = 
    //life cycle
    useEffect(()=> {
        const t = setTimeout(() => {
            handleChecked(true);
        }, 1000);

        const onlinePlayersRef = query(collection(db, 'players'));
        const getonlinePlayers = onSnapshot(onlinePlayersRef, snap=> {
          console.log('updating online players list')
          const a = [];
          snap.forEach(doc=> {
            if(doc.data().name !== playerData.name) {
              a.push(doc.data());
            } 
          });
          setonlinePlayers(a);
        })
        return ()=> {
            clearTimeout(t);
            getonlinePlayers();
        }
    }, [])
    useEffect(()=> {
        if(playerData?.playingWith?.name){
            handleChecked(false);
            setTempStyle({display: 'none'})
        }else{
            handleChecked(true);
            setTempStyle({});
        }
    }, [playerData])
    useEffect(()=> {
        // if(expanded) getPlayers()
    }, [expanded])
    //functions
    const
    getPlayers = async ()=> {
        const allPlayersRef = query(collection(db, 'players'));
        const querySnapshot = await getDocs(allPlayersRef);
        const a = [];
        querySnapshot.forEach((doc) => {
            if(doc.data().name != playerData.name) a.push(doc.data());
        });
        setonlinePlayers(a)
    }
  
    const handleAccordian = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    };
    //functions
    const handleChecked = val => setChecked((prev) => val);
    return (
        <>
        <Grow in={checked} {...(checked ? { timeout: 500 } : {})}>
            <div className='forMobile'>
                <Accordion expanded={expanded === 'panel1'} onChange={handleAccordian('panel1')} TransitionProps={{ unmountOnExit: true }}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                        <span className='accordTexts'>
                            <span className='name_accord'>Hello {playerData.name}</span>
                            <span>Play</span>
                        </span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <PlayerList 
                        onlinePlayers={onlinePlayers}
                        />
                    </AccordionDetails>
                </Accordion>
            </div>
        </Grow>
        
        <Grow in={checked} {...(checked ? { timeout: 500 } : {})}>
            <div className='sideBar'>
                <Hello 
                playerData={playerData} 
                onlinePlayers={onlinePlayers}
                />
            </div>
        </Grow>
        </>
    );
};

export default SideBar;