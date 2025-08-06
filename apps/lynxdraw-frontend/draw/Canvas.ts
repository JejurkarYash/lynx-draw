
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

    // set the current tool for drawing 
    selectCurrentTool(selectedTool: Tool) {
        this.selectedTool = selectedTool;


        if (this.selectedTool !== "MOUSE_SELECTION") {
            this.canvas.style.cursor = "crosshair";
        }

        if (this.selectedTool === "ERASER") {
            // remove the mousemove handler when the tool is eraser so ensure that it will never overwritten; 
            this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
            this.initEraserHandlers();
            this.canvas.style.cursor = "none";
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

        this.ctx.scale(dpr, dpr);

        // definging some global styling for drawing elements 
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";

        this.existingShape = await getExistingShapes(this.roomId);
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

        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // printing the existing shapes after clearing the canvas
        console.log(this.existingShape);
        if (this.existingShape) {

            this.existingShape.map((shape: shape) => {

                if (this.selectedShape.some((s) => s === shape)) {
                    console.log("shape: ", shape,);
                    if (!this.ctx) return;
                    this.ctx.strokeStyle = "oklch(67.3% 0.182 276.935)";
                    this.ctx.lineWidth = 1.5;

                    // cheking if the selected shape is circle or rectangle 
                    if (shape.type === "CIRCLE") {

                        // this is for circle
                        if (!shape.radius || !shape.centerX || !shape.centerY) {
                            return;
                        }
                        const boxX = shape.centerX - shape.radius - 4;
                        const boxY = shape.centerY - shape.radius - 4;
                        const size = shape.radius * 2 + 8;
                        this.ctx.strokeRect(boxX, boxY, size, size);

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





    }




    // logic for drawing rectangle
    drawRectangle(shape: shape) {
        if (!this.ctx) {
            return;
        }
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 4;
        this.ctx?.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
    }

    //  drawing logic for circle 
    drawCircle(shape: shape) {
        if (!this.ctx || !shape.radius) {
            return;
        };

        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 4;
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
        this.ctx.lineWidth = 4;
        this.ctx?.beginPath();
        this.ctx?.moveTo(shape.startX, shape.startY);
        this.ctx?.lineTo(Number(shape.endX), Number(shape.endY));
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawPencil(shape: shape) {

        if (!this.ctx || !shape.pencilPath) return;
        console.log(shape);
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        for (let i = 1; i < this.pencilPath.length; i++) {
            let prev = shape.pencilPath[i - 1];
            let current = shape.pencilPath[i];

            this.ctx.moveTo(prev.x, prev.y);
            this.ctx.lineTo(current.x, current.y);

        }
        this.ctx.stroke();


    }



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

        // Default fallback (e.g., freehand)
        return false;
    };



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

        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;





        // setting the starting point for selection box 


        if (this.selectedTool === 'MOUSE_SELECTION') {
            this.selectionBox = {
                x: e.clientX,
                y: e.clientY,
                width: 0,
                height: 0,
                active: true
            }

            console.log(this.selectionBox);

        }


    }


    handleMouseMove = (e: MouseEvent) => {

        if (this.selectedTool === "MOUSE_SELECTION" && this.selectionBox.active === true) {
            this.selectionBox = {
                x: Math.min(this.selectionBox.x, e.clientX),
                y: Math.min(this.selectionBox.y, e.clientY),
                width: Math.abs(e.clientX - this.selectionBox.x),
                height: Math.abs(e.clientY - this.selectionBox.y),
                active: true
            }

            this.clearcanvas();

        }

        // for drawing the in general shapes 
        if (this.clicked) {

            this.width = e.clientX - this.startX;
            this.height = e.clientY - this.startY;

            if (this.socket && this.socket.readyState === WebSocket.OPEN) {

                if (!this.ctx) {
                    return;
                }

                if (this.selectedTool !== "PENCIL") {
                    this.clearcanvas();
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
                        endX: e.clientX,
                        endY: e.clientY,
                        height: this.height,
                        width: this.width

                    }
                    this.drawLine(shape);
                    this.clearcanvas();
                } else if (this.selectedTool === "PENCIL") {

                    this.pencilPath.push({ x: e.clientX, y: e.clientY });

                    const shape: shape = {
                        type: this.selectedTool,
                        startX: this.startX,
                        startY: this.startY,
                        height: 0,
                        width: 0,
                        pencilPath: this.pencilPath

                    }

                    this.drawPencil(shape);



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

        this.clicked = false;
        const endX = e.clientX;
        const endY = e.clientY;

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

        if (this.startX === e.clientX) {
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
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left),
            y: (e.clientY - rect.top)
        }

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


    // funciton to check which shape is intersecting the eraser to 
    //  remove the object then 

    isShapeIntersetcting(shape: shape, box: { x: number, y: number, width: number, height: number }): boolean {

        const shapeBox = {
            x: shape.startX,
            y: shape.startY,
            width: shape.width,
            height: shape.height
        }

        if (shape.type === "RECTANGLE") {
            return !(
                box.x > shapeBox.x + shapeBox.width ||
                box.x + box.width < shapeBox.x ||
                box.y > shapeBox.y + shapeBox.height ||
                box.y + box.height < shapeBox.y
            )
        } else if (shape.type === "CIRCLE") {

            if (!shape.radius) return false;

            // getting the centerX and ceterY of the circle 
            const centerX = shape.startX;
            const centerY = shape.startY;
            // Find the closest point on the selection box to the circle center
            const closestX = Math.max(box.x, Math.min(centerX, box.x + box.width));
            const closestY = Math.max(box.y, Math.min(centerY, box.y + box.height));

            const dx = centerX - closestX;
            const dy = centerY - closestY;

            const distance = dx * dx + dy * dy;

            return distance <= shape.radius * shape.radius




        } else if (shape.type === "LINE") {

            const { startX, startY, endX, endY } = shape;

            const dist = this.distanceToLine(startX, startY, Number(endX), Number(endY), box.x + box.width / 2, box.y + box.height / 2);

            return dist <= box.width / 2;



        }


        else {
            return false;
        }




    }

    deleteErasedShapes() {

        if (!this.existingShape || !this.socket) return;

        // sending the existing shapes 
        this.socket.send(JSON.stringify({
            type: "UPDATE_CHATS",
            content: this.existingShape,
            roomId: this.roomId
        }))

    }

    // functon for checking if any shape is in eraser path to remove from canvas 
    checkEraserCollisions(x: number, y: number) {
        const eraserSize = 10;
        const eraserBox = {
            x: x - eraserSize / 2,
            y: y - eraserSize / 2,
            width: eraserSize,
            height: eraserSize
        }


        // rendering the erased shapes 
        this.existingShape = this.existingShape.filter(
            (shape) => !this.isShapeIntersetcting(shape, eraserBox)
        );

        this.clearcanvas();


    }


    // function to display the eraser preview or shape 
    displayEraserPreview(e: MouseEvent) {

        if (!this.ctx) return;
        this.clearcanvas();

        const { x, y } = this.getMousePosition(e);


        this.ctx?.beginPath();
        this.ctx.arc(x, y, 10 / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // light preview
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        this.ctx.fill();
        this.ctx.stroke();

    }


    eraserDownHandler = (e: MouseEvent) => {

        // it is used to display the eraser shape 

        this.isErasing = true;
        const { x, y } = this.getMousePosition(e);
        this.eraserPath = [{ x, y }];
        this.checkEraserCollisions(x, y);
        this.displayEraserPreview(e);
    }

    eraserMoveHandler = (e: MouseEvent) => {


        // for reducing the visual lag
        requestAnimationFrame(() => {

            this.displayEraserPreview(e);
            if (!this.isErasing) return;
            const { x, y } = this.getMousePosition(e);
            this.eraserPath.push({ x, y });
            this.checkEraserCollisions(x, y);
            this.displayEraserPreview(e);
        })





    }

    eraserUpHandler = (e: MouseEvent) => {
        this.deleteErasedShapes();
        this.displayEraserPreview(e);
        this.isErasing = false;
        this.eraserPath = [];
    }


    // eraser mouse hanlders 
    initEraserHandlers() {
        if (!this.canvas) {
            return;
        }

        this.canvas.addEventListener("mousedown", this.eraserDownHandler);
        this.canvas.addEventListener("mousemove", this.eraserMoveHandler);
        this.canvas.addEventListener("mouseup", this.eraserUpHandler);

    }






}

