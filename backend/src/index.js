import dotenv from "dotenv";
import app from "./app.js";
dotenv.config({
    path: "./.env",
});

app.on("error", (error) => {
    console.error("SERVER ERROR: ", error);
    throw error;
});
app.listen(process.env.PORT || 8000, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
