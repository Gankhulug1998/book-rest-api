const express = require("express");
const fs = require('fs');
const http = require('http');
const https = require('https');
const dotenv = require("dotenv");
var path = require("path");
var rfs = require("rotating-file-stream");
const connectDB = require("./config/db");
const colors = require("colors");
const errorHandler = require("./middleware/error");
var morgan = require("morgan");
const logger = require("./middleware/logger");
const fileupload = require("express-fileupload");
// Router оруулж ирэх
const categoriesRoutes = require("./routes/categories");
const booksRoutes = require("./routes/books");
const usersRoutes = require("./routes/users");
// var cors = require("cors");
var cookieParser = require("cookie-parser");
// Аппын тохиргоог process.env рүү ачаалах
dotenv.config({
	path: "./config/config.env"
});

var options = {
	key: fs.readFileSync('./key.pem', 'utf8'),
	cert: fs.readFileSync('./server.crt', 'utf8')
};

const app = express();



connectDB();

// create a write stream (in append mode)
var accessLogStream = rfs.createStream("access.log", {
	interval: "1d", // rotate daily
	path: path.join(__dirname, "log"),
});

// var whitelist = [
// 	"http://localhost",
// 	"https://localhost/",
// 	"https://christian-book-react.vercel.app/",
// 	"https://christian-book-react.vercel.app",
// 	"http://188.166.19.36/",
// 	"https://188.166.19.36/",
// ];

// var corsOptions = {
// 	origin: function (origin, callback) {
// 		console.log("🚀 ~ file: server.js ~ line 37 ~ origin", origin);
// 		if (origin === undefined || whitelist.indexOf(origin) !== -1) {
// 			callback(null, true);
// 		} else {
// 			callback(new Error("Not allowed by CORS"));
// 		}
// 	},
// 	allowedHeaders: "Authorization, Set-Cookie, Content-Type",
// 	methods: "GET, POST , PUT, DELETE",
// 	credentials: true,
// };

// Body parser
app.use(cookieParser());
app.use(logger);
app.use(express.json());
// app.use(cors(corsOptions));
app.use(fileupload());
app.use(morgan("combined", {
	stream: accessLogStream
}));
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/books", booksRoutes);
app.use("/api/v1/users", usersRoutes);
app.use(errorHandler);

var server = https.createServer(options, app).listen(process.env.PORT, function () {
	console.log("Express server listening on port " + process.env.PORT);
});


process.on("unhandledRejection", (err, promise) => {
	console.log(`Алдаа гарлаа : ${err.message}`.underline.red.bold);
	server.close(() => {
		process.exit(1);
	});
});