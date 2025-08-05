
import axios from "axios";
import { shape } from "@/types";


export const getExistingShapes = async (roomId: number) => {

    console.log("inside the getShapes function ")
    const backend_url = process.env.NEXT_PUBLIC_HTTP_BAKCKEND_URL;
    console.log(backend_url);
    const response = await axios.get(`${backend_url}/shapes/${roomId}`);
    console.log(response);
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