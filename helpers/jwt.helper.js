const JWT = require("jsonwebtoken");
const createError = require("http-errors");

module.exports = {
    signAccessToken: function(userId) {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: "1h",
                issuer: "rohit.com",
                audience: userId.toString(),
            };
            JWT.sign(payload, secret, options, (err, token) => {
                if(err) {
                    console.log(err.message);
                    reject(createError.InternalServerError());
                }
                resolve(token);
            })
        })
    },

    verifyAccessToken: function(req, res, next) {
        if(!req.headers["authorization"]) return next(createError.Unauthorized());
        const token = req.headers['authorization'].split(" ")[1];
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
            if(error) {
                const message = (error.name === "JsonWebTokenError") ? "Unauthorized" : error.message;
                return createError.Unauthorized(message);
            }
            req.payload = payload;
            next();
        });
    },

    // signRefreshToken: function(userId) {
    //     return new Promise((resolve, reject) => {
    //         const payload = {};
    //         const secret = process.env.REFRESH_TOKEN_SECRET;
    //         const options = {
    //             expiresIn: "1y",
    //             issuer: "rohit.com",
    //             audience: userId.toString(),
    //         };
    //         JWT.sign(payload, secret, options, (err, token) => {
    //             if(err) {
    //                 console.log(err.message);
    //                 reject(createError.InternalServerError());
    //             }
    //             resolve(token);
    //         })
    //     })
    // },
}