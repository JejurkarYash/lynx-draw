"use client";
import React, { useRef, useEffect, useState } from 'react'
import { CanvasClass } from '@/draw/Canvas';
import { Tool } from "../types/index";



const Canva = ({ roomId, selectedTool }: { roomId: number, selectedTool: Tool }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [socket, setSocket] = useState<WebSocket | undefined>();
    const canvaClassRef = useRef<CanvasClass>(undefined);


    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        canvasRef.current.height = window.innerHeight;
        canvasRef.current.width = window.innerWidth;

    }, [])

    // creating a connection with the websocket server
    useEffect(() => {
        const token = localStorage.getItem("token");
        const ws_url = process.env.NEXT_PUBLIC_WS_URL;
        const ws = new WebSocket(`${ws_url}?token=${token}`);

        if (!ws) {
            return;
        }

        ws.onopen = () => {
            setSocket(ws);
            const msg = {
                type: "JOIN_ROOM",
                roomId: roomId
            }
            ws.send(JSON.stringify(msg));
        }
        //
        return () => ws.close();

    }, [roomId])

    useEffect(() => {
        if (canvaClassRef.current) {
            canvaClassRef.current.destroy();
        }
        if (!canvasRef.current) return;
        const Cn = new CanvasClass(canvasRef.current, roomId, socket);
        Cn.selectCurrentTool(selectedTool);
        canvaClassRef.current = Cn;

    }, [canvasRef, socket, selectedTool]);

    return (
        <canvas ref={canvasRef} className=' bg-black  h-full w-full    ' > </canvas>
    )
}

export default Canva