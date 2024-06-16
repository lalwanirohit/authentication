const createError = require("http-errors");

const { User } = require("../models");
const { signAccessToken, signRefreshToken } = require("../helpers/jwt.helper");
const { authSchema } = require("../helpers/validations.helper");

module.exports = {
    register: async function(req, res, next) {
        try {
            let { email, password } = await authSchema.validateAsync(req.body);

            let userExist = await User.findOne({
                where: { email: email }
            });

            if(userExist) throw createError.Conflict(`${email} is already been registered`);

            let user = await User.create({
                email,
                password,
            });
            let accessToken = await signAccessToken(user.userId);
            // let refreshToken = await signRefreshToken(user.userId);
            res.send({ accessToken });
        } catch (error) {
            if(error.isJoi == true) error.status = 422;
            next(error);
        }
    },

    login: async function(req, res, next) {
        try {
            let { email, password } = await authSchema.validateAsync(req.body);
            
            let user = await User.findOne({
                where: { email: email }
            });

            if(!user) throw createError.NotFound("User not registered!");

            let isMatch = await User.isValidPassword(password);
            if(!isMatch) throw createError.Unauthorized("Username/password not valid");

            let accessToken = await signAccessToken(user.userId);
            // let refreshToken = await signRefreshToken(user.userId);

            res.send({ accessToken });
        } catch (error) {
            if(error.isJoi == true) return next(createError.BadRequest("Invalid Username/Password"));
            next(error);
        }
    }
}