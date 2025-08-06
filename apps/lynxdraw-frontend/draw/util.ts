
import axios from "axios";
import { shape } from "@/types";


export const getExistingShapes = async (roomId: number) => {

    const backend_url = process.env.NEXT_PUBLIC_HTTP_BAKCKEND_URL;
    const response = await axios.get(`${backend_url}/shapes/${roomId}`);
    if (!response) {
        return;
    }

    const messages = response.data.chats;

    const existingShapes = messages.map((msg: { msg: shape }) => {

        const message = msg;
        return message;
    })

    return existingShapes;

}