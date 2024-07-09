import React from "react";
import { useDrag } from "react-dnd";
import ROUND4 from '../../../assests/reactange4.jpg'

const Table = ({ id, url, positionX, positionY, name}) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "image",
        item: { id, url, positionX, positionY },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [id, url, positionX, positionY]);

    return (
        <div
            ref={drag}
            style={{
                position: "absolute",
                left: `${positionX}px`,
                top: `${positionY}px`,
                width: '100px',
                height: '100px',
                // border: isDragging ? "5px solid pink" : "0px",
                opacity: isDragging ? 0.5 : 1,
            }}
        >
            <img
                src={ROUND4}
                width={'100px'}
                height={"100px"}
                alt={`Table ${id}`}
                className='object-cover block w-full h-full'
                
            />
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
                    // color: idTableSelected === id ? 'green': "red",
                    color: "red",
                    pointerEvents: "none" // This ensures the text does not interfere with dragging
                }}
            >
                {name}
            </div>
        </div>
    );
};

export default Table;
