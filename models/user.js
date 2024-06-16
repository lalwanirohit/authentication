'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
        }

        static async isValidPassword(password) {
            try {
                return await bcrypt.compare(password, this.password);
            } catch (error) {
                throw error
            }
        }
    }
    User.init({
        userId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT,
        },
        email: {
            type: DataTypes.STRING,
            require: true,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            require: true,
        }
    }, {
        sequelize,
        modelName: 'User',
    });

    User.beforeCreate(async function(user, next) {
        try {
            let salt = await bcrypt.genSalt(10);
            let hashedPassword = await bcrypt.hash(user.password, salt);
            user.password = hashedPassword;
            user.email = user.email.toLowerCase();
        } catch (error) {
            next(error);
        }
    });
    return User;
};