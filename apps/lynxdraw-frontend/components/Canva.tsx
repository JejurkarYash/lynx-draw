"use client";
import React, { useRef, useEffect, useState } from 'react'
import { CanvasClass } from '@/draw/Canvas';
import { Tool } from "../types/index";
import { useSession } from "next-auth/react";



const Canva = ({ roomId, selectedTool }: { roomId: number, selectedTool: Tool }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [socket, setSocket] = useState<WebSocket | undefined>();
    const canvaClassRef = useRef<CanvasClass>(undefined);
    const { data: session, status } = useSession();


    useEffect(() => {
        const resizeCanvas = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const dpr = window.devicePixelRatio || 1;
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Set canvas size for high-DPI
            canvas.width = width * dpr;
            canvas.height = height * dpr;

            // Set CSS size
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";

            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.scale(dpr, dpr);
            }
        };

        resizeCanvas(); // initial
        window.addEventListener("resize", resizeCanvas);

        return () => window.removeEventListener("resize", resizeCanvas);
    }, []);


    // creating a connection with the websocket server
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }
        const ws_url = process.env.NEXT_PUBLIC_WS_URL;
        const ws = new WebSocket(`${ws_url}?token=${token}`);


        if (!ws) {
            return;
        } else {
            console.log("Websocket connected...")
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
        <canvas ref={canvasRef} className=' absolute left-0 top-0 bg-black'  > </canvas>
    )
}

export default Canva