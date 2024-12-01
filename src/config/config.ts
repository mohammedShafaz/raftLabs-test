import dotenv from 'dotenv';
dotenv.config();

const config = {
    port: process.env.PORT || "5000",
    db: process.env.DB_URL || "",
    jwtSecret: process.env.JWT_SECRET||"This_will_be_my_secret",
}

export default config