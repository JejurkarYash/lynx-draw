type userInfo = {
    UserId: string,
    email: string
}

declare namespace Express {
    interface Request {
        userId: string
    }

}