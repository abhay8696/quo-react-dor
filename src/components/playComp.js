import React from 'react';

const PlayComp = (props) => {
    //props
    const { opponent } = props;
    return (
        <div>
            Playing With: 
            <h1>{opponent}</h1>
        </div>
    );
};

export default PlayComp;