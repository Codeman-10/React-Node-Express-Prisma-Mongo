import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    console.log("register", req.body)

    try {
        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        })

        console.log(newUser)
        res.status(201).json({ message: "user added succesfully" })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "failed to create user" })

    }
    return res;
}
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { username }
        })
        console.log(user)
        if (!user) return res.status(401).json({ message: "Invalid credentials!" })

        const isPasswordValiadte = await bcrypt.compare(password, user.password);
        if (!isPasswordValiadte) return res.status(401).json({ message: "Invalid credentials!" })
        //one millisec * minute * hour * day * week
        const age = 1000 * 60 * 60 * 24 * 7
        const token = jwt.sign({
            id: user.id,
            isAdmin: true

        }, process.env.JWT_SECRET_KEY, { expiresIn: age })
        const { password: userPassword, ...userInfo } = user


        res.cookie("token", token, {
            httpOnly: true,
            // secure:true works only inhttps
            maxAge: age
        })
        res.status(201).json(userInfo)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "login failed!" })

    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie("token")
        res.status(201).json({ message: "logout succesfully" })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "logout failed!" })

    }
    return res;
}

