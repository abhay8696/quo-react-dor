import React from 'react';
//styles
import '../styles/boardErrorMsg.css'
//icons
import { FaExclamation } from 'react-icons/fa'; 

const BoardErrorMsg = props => {
    //props
    const { gameData, class_name } = props;
    
    return (
        <div className={`${class_name} boardErrorMsg`}>
            <FaExclamation/>{gameData?.errorMsg?.msg2}
        </div>
    );
};

export default BoardErrorMsg;