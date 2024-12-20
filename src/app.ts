import express, { Express, Request } from "express";
import config from "./config/config";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { initializeSocketServer } from "./socket";
import { verifyToken } from "./utils/auth";
import { WebSocket } from 'ws';
import { PubSub } from "graphql-subscriptions";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
export class App {
    private app: Express;
    private port: number;
    private server: http.Server
    private pubsub: PubSub;
    constructor() {
        this.app = express();
        this.port = this.getPort();
        this.server = http.createServer(this.app);
        this.pubsub = new PubSub();
        this.setupMiddleware();
        this.setupDatabase();
        this.setUpGraphQL();
        this.setUpWebSocket()

        this.setUpSocketIo();
    }

    private getPort(): number {
        const port = parseInt(config.port.toString(), 10);
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
        }).catch(err => {
            console.error('Error connecting to MongoDB', err);
            process.exit(1);
        });
    }
    private setupMiddleware(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(helmet());
    }

    private setUpSocketIo(): void {
        initializeSocketServer(this.server);

    }

    private setUpGraphQL(): void {
        this.app.use('/graphql', graphqlHTTP((req) => {
            try {
                const authHeader = req.headers.authorization || '';
                const token = authHeader.split(' ')[1];
                const user = token ? verifyToken(token) : null;
                return {
                    schema,
                    rootValue: resolvers,
                    graphiql: {
                        headerEditorEnabled: true
                    },
                    context: { user, pubsub: this.pubsub },
                };
            } catch (error) {
                console.error('GraphQL authentication error:', error);
                throw new Error('Authentication failed.');
            }
        }));

    }
    private setUpWebSocket(): void {
        const wsServer = new WebSocket.Server({
            server: this.server,
            path: '/subscriptions',
        });

        SubscriptionServer.create({
            schema,
            execute,
            subscribe,
            onConnect: () => {
                console.log("WebSocket connected for subscriptions");
                return { pubsub: this.pubsub };
            },
            onDisconnect: () => {
                console.log("WebSocket disconnected");
            },

        }, wsServer)
    }

    public start(): void {
        this.server.listen(this.port, () => {
            console.log(`GraphQL server running at http://localhost:${this.port}/graphql `);
            console.log(`WebSocket subscriptions running at ws://localhost:${this.port}/subscriptions`);

        });

        process.on('SIGINT', async () => {
            console.log('Received SIGINT. Closing HTTP server...');
            this.server.close(() => {
                console.log('HTTP server closed');
            });

            try {
                await mongoose.connection.close(false);
                console.log('MongoDB connection closed');
                process.exit(0);
            } catch (err) {
                console.error('Error closing MongoDB connection', err);
                process.exit(1);
            }
        });
    }
}