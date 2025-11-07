
import { getExistingShapes } from "./util";
import { Tool, shape, EraserPathType, pencilPathType } from "../types/index";

export class CanvasClass {

    // global variables
    // canvas variables 
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;

    // roomId
    private roomId: number;

    // shape attributes
    private startX: number;
    private startY: number;
    private width: number;
    private height: number;
    private radius: number;
    private centerX: number;
    private centerY: number;
    //  mouse handlers variables 
    private clicked: boolean;
    // shape array
    private selectedShape: shape[] = [];

    // pencil paths 
    private pencilPath: pencilPathType[] = [];

    // eraser variable 
    private isErasing: boolean = false;
    private erasedShapes: shape[] = [];
    private eraserPath: EraserPathType[] = [];
    private eraserPreviewScheduled: boolean = false; //  Throttle flag for eraser preview
    private eraserAnimationFrameId: number | null = null; //  Track animation frame to cancel it

    private socket: WebSocket | undefined;
    private existingShape: shape[];
    private selectedTool: Tool;
    private selectionBox: {
        x: number,
        y: number,
        width: number,
        height: number,
        active: ConstrainBoolean

    } = { x: 0, y: 0, width: 0, height: 0, active: false };

    // Viewport state for infinite canvas
    private viewport: {
        offsetX: number;
        offsetY: number;
        scale: number;
    } = { offsetX: 0, offsetY: 0, scale: 1 };

    // Flag to prevent drawing during panning
    private isPanningCanvas: boolean = false;




    constructor(canvas: HTMLCanvasElement, roomId: number, socket: WebSocket | undefined) {

        // initializing global varialbes 
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.roomId = roomId;
        this.socket = socket;
        this.existingShape = []
        this.height = 0;
        this.width = 0;
        this.startX = 0;
        this.startY = 0;
        this.centerX = 0;
        this.centerY = 0;
        this.clicked = false;
        this.radius = 0;
        this.selectedTool = "RECTANGLE";
        this.canvas.style.cursor = "default";
        this.pencilPath = [];



        // defining some global styles for the canvas 


        // calling the function's when the constructor get called 
        this.initCanvas();
        this.initMouseHandlers();
        this.initHandlers();

    }

    // remove the event listeners
    destroy() {

        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    };

    // Set viewport for infinite canvas
    setViewport(viewport: { offsetX: number; offsetY: number; scale: number }) {
        this.viewport = viewport;
    }

    // Set panning state
    setIsPanning(isPanning: boolean) {
        this.isPanningCanvas = isPanning;
    }

    // Convert screen coordinates to world coordinates
    screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
        // First, get canvas-relative coordinates
        const rect = this.canvas.getBoundingClientRect();
        const canvasX = screenX - rect.left;
        const canvasY = screenY - rect.top;

        // Then convert to world coordinates with viewport transform
        return {
            x: (canvasX - this.viewport.offsetX) / this.viewport.scale,
            y: (canvasY - this.viewport.offsetY) / this.viewport.scale
        };
    }

    // Convert world coordinates to screen coordinates
    worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
        return {
            x: worldX * this.viewport.scale + this.viewport.offsetX,
            y: worldY * this.viewport.scale + this.viewport.offsetY
        };
    }

    // set the current tool for drawing 
    selectCurrentTool(selectedTool: Tool) {
        const previousTool = this.selectedTool;

        // Clean up previous tool state BEFORE updating tool
        if (previousTool === "ERASER") {
            // Remove eraser handlers when switching away from eraser
            this.removeEraserHandlers();
        }

        // Update the selected tool AFTER cleanup
        this.selectedTool = selectedTool;

        // Set cursor and initialize new tool
        if (this.selectedTool === "MOUSE_SELECTION") {
            this.canvas.style.cursor = "default";
        } else if (this.selectedTool === "ERASER") {
            this.canvas.style.cursor = "none";
            // Add eraser-specific handlers
            this.initEraserHandlers();
        } else {
            this.canvas.style.cursor = "crosshair";
        }
    }


    // Initializing an empty canva && fetching an existing shapes 
    async initCanvas() {

        if (this.selectedTool === "ERASER") {
            this.initEraserHandlers();

        }

        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.canvas.clientWidth * dpr;
        this.canvas.height = this.canvas.clientHeight * dpr;

        if (!this.ctx) return;

        // DON'T apply DPR scaling here - we'll handle it in clearcanvas
        // this.ctx.scale(dpr, dpr); // ? REMOVED

        // definging some global styling for drawing elements 
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";

        this.existingShape = await getExistingShapes(this.roomId);
        console.log(this.existingShape);
        this.clearcanvas();
    }

    // handling the incoming messages 
    initHandlers() {
        if (!this.socket) {
            return;
        }

        this.socket.onmessage = (event) => {
            // console.log(event.data);
            const message = JSON.parse(event.data);
            if (message.type === "CHAT") {
                const data = message.content;
                console.log(data);
                this.existingShape.push(data);
                this.clearcanvas();
            } else if (message.type === "UPDATE_CHATS") {
                this.existingShape = message.content;
                this.clearcanvas();
            }
        }
    }


    // clearing the canvas before drawing && drawing the existing shapes on the canva
    clearcanvas() {
        if (!this.ctx) return;

        const dpr = window.devicePixelRatio || 1;

        // Clear entire canvas in screen space (without transform)
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset to identity
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();

        // Apply viewport transformation for drawing (including DPR)
        this.ctx.save();
        this.ctx.setTransform(
            this.viewport.scale * dpr, 0,
            0, this.viewport.scale * dpr,
            this.viewport.offsetX * dpr, this.viewport.offsetY * dpr
        );

        // printing the existing shapes after clearing the canvas

        if (this.existingShape) {

            this.existingShape.map((shape: shape) => {

                if (this.selectedShape.some((s) => s === shape)) {
                    if (!this.ctx) return;
                    this.ctx.strokeStyle = "oklch(67.3% 0.182 276.935)";
                    this.ctx.lineWidth = 1.5 / this.viewport.scale; // Scale line width

                    // cheking if the selected shape is circle or rectangle 
                    if (shape.type === "CIRCLE") {

                        // this is for circle
                        if (!shape.radius || !shape.startX || !shape.startY) {
                            return;
                        }
                        const boxX = shape.startX - shape.radius - 4;
                        const boxY = shape.startY - shape.radius - 4;
                        const size = shape.radius * 2 + 8;
                        this.ctx.strokeRect(boxX, boxY, size, size);

                    } else if (shape.type === "LINE") {
                        if (shape.endX === undefined || shape.endY === undefined) {
                            return;
                        }

                        const x1 = shape.startX;
                        const y1 = shape.startY;
                        const x2 = shape.endX as number;
                        const y2 = shape.endY as number;

                        // Calculate bounding box for the line
                        const minX = Math.min(x1, x2);
                        const maxX = Math.max(x1, x2);
                        const minY = Math.min(y1, y2);
                        const maxY = Math.max(y1, y2);

                        // Add padding around the line
                        const padding = 8;
                        const boxX = minX - padding;
                        const boxY = minY - padding;
                        const boxWidth = (maxX - minX) + (2 * padding);
                        const boxHeight = (maxY - minY) + (2 * padding);

                        // For very thin lines (nearly horizontal or vertical), ensure minimum selection box size
                        const minSize = 16;
                        const finalWidth = Math.max(boxWidth, minSize);
                        const finalHeight = Math.max(boxHeight, minSize);

                        // Adjust position if we increased the size
                        const adjustedX = boxX - (finalWidth - boxWidth) / 2;
                        const adjustedY = boxY - (finalHeight - boxHeight) / 2;

                        this.ctx.strokeRect(adjustedX, adjustedY, finalWidth, finalHeight);
                    } else if (shape.type === "PENCIL") {
                        if (!shape.pencilPath || shape.pencilPath.length === 0) {
                            return;
                        }

                        // Calculate bounding box for pencil path
                        let minX = shape.pencilPath[0].x;
                        let maxX = shape.pencilPath[0].x;
                        let minY = shape.pencilPath[0].y;
                        let maxY = shape.pencilPath[0].y;

                        shape.pencilPath.forEach(point => {
                            minX = Math.min(minX, point.x);
                            maxX = Math.max(maxX, point.x);
                            minY = Math.min(minY, point.y);
                            maxY = Math.max(maxY, point.y);
                        });

                        const padding = 6;
                        this.ctx.strokeRect(
                            minX - padding,
                            minY - padding,
                            (maxX - minX) + (2 * padding),
                            (maxY - minY) + (2 * padding)
                        );
                    } else {
                        // this is the selection for other shapes   
                        this.ctx.strokeRect(shape.startX - 4, shape.startY - 4, shape.width + 8, shape.height + 8);
                    }
                }

                if (shape.type === "RECTANGLE") {
                    this.drawRectangle(shape);
                } else if (shape.type === "CIRCLE") {
                    this.drawCircle(shape);
                } else if (shape.type === "LINE") {
                    this.drawLine(shape);
                } else if (shape.type === "PENCIL") {
                    this.drawPencil(shape);
                }


            })

            if (this.selectionBox.active) {
                this.drawSelectionBox();
            }

        }

        // Restore context after drawing
        this.ctx.restore();
    }




    // logic for drawing rectangle
    drawRectangle(shape: shape) {
        if (!this.ctx) {
            return;
        }
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 4 / this.viewport.scale; // Scale line width
        this.ctx?.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
    }

    //  drawing logic for circle 
    drawCircle(shape: shape) {
        if (!this.ctx || !shape.radius) {
            return;
        };

        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 4 / this.viewport.scale; // Scale line width
        this.ctx.beginPath();
        this.ctx.arc(shape.startX, shape.startY, shape.radius, 0, 2 * Math.PI, true);
        this.ctx.stroke();
        this.ctx.closePath();

    }

    // drawing logic for line
    drawLine(shape: shape) {
        if (!this.ctx) {
            return;
        }

        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 4 / this.viewport.scale; // Scale line width
        this.ctx?.beginPath();
        this.ctx?.moveTo(shape.startX, shape.startY);
        this.ctx?.lineTo(Number(shape.endX), Number(shape.endY));
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawPencil(shape: shape) {


        if (!this.ctx || !shape.pencilPath) return;
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 5 / this.viewport.scale; // Scale line width
        this.ctx.beginPath();
        for (let i = 1; i < shape.pencilPath.length; i++) {
            let prev = shape.pencilPath[i - 1];
            // console.log(prev);
            let current = shape.pencilPath[i];
            // console.log(current);
            this.ctx.moveTo(prev.x, prev.y);
            this.ctx.lineTo(current.x, current.y);

        }
        this.ctx.stroke();


    }


    // / Helper function to check if two line segments intersect
    linesIntersect(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): boolean {
        const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (Math.abs(denom) < 1e-10) return false; // Lines are parallel

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

        return t >= 0 && t <= 1 && u >= 0 && u <= 1;
    }

    // Helper function to check if a line intersects with a rectangle
    lineIntersectsRect(x1: number, y1: number, x2: number, y2: number, rectX: number, rectY: number, rectX2: number, rectY2: number): boolean {
        // Check if either endpoint is inside the rectangle
        if ((x1 >= rectX && x1 <= rectX2 && y1 >= rectY && y1 <= rectY2) ||
            (x2 >= rectX && x2 <= rectX2 && y2 >= rectY && y2 <= rectY2)) {
            return true;
        }

        // Check intersection with each edge of the rectangle
        return (
            this.linesIntersect(x1, y1, x2, y2, rectX, rectY, rectX2, rectY) ||     // top edge
            this.linesIntersect(x1, y1, x2, y2, rectX2, rectY, rectX2, rectY2) ||   // right edge
            this.linesIntersect(x1, y1, x2, y2, rectX2, rectY2, rectX, rectY2) ||   // bottom edge
            this.linesIntersect(x1, y1, x2, y2, rectX, rectY2, rectX, rectY)        // left edge
        );
    }



    // checking weather the shape is inside the selection box
    isShapeInSelectionBox(shape: shape, box: { x: number; y: number; width: number; height: number }) {
        const boxRight = box.x + box.width;
        const boxBottom = box.y + box.height;

        // Rectangle
        if (shape.type === "RECTANGLE") {
            const shapeX = shape.startX;
            const shapeY = shape.startY;
            const shapeRight = shapeX + (shape.width ?? 0);
            const shapeBottom = shapeY + (shape.height ?? 0);

            return (
                shapeRight >= box.x &&
                shapeX <= boxRight &&
                shapeBottom >= box.y &&
                shapeY <= boxBottom
            );
        }

        // Circle 
        if (shape.type === "CIRCLE" && "radius" in shape) {
            console.log("inside the circle")

            const cx = shape.startX;
            const cy = shape.startY;
            const r = shape.radius || 0;

            return (
                cx + r >= box.x &&
                cx - r <= boxRight &&
                cy + r >= box.y &&
                cy - r <= boxBottom
            );
        }

        // Line (if you implement it)
        if (shape.type === "LINE" && "endX" in shape && "endY" in shape) {
            const minX = Math.min(shape.startX, shape.endX as number);
            const maxX = Math.max(shape.startX, shape.endX as number);
            const minY = Math.min(shape.startY, shape.endY as number);
            const maxY = Math.max(shape.startY, shape.endY as number);

            return (
                maxX >= box.x &&
                minX <= boxRight &&
                maxY >= box.y &&
                minY <= boxBottom
            );
        }

        if (shape.type === "PENCIL" && shape.pencilPath) {

            // Check if pencilPath has elements
            if (shape.pencilPath.length === 0) {
                return false;
            }

            for (let i = 0; i < shape.pencilPath.length; i++) {
                const point = shape.pencilPath[i];
                if (point.x >= box.x && point.x <= boxRight &&
                    point.y >= box.y && point.y <= boxBottom) {
                    return true;
                }
            }

            // Method 2: Check if any line segment of the pencil path intersects with the selection box
            for (let i = 0; i < shape.pencilPath.length - 1; i++) {
                const current = shape.pencilPath[i];
                const next = shape.pencilPath[i + 1];

                if (this.lineIntersectsRect(
                    current.x, current.y,
                    next.x, next.y,
                    box.x, box.y,
                    box.x + box.width, box.y + box.height
                )) {
                    return true;
                }
            }

            // Method 3: Check if pencil path bounding box intersects with selection box
            let minX = shape.pencilPath[0].x;
            let maxX = shape.pencilPath[0].x;
            let minY = shape.pencilPath[0].y;
            let maxY = shape.pencilPath[0].y;

            shape.pencilPath.forEach(point => {
                minX = Math.min(minX, point.x);
                maxX = Math.max(maxX, point.x);
                minY = Math.min(minY, point.y);
                maxY = Math.max(maxY, point.y);
            });

            return (
                maxX >= box.x &&
                minX <= boxRight &&
                maxY >= box.y &&
                minY <= boxBottom
            );
        }

        return false;

    };



    // drawing a selection box when mouse move 
    // it will display the rectangular selection box
    drawSelectionBox() {
        if (!this.ctx) return;
        const { x, y, width, height } = this.selectionBox;
        this.ctx.beginPath();
        this.ctx.strokeStyle = "oklch(67.3% 0.182 276.935)";
        this.ctx.lineWidth = 1.5;
        this.ctx.setLineDash([6]);
        this.ctx.strokeRect(x, y, width, height)
        this.ctx.setLineDash([]);

    }

    mouseDownHandler = (e: MouseEvent) => {

        // Don't draw if panning
        if (this.isPanningCanvas) {
            return;
        }

        // Convert screen coordinates to world coordinates
        const worldCoords = this.screenToWorld(e.clientX, e.clientY);

        // Don't start drawing if Shift is held (for panning), but still update position
        if (e.shiftKey) {
            // Update startX/startY so line tool doesn't start from 0,0
            this.startX = worldCoords.x;
            this.startY = worldCoords.y;
            return;
        }

        this.clicked = true;
        this.startX = worldCoords.x;
        this.startY = worldCoords.y;

        // setting the starting point for selection box 
        if (this.selectedTool === 'MOUSE_SELECTION') {
            this.selectionBox = {
                x: worldCoords.x,
                y: worldCoords.y,
                width: 0,
                height: 0,
                active: true
            }

            // console.log(this.selectionBox);

        }

    }


    handleMouseMove = (e: MouseEvent) => {

        // Don't draw if panning
        if (this.isPanningCanvas) {
            return;
        }

        // Convert screen coordinates to world coordinates
        const worldCoords = this.screenToWorld(e.clientX, e.clientY);

        if (this.selectedTool === "MOUSE_SELECTION" && this.selectionBox.active === true) {
            this.selectionBox = {
                x: Math.min(this.selectionBox.x, worldCoords.x),
                y: Math.min(this.selectionBox.y, worldCoords.y),
                width: Math.abs(worldCoords.x - this.selectionBox.x),
                height: Math.abs(worldCoords.y - this.selectionBox.y),
                active: true
            }

            this.clearcanvas();

        }

        // for drawing the in general shapes 
        if (this.clicked) {

            this.width = worldCoords.x - this.startX;
            this.height = worldCoords.y - this.startY;

            if (this.socket && this.socket.readyState === WebSocket.OPEN) {

                if (!this.ctx) {
                    return;
                }

                // For non-pencil tools, clear and redraw with transform
                if (this.selectedTool !== "PENCIL") {
                    this.clearcanvas();

                    // Apply viewport transform for live preview drawing
                    const dpr = window.devicePixelRatio || 1;
                    this.ctx.save();
                    this.ctx.setTransform(
                        this.viewport.scale * dpr, 0,
                        0, this.viewport.scale * dpr,
                        this.viewport.offsetX * dpr, this.viewport.offsetY * dpr
                    );
                }

                if (this.selectedTool === "RECTANGLE") {
                    const shape: shape = {
                        type: this.selectedTool,
                        startX: this.startX,
                        startY: this.startY,
                        width: this.width,
                        height: this.height,

                    }

                    this.drawRectangle(shape);
                } else if (this.selectedTool === "CIRCLE") {
                    this.radius = Math.abs(Math.max(this.width, this.height) / 2);
                    this.centerX = this.startX + this.width / 2;
                    this.centerY = this.startY + this.height / 2;

                    const shape: shape = {
                        type: this.selectedTool,
                        startX: this.centerX,
                        startY: this.centerY,
                        width: this.width,
                        height: this.height,
                        radius: this.radius,
                        centerX: this.centerX,
                        centerY: this.centerY

                    }

                    this.drawCircle(shape);


                } else if (this.selectedTool === "LINE") {


                    const shape: shape = {
                        type: this.selectedTool,
                        startX: this.startX,
                        startY: this.startY,
                        endX: worldCoords.x,
                        endY: worldCoords.y,
                        height: this.height,
                        width: this.width

                    }
                    this.drawLine(shape);
                    // this.clearcanvas();
                } else if (this.selectedTool === "PENCIL") {

                    this.pencilPath.push({ x: worldCoords.x, y: worldCoords.y });

                    const shape: shape = {
                        type: this.selectedTool,
                        startX: this.startX,
                        startY: this.startY,
                        height: 0,
                        width: 0,
                        pencilPath: this.pencilPath

                    }

                    // Apply viewport transform for pencil drawing
                    const dpr = window.devicePixelRatio || 1;
                    this.ctx.save();
                    this.ctx.setTransform(
                        this.viewport.scale * dpr, 0,
                        0, this.viewport.scale * dpr,
                        this.viewport.offsetX * dpr, this.viewport.offsetY * dpr
                    );

                    this.drawPencil(shape);

                    this.ctx.restore();
                    // this.clearcanvas();

                }

                // Restore context for non-pencil tools
                if (this.selectedTool !== "PENCIL") {
                    this.ctx.restore();
                }


            }






        }
    }

    mouseMoveHandler = (e: MouseEvent) => {

        requestAnimationFrame(() => {
            this.handleMouseMove(e);
        })

    }


    // handling thte mouse Up handling 
    mouseUpHandler = (e: MouseEvent) => {

        // If we were never in drawing mode (e.g., Shift+drag panning), don't send anything
        if (!this.clicked) {
            return;
        }

        this.clicked = false;

        // Convert screen coordinates to world coordinates
        const worldCoords = this.screenToWorld(e.clientX, e.clientY);
        const endX = worldCoords.x;
        const endY = worldCoords.y;

        const shape: shape = {
            type: this.selectedTool,
            startX: this.selectedTool === "CIRCLE" ? this.centerX : this.startX,
            startY: this.selectedTool === "CIRCLE" ? this.centerY : this.startY,
            height: this.height,
            width: this.width,
            radius: this.radius,
            endX: endX,
            endY: endY,
            pencilPath: this.pencilPath

        }
        this.pencilPath = [];



        // normalize the box 
        const normalizeBox = (box: { x: number, y: number, height: number, width: number }) => {
            const x = Math.min(box.x, box.x + box.width);
            const y = Math.min(box.y, box.y + box.height);
            const width = Math.abs(box.width);
            const height = Math.abs(box.height);
            return { x, y, width, height };
        };

        if (this.selectedTool === "MOUSE_SELECTION" && this.selectionBox.active === true) {

            const normBox = normalizeBox(this.selectionBox);
            this.selectedShape = this.existingShape.filter((s) => this.isShapeInSelectionBox(s, normBox))

            this.selectionBox.active = false;
            this.clearcanvas();
            return;
        }


        if (!this.socket) {
            return;
        }

        // Compare world coordinates properly (check if mouse didn't move significantly)
        const distanceMoved = Math.sqrt(
            Math.pow(endX - this.startX, 2) +
            Math.pow(endY - this.startY, 2)
        );

        // Only skip if mouse moved less than 2 pixels in world space
        if (distanceMoved < 2) {
            return;
        }

        if (this.selectedTool === "ERASER") {
            return;
        }

        this.existingShape.push(shape);
        this.clearcanvas();


        this.socket?.send(JSON.stringify({
            type: 'CHAT',
            roomId: this.roomId,
            content: shape
        }))

        console.log("after sending the msg");



    }


    // canvas mouse handlers 
    initMouseHandlers() {

        // adding mousedown event
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);

        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)

        this.canvas.addEventListener("mouseup", this.mouseUpHandler);

    }





    // for getting mouse posotion according to canvas 
    getMousePosition(e: MouseEvent): { x: number, y: number } {
        // Use screen to world conversion for accurate positioning
        return this.screenToWorld(e.clientX, e.clientY);
    }


    distanceToLine(x1: number, y1: number, x2: number, y2: number, px: number, py: number): number {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        let param = -1;

        if (len_sq !== 0) {
            param = dot / len_sq;
        }

        let xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;

        return Math.sqrt(dx * dx + dy * dy);
    }


    // function for checking  the intersection of pencilpath
    distPointToLineSegement(x: number, y: number, current: { x: number, y: number }, next: { x: number, y: number }) {
        const A = x - current.x;
        const B = y - current.y;
        const C = next.x - current.x;
        const D = next.y - current.y;

        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        let param = -1;
        if (len_sq !== 0) param = dot / len_sq;

        let xx, yy;

        if (param < 0) {
            xx = current.x;
            yy = current.y;
        } else if (param > 1) {
            xx = next.x;
            yy = next.y;
        } else {
            xx = current.x + param * C;
            yy = current.y + param * D;
        }

        const dx = x - xx;
        const dy = y - yy;
        return Math.sqrt(dx * dx + dy * dy);

    }

    // funciton to check which shape is intersecting the eraser to 
    //  remove the object then 

    isShapeIntersetcting(shape: shape, box: { x: number, y: number, width: number, height: number }): boolean {

        if (shape.type === "RECTANGLE") {
            // Normalize the shape box to handle negative width/height
            const shapeLeft = Math.min(shape.startX, shape.startX + shape.width);
            const shapeRight = Math.max(shape.startX, shape.startX + shape.width);
            const shapeTop = Math.min(shape.startY, shape.startY + shape.height);
            const shapeBottom = Math.max(shape.startY, shape.startY + shape.height);

            return !(
                box.x > shapeRight ||
                box.x + box.width < shapeLeft ||
                box.y > shapeBottom ||
                box.y + box.height < shapeTop
            )
        } else if (shape.type === "CIRCLE") {

            if (!shape.radius) return false;

            // getting the centerX and ceterY of the circle 
            const centerX = shape.startX;
            const centerY = shape.startY;
            // Find the closest point on the eraser box to the circle center
            const closestX = Math.max(box.x, Math.min(centerX, box.x + box.width));
            const closestY = Math.max(box.y, Math.min(centerY, box.y + box.height));

            const dx = centerX - closestX;
            const dy = centerY - closestY;

            const distance = dx * dx + dy * dy;

            return distance <= shape.radius * shape.radius




        } else if (shape.type === "LINE") {

            const { startX, startY, endX, endY } = shape;
            if (endX === undefined || endY === undefined) return false;

            const eraserCenterX = box.x + box.width / 2;
            const eraserCenterY = box.y + box.height / 2;
            const eraserRadius = box.width / 2;

            // Calculate distance from eraser center to the line
            const dist = this.distanceToLine(startX, startY, Number(endX), Number(endY), eraserCenterX, eraserCenterY);

            // Increase tolerance for better line erasing (eraser radius + line thickness buffer)
            return dist <= eraserRadius + 4;



        } else if (shape.type === "PENCIL") {
            if (!shape.pencilPath) return false;

            const eraserX = box.x + box.width / 2;
            const eraserY = box.y + box.height / 2
            const eraserRadius = box.width / 2;

            // Check each line segment in the pencil path
            for (let i = 0; i < shape.pencilPath.length - 1; i++) {
                const current = shape.pencilPath[i];
                const next = shape.pencilPath[i + 1];
                const dist = this.distPointToLineSegement(eraserX, eraserY, current, next);

                // Add buffer for pencil line thickness (5px)
                if (dist <= eraserRadius + 2.5) {
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }




    }

    deleteErasedShapes() {

        if (!this.existingShape || !this.socket) return;

        console.log("erasing the shapes ")
        // sending the existing shapes 
        this.socket.send(JSON.stringify({
            type: "UPDATE_CHATS",
            content: this.existingShape,
            roomId: this.roomId
        }))

    }

    // functon for checking if any shape is in eraser path to remove from canvas 
    checkEraserCollisions(x: number, y: number) {
        // Only check collisions if eraser tool is selected
        if (this.selectedTool !== "ERASER") {
            return;
        }

        // Keep eraser size constant in world coordinates (divided by scale to stay same visual size)
        const eraserSizeInScreen = 20; // Fixed screen size (20px)
        const eraserSizeInWorld = eraserSizeInScreen / this.viewport.scale;

        const eraserBox = {
            x: x - eraserSizeInWorld / 2,
            y: y - eraserSizeInWorld / 2,
            width: eraserSizeInWorld,
            height: eraserSizeInWorld
        }

        // Filter out erased shapes
        this.existingShape = this.existingShape.filter(
            (shape) => !this.isShapeIntersetcting(shape, eraserBox)
        );

        // Always clear and redraw when actively erasing to keep canvas updated
        this.clearcanvas();
    }


    // function to display the eraser preview or shape 
    displayEraserPreview(e: MouseEvent) {

        // Only display preview if eraser tool is selected
        if (this.selectedTool !== "ERASER") {
            return;
        }

        if (!this.ctx) return;

        const { x, y } = this.getMousePosition(e);

        const dpr = window.devicePixelRatio || 1;

        // Fixed eraser size in screen space (20px diameter)
        const eraserRadiusInScreen = 10; // 10px radius = 20px diameter
        const eraserRadiusInWorld = eraserRadiusInScreen / this.viewport.scale;

        // Clear canvas when hovering (not erasing)
        // When erasing, checkEraserCollisions handles clearcanvas before we draw preview
        if (!this.isErasing) {
            this.clearcanvas();
        }

        // Apply viewport transform for eraser preview (including DPR)
        this.ctx.save();
        this.ctx.setTransform(
            this.viewport.scale * dpr, 0,
            0, this.viewport.scale * dpr,
            this.viewport.offsetX * dpr, this.viewport.offsetY * dpr
        );

        // Draw eraser preview circle
        this.ctx.beginPath();
        this.ctx.arc(x, y, eraserRadiusInWorld, 0, Math.PI * 2);
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.15)"; // slightly more visible
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2 / this.viewport.scale; // Scale line width
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.restore();

    }


    eraserDownHandler = (e: MouseEvent) => {

        // Only run if eraser tool is selected
        if (this.selectedTool !== "ERASER") {
            return;
        }

        // Don't erase if panning or Shift is held
        if (this.isPanningCanvas || e.shiftKey) {
            return;
        }

        // it is used to display the eraser shape 

        this.isErasing = true;
        const { x, y } = this.getMousePosition(e);
        this.eraserPath = [{ x, y }];
        this.checkEraserCollisions(x, y);
    }

    eraserMoveHandler = (e: MouseEvent) => {

        // Only run if eraser tool is selected
        if (this.selectedTool !== "ERASER") {
            return;
        }

        // Don't erase if panning
        if (this.isPanningCanvas) {
            return;
        }

        // Throttle collision checking (erasing) using requestAnimationFrame
        if (this.isErasing && !this.eraserPreviewScheduled) {
            this.eraserPreviewScheduled = true;
            this.eraserAnimationFrameId = requestAnimationFrame(() => {
                // Double-check tool hasn't changed during frame delay
                if (this.selectedTool !== "ERASER") {
                    this.eraserPreviewScheduled = false;
                    this.eraserAnimationFrameId = null;
                    return;
                }

                // Erase shapes if mouse is down
                if (this.isErasing) {
                    const { x, y } = this.getMousePosition(e);
                    this.eraserPath.push({ x, y });
                    this.checkEraserCollisions(x, y);

                    // Always show preview after erasing to keep it visible
                    this.displayEraserPreview(e);
                }

                this.eraserPreviewScheduled = false;
                this.eraserAnimationFrameId = null;
            });
        } else if (!this.isErasing) {
            // Show preview immediately when just hovering (not erasing)
            this.displayEraserPreview(e);
        }
    }

    eraserUpHandler = (e: MouseEvent) => {
        // Only run if eraser tool is selected
        if (this.selectedTool !== "ERASER") {
            return;
        }

        if (this.isErasing) {
            this.deleteErasedShapes();
            this.isErasing = false;
            this.eraserPath = [];
        }

        // Show preview after releasing mouse (only if still on eraser tool)
        if (this.selectedTool === "ERASER") {
            this.displayEraserPreview(e);
        }
    }


    // eraser mouse hanlders 
    initEraserHandlers() {
        if (!this.canvas) {
            return;
        }

        // Remove any existing eraser handlers first to prevent duplicates
        this.removeEraserHandlers();

        this.canvas.addEventListener("mousedown", this.eraserDownHandler);
        this.canvas.addEventListener("mousemove", this.eraserMoveHandler);
        this.canvas.addEventListener("mouseup", this.eraserUpHandler);
    }

    // Remove eraser handlers when switching to another tool
    removeEraserHandlers() {
        if (!this.canvas) {
            return;
        }

        // Cancel any pending animation frame
        if (this.eraserAnimationFrameId !== null) {
            cancelAnimationFrame(this.eraserAnimationFrameId);
            this.eraserAnimationFrameId = null;
        }

        this.canvas.removeEventListener("mousedown", this.eraserDownHandler);
        this.canvas.removeEventListener("mousemove", this.eraserMoveHandler);
        this.canvas.removeEventListener("mouseup", this.eraserUpHandler);

        // Reset eraser state
        this.isErasing = false;
        this.eraserPath = [];
        this.eraserPreviewScheduled = false;

        // Force clear canvas to remove any lingering eraser preview
        this.clearcanvas();
    }






}

