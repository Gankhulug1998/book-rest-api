const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandle");
const MyError = require("../utils/myError");
const User = require("../models/User");

exports.protect = asyncHandler(async (req, res, next) => {
	let token = null;

	if (req.headers.authorization) {
		token = req.headers.authorization.split(" ")[1];
	} else if (req.cookies) {
		token = req.cookies["book-token"];
	}

	if (!token) {
		throw new MyError(
			"Энэ үйлдлийг хийхэд таны эрх хүрэхгүй байна. Та эхлээд логин хийнэ үү. Authorization header-ээр токеноо дамжуулна уу. Эсвэл Cookie ашиглана уу",
			401,
		);
	}

	const tokenObj = jwt.verify(token, process.env.JWT_SECRET);

	console.log(tokenObj);

	req.userId = tokenObj.id;
	req.userRole = tokenObj.role;

	next();
});

exports.authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.userRole)) {
			throw new MyError(
				"Уучлаарай энэ үйлдэлийг хийхэд таны эрх хүрэлцэхгүй байна",
				403,
			);
		}

		next();
	};
};
