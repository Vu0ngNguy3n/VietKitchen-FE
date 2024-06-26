import React from "react";
import { useDrag } from "react-dnd";

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
                border: isDragging ? "5px solid pink" : "0px",
                opacity: isDragging ? 0.5 : 1,
            }}
        >
            <img
                src={url}
                width={'100px'}
                height={"100px"}
                alt={`Table ${id}`}
                style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                }}
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
