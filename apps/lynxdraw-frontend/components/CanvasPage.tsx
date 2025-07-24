"use client";

import React, { useEffect, useRef, useState } from 'react'
import Canva from "../components/Canva";
import { Tool } from "../types/index";




const Canvas = ({ roomId }: { roomId: number }) => {
    const socketRef = useRef<WebSocket>(undefined);
    const [selectedTool, setSelectedTool] = useState<Tool>("MOUSE_SELECTION");


    return (
        <div className=' relative top-0 left-0 w-screen h-screen bg-green-400 overflow-hidden  '>
            <Canva roomId={roomId} selectedTool={selectedTool} ></Canva>
        </div>
    )
}

export default Canvas; 