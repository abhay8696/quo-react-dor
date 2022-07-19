import React, { useEffect, useState } from 'react';
//firebase
import db from '../Firebase';
import { doc, query, updateDoc } from 'firebase/firestore';
//styles
import '../styles/board.css'
//icons
import pawn from '../../src/icons/pawn.svg'
import StarsIcon from '@mui/icons-material/Stars';
import LensIcon from '@mui/icons-material/Lens';
import { selectClasses } from '@mui/material';
const Board = (props) => {
    //states
    const 
    [selected, setSelected] = useState("B64"),
    [next, setNext] = useState(["54", "65", "74", "63"]),
    [selectedWall, setSelectedWall] = useState([]),
    [blocked, setBlocked] = useState([]),
    [myPawn, setMyPawn] = useState(),
    [opponentPawn, setOpponentPawn] = useState();
    //props
    const { gameData, playerData, opponent } = props;
    //life cycle
    useEffect(()=> {
        console.log(gameData)
        if(!myPawn && !opponentPawn){
            if(gameData?.player1.name === playerData.name){
                setMyPawn(gameData?.player1);
                setOpponentPawn(gameData?.player2);
            }else{
                setMyPawn(gameData?.player2);
                setOpponentPawn(gameData?.player1);
            }
        }else{

        }
    }, [gameData])
    //functions
    const 
    clickBox = (i,j)=> {
        let s = `${i}${j}`
        if(!next.includes(s)) return;
        
        setSelected(`B${i}${j}`);

        let t = `${i-1}${j}`, r=`${i}${j+1}`, b=`${i+1}${j}`, l=`${i}${j-1}`;
        let arr = [];
        const checkThis = [`${t}${s}`, `${s}${r}`, `${s}${b}`, `${l}${s}`]
        checkThis.forEach(i=> {
            if(!blocked.includes(i)){
                //i.split
                let splitedStr = i.split(''); 
                //join 0+1 and 2+3
                let str1 = splitedStr[0].concat(splitedStr[1])
                let str2 = splitedStr[2].concat(splitedStr[3])
                //if(0+1 === s) arr.push(2+3) else arr.push(0+1)
                if(str1 === s) arr.push(str2);
                else arr.push(str1);
            }
        })
        setNext(arr);
        const gameRef = doc(db, "liveGames", `${gameData?.id}`);
        if(gameData.player1.name === playerData.name){
            updateDoc(gameRef, {
                player1:{
                    position : `B${i}${j}`,
                    name: playerData.name,
                    walls: gameData.player1.walls
                }
            })
        }else{
            updateDoc(gameRef, {
            player2:{
                position : `B${i}${j}`,
                name: playerData.name,
                walls: gameData.player2.walls
            }
            })
        }
    },
    clickWall = (x,y)=> {
        let blockBox1, blockBox2
        // console.log(selected);
        //if x%2===0 hWall else vWall
        if(x%2===1){ //vWall
            let iLeft = (x+1)/2, jLeft=y, iRight = (x+1)/2, jRight=y+1;
            blockBox1 = `${iLeft}${jLeft}`;
            blockBox2 = `${iRight}${jRight}`;
        }
        if(x%2===0){ //hWall
            let iTop = x/2, jTop=y, iBot = (x/2)+1, jBot=y;
            blockBox1 = `${iTop}${jTop}`;
            blockBox2 = `${iBot}${jBot}`;
            }
        if(!blocked.includes(`${blockBox1}${blockBox2}`)) setBlocked([...blocked, `${blockBox1}${blockBox2}`]);
        setSelectedWall([...selectedWall, `W${x}${y}`]);

        check_ajacency_of_wall_and_box(blockBox1,blockBox2);

        if(gameData){
            const gameRef = doc(db, "liveGames", String(gameData.id));
            if(gameData.player1.name === playerData.name){
                updateDoc(gameRef, {
                    player1:{
                        position : gameData.player1.position,
                        name: playerData.name,
                        walls: gameData.player1.walls-1
                    }
                })
            }else{updateDoc(gameRef, {
                player2:{
                    position : gameData.player2.position,
                    name: playerData.name,
                    walls: gameData.player2.walls-1
                }
            })
            }
        };

    },
    check_ajacency_of_wall_and_box = (box1, box2)=> {
        let b1 = `B${box1}`, b2 = `B${box2}`, newNext = [];
        //check clicked wall is adjacent to selected box
        //if(yes) update next boxes
        if(selected === b1 || selected === b2){
            // setNext()
            next.forEach(i=> {
                if(i !== box1 && i !== box2){
                    newNext.push(i)
                }
            })
            setNext(newNext);
        }
    },
    dispBoxes = ()=> {
        let rows = [], i=0;
        for(let x=1; x<=11; x++){
            if(x%2===1) i++ ;
            rows.push(
                <div className='row' key={`B${x}`}>
                    { x%2 === 1 ? boxRow(i,x) : wallRow(x) } 
                </div>
            )
        }
        return rows;
    },
    boxRow = (i,x)=> {
        let row = [], j=0, y=0;
        for(let l=1; l<=11; l++){
            if(l%2 === 1) j++;
            else y++;
            l%2 === 1 ? row.push(box(i,j)) : row.push(wall(x,y,'v'));
        }
        return row;
    },
    wallRow = (x)=> {
        let row = [];
        for(let y=1; y<=6; y++){
            row.push(wall(x,y,'h'));
        }
        return row;
    },
    wall = (x,y, type)=> {
        let cls;
        if(type==='v'){
            if(selectedWall.includes(`W${x}${y}`)){
                cls = 'selectedVerticalWall'
            }else cls = 'verticalWall';
        }else {
            if(selectedWall.includes(`W${x}${y}`)){
                cls = 'selectedHorizontalWall'
            }else cls = 'horizontalWall';
        }
        return (
            <div 
            className={cls} 
            onClick={()=> clickWall(x,y)}
            key = {`W${x}${y}`}
            ></div>)
    },
    box = (i,j)=> {
        return (<div 
            className={next.includes(`${i}${j}`) ? 'next' : 'box'}
            key={`B${i}${j}`} 
            onClick={()=> clickBox(i,j)}
            >
                {selected===`B${i}${j}` ? <LensIcon className='pawn'/> : <></>}
            </div>)
    }, 
    clearBoard = ()=> {
        setSelected('B64')
        setNext(["54", "65", "74", "63"]);
        setSelectedWall([]);
        setBlocked([]);
    };

    return (
        <div className='board'>
            {dispBoxes()}
            <button onClick={()=> clearBoard()}>Clear</button>
            <h1>
            {
                gameData ? gameData.player1.name : null 
            }
            </h1>
        </div>
    );
};

export default Board;