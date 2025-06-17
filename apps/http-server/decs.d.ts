type userInfo = {
    id: string,
    email: string
}

declare namespace Express {
    interface Request {
        userInfo?: userInfo
    }

}