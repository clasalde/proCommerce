import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";


const createUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        throw new Error("Please fill all the inputs");
    }

    //verificar que el mail no se repita
    const userExists = await User.findOne({ email });
    if (userExists) res.status(400).send("User already exists");

    //Si no existe el mail en nuestra BD entonces creamos el usuario, pero PRIMERO ENCRIPTAMOS la password!

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Le pasamos la password hasheada. Tiene que estar como password: hashedPassword porque la propiedad requerida es password.
    const newUser = new User({ username, email, password: hashedPassword });

    //Esta es la respuesta que enviamos desde el Backend
    try {
        await newUser.save();
        createToken(res, newUser._id);

        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
        });
    } catch (error) {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (isPasswordValid) {
            createToken(res, existingUser._id)

            res.status(201).json({
                _id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                isAdmin: existingUser.isAdmin,
            });
            return //Exit the function after sending the response
        }
    }
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    })
    res.status(200).json({ message: "Logged Out successfully" })
});

export { createUser, loginUser, logoutCurrentUser };