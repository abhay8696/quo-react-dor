import React from 'react';
//styles
import '../../styles/guide/step5.css'
//components
import BoardImage from './boardImage';

const Step5 = () => {
    return (
        <div className='step5Body'>
            <span className='text5'>Pawn Should Have Atleast One Way To Reach Destination</span>
            <BoardImage moves5={true}/>
        </div>
    );
};

export default Step5;