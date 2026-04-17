require('dotenv').config();
const app = require('./src/app');
const ConnectDB = require('./src/DATABASE/DB');
const PORT = "https://frontend-interviewiq-ai.onrender.com";

app.listen(PORT, async ()=>{
        await ConnectDB();
        console.log("Server is running ✅")
})
