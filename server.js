// const serverless = require("serverless-http");
const express = require("express");
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
// const commentsRoutes = require("./routes/comments");
// const injectDb = require("./middleware/injectDb");
var cors = require("cors");
var cookieParser = require("cookie-parser");
// Аппын тохиргоог process.env рүү ачаалах
dotenv.config({ path: "./config/config.env" });

// const db = require("./config/db-mysql");

const app = express();

connectDB();

// create a write stream (in append mode)
var accessLogStream = rfs.createStream("access.log", {
	interval: "1d", // rotate daily
	path: path.join(__dirname, "log"),
});

var whitelist = [
	"http://localhost:3000",
	"https://christian-book-react.vercel.app/",
	"http://christian-book-react.vercel.app/",
];

var corsOptions = {
	origin: function (origin, callback) {
		console.log("🚀 ~ file: server.js ~ line 37 ~ origin", origin);

		if (origin === undefined || whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	allowedHeaders: "Authorization, Set-Cookie, Content-Type",
	methods: "GET, POST , PUT, DELETE",
	credentials: true,
};

// Body parser
// app.use(serverless);
app.use(cookieParser());
app.use(logger);
app.use(express.json());
app.use(cors(corsOptions));
app.use(fileupload());
// app.use(injectDb(db));
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/books", booksRoutes);
app.use("/api/v1/users", usersRoutes);
// app.use("/api/v1/comments", commentsRoutes);
app.use(errorHandler);

// db.user.belongsToMany(db.book, { through: "comment" });
// db.book.belongsToMany(db.user, { through: "comment" });
// db.category.hasMany(db.book);
// db.book.belongsTo(db.category);

// db.sequelize
// 	.sync()
// 	.then((result) => {
// 		console.log("sync hiigdlee...");
// 	})
// 	.catch((err) => console.log(err));

const server = app.listen(
	process.env.PORT,
	console.log(`Express сэрвэр ${process.env.PORT} порт дээр аслаа... `.rainbow),
);

process.on("unhandledRejection", (err, promise) => {
	console.log(`Алдаа гарлаа : ${err.message}`.underline.red.bold);
	server.close(() => {
		process.exit(1);
	});
});
