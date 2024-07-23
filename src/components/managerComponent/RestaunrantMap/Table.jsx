import React from "react";
import { useDrag } from "react-dnd";
import REACTANGE4 from "../../../assests/reactange4.png"
import REACTANGE6 from "../../../assests/reactange6.png"
import REACTANGE8 from "../../../assests/reactange8.png"
import ROUND4 from "../../../assests/round4.png"
import ROUND6 from "../../../assests/round6.png"
import ROUND8 from "../../../assests/round8.png"
import SQUARE4 from "../../../assests/square4.png"
import SQUARE6 from "../../../assests/square6.png"
import SQUARE8 from "../../../assests/square8.png"

const Table = ({ id, typeTable, positionX, positionY, name, orderCurrent, numberChairs}) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "image",
        item: { id, typeTable, positionX, positionY },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [id, typeTable, positionX, positionY]);

    return (
        <div
            ref={drag}
            style={{
                position: "absolute",
                left: `${positionX}px`,
                top: `${positionY}px`,
                width: '150px',
                height: '150px',
                // border: isDragging ? "5px solid pink" : "0px",
                opacity: isDragging ? 0.5 : 1,
            }}
        >
            {(numberChairs === 4 && typeTable === 1) && <img src={ROUND4} alt={`Table ${id}`} className='object-cover block w-[150px] h-[150px]'/>}
            {(numberChairs === 6 && typeTable === 1) && <img src={ROUND6} alt={`Table ${id}`} className='object-cover block w-[150px] h-[150px]'/>}
            {(numberChairs === 8 && typeTable === 1) && <img src={ROUND8} alt={`Table ${id}`} className='object-cover block w-[150px] h-[150px]'/>}
            {(numberChairs === 4 && typeTable === 2) && <img src={SQUARE4} alt={`Table ${id}`} className='object-cover block w-[150px] h-[150px]'/>}
            {(numberChairs === 6 && typeTable === 2) && <img src={SQUARE6} alt={`Table ${id}`} className='object-cover block w-[150px] h-[150px]'/>}
            {(numberChairs === 8 && typeTable === 2) && <img src={SQUARE8} alt={`Table ${id}`} className='object-cover block w-[150px] h-[150px]'/>}
            {(numberChairs === 4 && typeTable === 3) && <img src={REACTANGE4} alt={`Table ${id}`} className='object-cover block w-[150px] h-[150px]'/>}
            {(numberChairs === 6 && typeTable === 3) && <img src={REACTANGE6} alt={`Table ${id}`} className='object-cover block w-[150px] h-[150px]'/>}
            {(numberChairs === 8 && typeTable === 3) && <img src={REACTANGE8} alt={`Table ${id}`} className='object-cover block w-[150px] h-[150px]'/>}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    width: "100%",
                    zIndex:10,
                    color: orderCurrent === null ? 'white': "red",
                    // color: "white",
                    pointerEvents: "none" // This ensures the text does not interfere with dragging
                }}
            >
                {name}
            </div>
        </div>
    );
};

export default Table;
