import React, { useState } from 'react';
//components
import Hello from './hello';
import PlayerList from './playerList';
//styles
import '../styles/sideBar.css'
import { FaBars } from 'react-icons/fa'
//mui
import { FormControlLabel, Slide, Switch } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const SideBar = (props) => {
    //props
    const { playerData, onlinePlayers } = props;
    //states
    const [checked, setChecked] = useState(false);
    const [expanded, setExpanded] = useState(false);
  
    const handleAccordian = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    };
    //functions
    const handleChecked = () => setChecked((prev) => !prev);
    return (
        <>
        <div className='forMobile'>
            <Accordion expanded={expanded === 'panel1'} onChange={handleAccordian('panel1')} TransitionProps={{ unmountOnExit: true }}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header">
                    <span>Online Players</span>
                </AccordionSummary>
                <AccordionDetails>
                    <PlayerList 
                    onlinePlayers={onlinePlayers}
                    />
                </AccordionDetails>
            </Accordion>
        </div>
        <div className='sideBar'>
            <Hello 
            playerData={playerData} 
            onlinePlayers={onlinePlayers}
            />
        </div>
        </>
    );
};

export default SideBar;