"use strict";
const jwt = require("jsonwebtoken");
const secret = "";
module.exports = {
    sign: (email) => {
        const payload = {
            email: email,
        };
        return jwt.sign(payload, secret, {
            expiresIn: "1h",
            algorithm: "RS256",
        }, (err, token) => {
            console.log(token);
        });
    },
    verify: (token) => {
        let decoded = null;
        try {
            decoded = jwt.verify(token, secret);
            return {
                type: true,
                email: decoded.email,
            };
        }
        catch (e) {
            return {
                type: false,
                message: e.message,
            };
        }
    },
};
