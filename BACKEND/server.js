require('dotenv').config();
const app = require('./src/app');
const ConnectDB = require('./src/DATABASE/DB');

app.listen(3000, async ()=>{
        await ConnectDB();
        console.log("Server is running ✅")
})
