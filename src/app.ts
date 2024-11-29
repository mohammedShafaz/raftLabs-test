import express, {Express} from "express";
import config from "./config/config";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
export class App{
    private app: Express;
    private port: number;
    private server:http.Server

    constructor(){
        this.app= express();
        this.port=this.getPort();
        this.server=http.createServer(this.app);
        this.setupMiddleware();
        this.setupDatabase();
    }
    
    private getPort():number{
        const port=  parseInt(config.port.toString(),10);
        if (isNaN(port)) {
            throw new Error(`Invalid PORT value: ${port}`)
        }
        return port;
    }
    private setupDatabase(): void {
        mongoose.connect(config.db, {
            maxPoolSize: 10
        }).then(() => {
            console.log("Database connected successfully...")
        }).catch(err => console.error('Error connecting to MongoDB', err));
    }
    private setupMiddleware(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(helmet())
    }

    public start(): void{
        this.server.listen(this.port, ()=>{
            console.log(`Server is running at port : ${this.port}`);
            
        })
    }
}