

import { getExistingShapes } from "./util";
import { Tool, shape } from "../types/index";





export class CanvasClass {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;
    private roomId: number;
    private startX: number;
    private startY: number;
    private width: number;
    private height: number;
    private clicked: boolean;
    private radius: number;
    private centerX: number;
    private centerY: number;
    private selectedShape: shape[] = [];
    private selectionBox: {
        x: number,
        y: number,
        width: number,
        height: number,
        active: ConstrainBoolean

    } = { x: 0, y: 0, width: 0, height: 0, active: false };

    private socket: WebSocket | undefined;
    private existingShape: shape[];
    private selectedTool: Tool;





    constructor(canvas: HTMLCanvasElement, roomId: number, socket: WebSocket | undefined) {

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

        // calling the function's 
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
        console.log(selectedTool);
    }


    // Initializing an empty canva && fetching an existing shapes 
    async initCanvas() {
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
            console.log(event.data);
            const message = JSON.parse(event.data);
            if (message.type === "CHAT") {
                const data = message.content;
                this.existingShape.push(data);
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

                if (shape.type === "RECTANGLE") {
                    this.drawRectangle(shape);
                } else if (shape.type === "CIRCLE") {
                    console.log("inside existing map");
                    this.drawCircle(shape);
                } else if (shape.type === "LINE") {
                    console.log(shape)
                    this.drawLine(shape);
                }

                if (this.selectedShape.some((s) => s === shape)) {
                    if (!this.ctx) return;
                    this.ctx.strokeStyle = "blue";
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(shape.startX - 4, shape.startY - 4, shape.width + 8, shape.height + 8);


                }
            })

        }





    }




    drawRectangle(shape: shape) {
        if (!this.ctx) {
            return;
        }
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 4;
        this.ctx?.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
    }


    drawCircle(shape: shape) {
        if (!this.ctx || !shape.radius) {
            return;
        };

        this.ctx.strokeStyle = "white";
        this.canvas.style.cursor = "crosshair";
        this.ctx.lineWidth = 4;

        this.ctx.beginPath();
        this.ctx.arc(shape.startX, shape.startY, shape.radius, 0, 2 * Math.PI, true);
        this.ctx.stroke();
        this.ctx.closePath();

    }

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


    isShapeInSelectionBox(shape: shape, box: { x: number; y: number; width: number; height: number; }) {
        const shapeX = shape.startX;
        const shapeY = shape.startY;
        const shapeWidth = shape.width ?? 0;
        const shapeHeight = shape.height ?? 0;

        const shapeRight = shapeX + shapeWidth;
        const shapeBottom = shapeY + shapeHeight;
        const boxRight = box.x + box.width;
        const boxBottom = box.y + box.height;

        return (
            shapeRight >= box.x &&
            shapeX <= boxRight &&
            shapeBottom >= box.y &&
            shapeY <= boxBottom
        );
    }


    drawSelectionBox() {
        if (!this.ctx) return;
        const { x, y, width, height } = this.selectionBox;
        this.ctx.strokeStyle = "rgba(0, 128, 255, 0.7)";
        this.ctx.setLineDash([6]);
        this.ctx.strokeRect(x, y, width, height)
        this.ctx.setLineDash([]);

    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        console.log("X: ", this.startX, "Y: ", this.startY);



        // setting the starting point for selection box 
        if (this.selectedTool === 'MOUSE_SELECTION') {

            this.selectionBox = {
                x: e.clientX,
                y: e.clientY,
                width: 0,
                height: 0,
                active: true
            }
        }


    }

    mouseMoveHandler = (e: MouseEvent) => {

        // for selection of shape
        if (this.selectedTool === "MOUSE_SELECTION" && this.selectionBox.active === true) {

            this.selectionBox = {
                x: Math.min(this.selectionBox.x, e.clientX),
                y: Math.min(this.selectionBox.y, e.clientY),
                width: Math.abs(e.clientX - this.selectionBox.x),
                height: Math.abs(e.clientY - this.selectionBox.y),
                active: true
            }

            this.clearcanvas();
            this.drawSelectionBox();

        }





        // for drawing the in general shapes 
        if (this.clicked) {

            this.width = e.clientX - this.startX;
            this.height = e.clientY - this.startY;

            if (this.socket && this.socket.readyState === WebSocket.OPEN) {

                if (!this.ctx) {
                    return;
                }

                this.clearcanvas();
                if (this.selectedTool === "RECTANGLE") {
                    const shape: shape = {
                        type: this.selectedTool,
                        startX: this.startX,
                        startY: this.startX,
                        width: this.width,
                        height: this.height,

                    }

                    this.drawRectangle(shape);
                } else if (this.selectedTool === "CIRCLE") {
                    this.centerX = this.startX + this.radius;
                    this.centerY = this.startY + this.radius;
                    this.radius = Math.abs(Math.max(this.width, this.height) / 2);

                    const shape: shape = {
                        type: this.selectedTool,
                        startX: this.centerX,
                        startY: this.centerY,
                        width: this.width,
                        height: this.height,
                        radius: this.radius

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
                }


            }






        }
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

        }


        if (this.selectedTool === "MOUSE_SELECTION" && this.selectionBox.active === true) {

            this.selectedShape = this.existingShape.filter((s) => this.isShapeInSelectionBox(s, this.selectionBox))

        }
        this.clearcanvas();
        this.selectionBox.active = false;


        if (!this.socket) {
            console.log("before returning the ");
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
    initMouseHandlers() {

        // adding mousedown event
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);

        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)

        this.canvas.addEventListener("mouseup", this.mouseUpHandler);

    }






}

