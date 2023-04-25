const express = require('express');
const router = express.Router();
const farmersController = require('../controllers/farmers');
const Farmer = require("../models/farmer");
const Addeqp = require("../models/addeqp");
const SoilTest = require('../models/soilTest');
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "hello";
const fetchuser = require("../middleware/fetchuser");
const { response } = require('express');
router.use(express.json());
require('../database/connection');
let registerAuth;
router.get('/', farmersController.farmersLandingpageGet);

router.get('/login', farmersController.farmersLoginGet)

router.get('/register', farmersController.farmersRegisterGet);

// router.get('/dashboard', (req, res) => {
//     res.render('./dashboard', {
//         token: tokenValue
//     })
// });

router.get('/addeqp', farmersController.farmersAddExpGet);


//Route:1 : Create a User using : Post "api/auth/createUser" No login req
//Route:1 : Create a User using : Post "api/auth/createUser" No login req
router.post(
    "/register",
    [
        // Validations for storage of username,email and password
        body(
            "name",
            "Please Enter a Name containing more than 3 characters"
        ).isLength({ min: 3 }),
        body("email", "Please Enter a valid email").isEmail(),
        body("password", "Password should atleast contain 5 characters").isLength({
            min: 5,
        }),
    ],
    async (req, res) => {
        // Checking the errors for validation
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }
        // Check wheather the user with the email exists already
        try {
            let user = await Farmer.findOne({ email: req.body.email });

            if (user) {
                return res
                    .status(400)
                    .json({
                        success,
                        error: "sorry a user with this email already exists",
                    });
            }
            let new_user = await Farmer.findOne({ name: req.body.phone });

            if (new_user) {
                return res
                    .status(400)
                    .json({
                        success,
                        error: "sorry a user with this Phone NUmber already exists",
                    });
            }
            // Creating New User
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);

            user = await Farmer.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
                phone: req.body.phone,
                state: req.body.state,
                address: req.body.address,
            });

            const data = user.id;
            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            console.log(authToken);
            const store = await Farmer.findByIdAndUpdate({ _id: data }, { "authToken": authToken });
            registerAuth = authToken;
            res.redirect('/farmers/login');



        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
);
let loginAuth;
// Route 2: Authenticate a user using : Post "api/auth/login" No login req
router.post(
    "/login",
    [
        // Validations for storage of username,email and password
        body("email").isEmail(),
        body("password", "Password cannot be blank").exists(),
    ],
    async (req, res) => {
        // Checking the errors for validation
        const errors = validationResult(req);
        let success = false
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: "Please enter correct credentials in right format" });

        }
        const { email, password } = req.body;
        try {
            let user = await Farmer.findOne({ email });

            if (!user) {
                return (res
                    .status(400)
                    .json({ success, error: "Please try to login with correct credentials" }));
                ;
            }
            if (user) {
                const comparePassword = await bcrypt.compare(password, user.password);

                if (!comparePassword) {

                    return (res
                        .status(400)
                        .json({ success, error: "Please try to login with correct credentials" }));
                    ;
                }
                else {

                    const data = user.id;

                    const authToken = jwt.sign(data, JWT_SECRET);
                    success = true
                    loginAuth = authToken;
                    console.log("login: " + loginAuth);
                    console.log("Register: " + registerAuth);
                    res.redirect('/farmers/dashboard');
                }

            }

        } catch (error) {
            console.log("noob");
            res.status(500).send("Internal Server Error");
            // return;
        }
    }
)

router.post('/addeqp', async (req, res) => {
    try {
        const adding = new Addeqp({
            user: req.user,
            name: req.body.name,
            purpose: req.body.purpose,
            price: req.body.price,
            details: req.body.details,
            image: req.body.image
        })
        const addingNewEqp = await adding.save();
        res.redirect('/farmers/dashboard')
    }
    catch (err) {
        console.log(err.message);
    }
})
router.get('/soiltest', (req, res) => {
    res.render('./soiltest');
})

router.post('/soiltest', async (req, res) => {
    try {
        let success = false
        const booking = new SoilTest({
            user: loginAuth,
        })

        const soilBooking = await booking.save();
        success = true
        res.status(201).redirect('/farmers/dashboard')
    }
    catch (err) {
        console.log(err.message);
    }
})
// Route 3: Get details of logged in user : Post "api/auth/getUser"Login req
router.get("/getUser", async (req, res) => {
    try {
        let success = false
        const userId = req.header("user-id");
        const user = await Farmer.findById(userId).select("-password");

        if (user) {
            success = true
            return res.json({ success, user });
        }

    } catch (error) {
        console.log(error.message);
        return (res.status(500).json({ success, message: "Internal Server Error" }));
    }
})

router.get("/dashboard", async (req, res) => {
    try {
        const equipments = await Addeqp.find({}).select("");
        console.log(equipments);
        res.render('./dashboard.hbs', {
            equipments: equipments
        })
    } catch (error) {
        res.status(500).send("internal server error", error.message)
    }
})
// console.log(token);

module.exports = router;

