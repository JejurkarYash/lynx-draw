import React from 'react'
import Canvas from '@/components/CanvasPage';

const CanvasPage = async ({ params }: {
    params: Promise<{
        roomId: number
    }>
}) => {

    const roomId = (await params).roomId;
    return (
        <Canvas roomId={roomId}></Canvas>
    )
}

export default CanvasPage; 
