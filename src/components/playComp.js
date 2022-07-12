import React from 'react';
//components
import Board from './board';
//styles
import '../styles/playComp.css'

const PlayComp = (props) => {
    //props
    const { opponent } = props;
    return (
        <div className='playComp'>
            Playing With: {opponent}
            <Board/>
        </div>
    );
};

export default PlayComp;