"use client";
import React, { useRef, useEffect, useState, useCallback } from 'react'
import { CanvasClass } from '@/draw/Canvas';
import { Tool } from "../types/index";
import { useSession } from "next-auth/react";

// Zoom limits configuration
const MIN_ZOOM = 0.1;  // 10% - Minimum zoom out
const MAX_ZOOM = 5;    // 500% - Maximum zoom in

interface ViewportState {
    offsetX: number;
    offsetY: number;
    scale: number;
}

const Canva = ({ roomId, selectedTool }: { roomId: number, selectedTool: Tool }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [socket, setSocket] = useState<WebSocket | undefined>();
    const canvaClassRef = useRef<CanvasClass>(undefined);
    const { data: session, status } = useSession();

    //  Viewport state for infinite canvas
    const [viewport, setViewport] = useState<ViewportState>({
        offsetX: 0,
        offsetY: 0,
        scale: 1
    });

    //  Pan state
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });

    //  Track Shift key state for hand cursor
    const [isShiftPressed, setIsShiftPressed] = useState(false);

    //  Initialize canvas
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

    //  Draw grid for infinite canvas feel
    const drawGrid = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const gridSize = 50;
        const startX = Math.floor((-viewport.offsetX / viewport.scale) / gridSize) * gridSize;
        const startY = Math.floor((-viewport.offsetY / viewport.scale) / gridSize) * gridSize;
        const endX = startX + (canvas.width / viewport.scale) + gridSize * 2;
        const endY = startY + (canvas.height / viewport.scale) + gridSize * 2;

        ctx.save();
        ctx.strokeStyle = "#1a1a1a";
        ctx.lineWidth = 0.5;

        // Apply viewport transform for grid
        ctx.setTransform(viewport.scale, 0, 0, viewport.scale, viewport.offsetX, viewport.offsetY);

        // Draw vertical lines
        for (let x = startX; x < endX; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, endY);
            ctx.stroke();
        }

        // Draw horizontal lines
        for (let y = startY; y < endY; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(endX, y);
            ctx.stroke();
        }

        ctx.restore();
    }, [viewport]);

    //  Handle mouse wheel for zoom (Ctrl + Wheel)
    const handleWheel = useCallback((e: WheelEvent) => {
        //  Only zoom when Ctrl key is pressed
        if (!e.ctrlKey) {
            return; // Allow normal scrolling when Ctrl is not pressed
        }

        e.preventDefault();

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Zoom factor
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, viewport.scale * zoomFactor));

        // Adjust offset to zoom towards mouse position
        const scaleChange = newScale / viewport.scale;
        const newOffsetX = mouseX - (mouseX - viewport.offsetX) * scaleChange;
        const newOffsetY = mouseY - (mouseY - viewport.offsetY) * scaleChange;

        setViewport({
            offsetX: newOffsetX,
            offsetY: newOffsetY,
            scale: newScale
        });

    }, [viewport]);

    //  Attach wheel event listener
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            canvas.removeEventListener('wheel', handleWheel);
        };
    }, [handleWheel]);

    //  Redraw canvas with grid when viewport changes
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx || !canvaClassRef.current) return;

        // Clear entire canvas in screen space
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        // Draw grid with viewport transform
        drawGrid();

        // Let CanvasClass handle the drawing with viewport
        canvaClassRef.current.clearcanvas();

    }, [viewport, drawGrid]);

    // creating a connection with the websocket server
    useEffect(() => {
        let ws: WebSocket;
        try {


            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found in localStorage");
                return;
            }
            const ws_url = process.env.NEXT_PUBLIC_WS_URL;
            ws = new WebSocket(`${ws_url}?token=${token}`);

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

        } catch (e: any) {

            console.log("something went wrong with websocket connection", e.message);
        }

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

    }, [canvasRef, socket]); //  Removed selectedTool from dependencies

    //  Separate useEffect for tool selection (don't recreate CanvasClass)
    useEffect(() => {
        if (canvaClassRef.current) {
            canvaClassRef.current.selectCurrentTool(selectedTool);
        }
    }, [selectedTool]);

    //  Update viewport in CanvasClass whenever it changes
    useEffect(() => {
        if (canvaClassRef.current) {
            canvaClassRef.current.setViewport(viewport);
        }
    }, [viewport]);

    //  Update panning state in CanvasClass
    useEffect(() => {
        if (canvaClassRef.current) {
            canvaClassRef.current.setIsPanning(isPanning);
        }
    }, [isPanning]);

    //  Handle Shift key press for hand cursor
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Shift' && !isShiftPressed) {
                setIsShiftPressed(true);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Shift') {
                setIsShiftPressed(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isShiftPressed]);

    //  Update canvas cursor based on panning and shift state
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (isPanning) {
            canvas.style.cursor = 'grabbing';
        } else if (isShiftPressed) {
            canvas.style.cursor = 'grab';
        } else {
            canvas.style.cursor = 'default';
        }
        // When neither panning nor shift pressed, let Canvas.ts manage cursor
    }, [isPanning, isShiftPressed]);

    //  Handle panning
    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        // Middle mouse button or Shift+Left click for panning
        if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
            e.preventDefault();
            e.stopPropagation(); //  Stop event from reaching CanvasClass
            setIsPanning(true);
            setPanStart({ x: e.clientX, y: e.clientY });
            return; //  Don't let event propagate
        }
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (isPanning) {
            e.preventDefault();
            e.stopPropagation(); // Stop event from reaching CanvasClass

            const dx = e.clientX - panStart.x;
            const dy = e.clientY - panStart.y;

            setViewport(prev => ({
                ...prev,
                offsetX: prev.offsetX + dx,
                offsetY: prev.offsetY + dy
            }));

            setPanStart({ x: e.clientX, y: e.clientY });
        }
    }, [isPanning, panStart]);

    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
        setIsShiftPressed(false);
    }, []);

    //  Zoom controls
    const handleZoomIn = () => {
        setViewport(prev => ({
            ...prev,
            scale: Math.min(MAX_ZOOM, prev.scale * 1.2)
        }));
    };

    const handleZoomOut = () => {
        setViewport(prev => ({
            ...prev,
            scale: Math.max(MIN_ZOOM, prev.scale * 0.8)
        }));
    };

    const handleResetZoom = () => {
        setViewport({
            offsetX: 0,
            offsetY: 0,
            scale: 1
        });
    };

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 w-full h-full bg-black overflow-hidden"
        >
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="absolute left-0 top-0"
            />

            {/* Viewport Info */}
            {/* <div className="absolute top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-mono">
                <div>Zoom: {(viewport.scale * 100).toFixed(0)}%</div>
                <div>Pan: ({viewport.offsetX.toFixed(0)}, {viewport.offsetY.toFixed(0)})</div>
            </div> */}

            {/* Zoom Controls */}
            <div className="absolute bottom-4 right-4 bg-neutral-900/90 backdrop-blur-md border border-neutral-700 rounded-lg p-2 flex flex-col gap-2">
                <button
                    onClick={handleZoomIn}
                    className="w-10 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center justify-center text-xl transition"
                    title="Zoom In"
                >
                    +
                </button>

                <div className="w-10 h-10 flex items-center justify-center text-xs font-mono text-accent">
                    {Math.round(viewport.scale * 100)}%
                </div>

                <button
                    onClick={handleZoomOut}
                    className="w-10 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center justify-center text-xl transition"
                    title="Zoom Out"
                >
                    −
                </button>

                <button
                    onClick={handleResetZoom}
                    className="w-10 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center justify-center text-sm transition"
                    title="Reset Zoom"
                >
                    ⟲
                </button>
            </div>

            {/* Controls Info */}
            <div className="absolute bottom-4 left-4 bg-black/80 text-white px-4 py-2 rounded-lg text-xs">
                <div>🖱️ Ctrl+Scroll: Zoom</div>
                <div>⬅️ Shift+Drag: Pan</div>
                {/* <div>🖱️ Middle Click: Pan</div> */}
            </div>
        </div>
    );
}

export default Canva