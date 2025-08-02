

export type Tool = "RECTANGLE" | "CIRCLE" | "LINE" | "PENCIL" | "ERASER" | "MOUSE_SELECTION";

export type shape = {
    type: Tool,
    startX: number
    startY: number,
    color?: string,
    height: number,
    width: number,
    lineWidth?: number,
    endX?: number,
    endY?: number,
    radius?: number
    centerX?: number,
    centerY?: number

};

export type EraserPathType = {
    x: number,
    y: number

}