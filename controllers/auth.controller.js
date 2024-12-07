import bcrypt from "bcrypt";
import prisma from "./../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  //db operations
  const { username, email, password } = req.body;

  //HASH PASSWORDt
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🚀 ~ register ~ hashedPassword:", hashedPassword);

    //CREATE NEW USER AND SAVE TO DB(DATA BASE)
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    console.log("🚀 ~ register ~ newUser:", newUser);
    res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    console.log("🚀 ~ register ~ err:", err);
    res.status(500).json({
      message: "Failed to create user",
    });
  }
};

export const login = async (req, res) => {
  // server operation
  const { username, password } = req.body;

  try {
    //db operations

    //CHECK IF USER EXIST
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user)
      return res.status(401).json({
        message: "Invalid Credentials!",
      });

    //CHECK IF PASSWORD IS CORRECT
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({
        message: "Invalid Credentials!",
      });

    //  GENERATE COOKIE TOKEN AND SEND TO THE USER
    // res.setHeader("Set-Cookie", "test=" + "myValue").json("success")
    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );
    const { password: userPassword, ...userInfo } = user;
    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: true,
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.log("🚀 ~ login ~ err:", err);
    res.status(500).json({
      message: "Failed to login!",
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout successful" });
};
