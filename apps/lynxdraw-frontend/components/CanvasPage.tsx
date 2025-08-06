"use client";

import React, { useEffect, useRef, useState } from 'react'
import Canva from "../components/Canva";
import { Tool } from "../types/index";




const Canvas = ({ roomId }: { roomId: number }) => {
    const socketRef = useRef<WebSocket>(undefined);
    const [selectedTool, setSelectedTool] = useState<Tool>("PENCIL");


    return (
        <div className=' fixed top-0 left-0  w-screen h-screen  '>
            <Canva roomId={roomId} selectedTool={selectedTool} ></Canva>
        </div>
    )
}

export default Canvas;  