import "reflect-metadata"
import { DataSource } from "typeorm";
import { AdminEntity } from "./entity/adminEntity";
import { ProjectEntity } from "./entity/projectEntity";
import { UserEntity } from "./entity/userEntity";
import * as dotenv from "dotenv";
dotenv.config();


export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.HOST,
    port: 5432,
    username: "postgres",
    password: "test",
    database: "hackathon",
    synchronize: true,
    logging: false,
    entities: [UserEntity , AdminEntity , ProjectEntity],
    subscribers: [],
    migrations: [],
})