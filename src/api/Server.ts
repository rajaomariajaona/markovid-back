import express from 'express';
import bodyParser from "body-parser"
import compression from "compression"
import router from './routerApi';
import { createConnection } from 'typeorm';
import { ormconfig } from '../config';
import { createServer } from 'http';
export class CustomServer {
    app = express()
    static io
    constructor() {
        var cors = require("cors")
        this.app.use(cors())
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(bodyParser.json())
        this.app.use("/api", compression())
        this.app.use("/api", router)
        const http = createServer(this.app)
        http.listen(process.env.PORT || 3000)
        console.log("Mtatitra is ONLINE ")
        CustomServer.io = require('socket.io')(http);
        CustomServer.io.on('connection', (socket) => {
            socket.on("ajout room", (roomName) => {
                socket.join(roomName)
            })
        });
    }
}