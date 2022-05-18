import User from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import String from "../models/otpSchema.js";
import { sendMail } from "../utils/email.js";

//Create random string for passwoed verifcation
function randString() {
  var rndResult = "";
  var characters = "0123456789";
  var charactersLength = characters.length;

  for (var i = 0; i < 6; i++) {
    rndResult += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }
  console.log(rndResult);
  return rndResult;
}

//Signup:
export async function Signup(req, res) {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User aleady exists! Login instead" });
  }

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hashSync(password, salt);
  console.log(hashedPassword);
  const user = new User({
    name,
    email,
    password: hashedPassword,
  });
  try {
    await user.save();
  } catch (error) {
    return console.log(error);
  }
  return res
    .status(201)
    .json({ message: "Account Created Successfully", user });
}

//Login:
export async function Login(req, res) {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (!existingUser) {
    return res.status(404).json({
      massage: "Couldn't find the User by this email",
    });
  }
  const isPasswordCorrect = await bcryptjs.compare(
    password,
    existingUser.password
  );
  console.log(isPasswordCorrect);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid Credentials" });
  } else {
    return res.status(200).json({ message: "Login Successfull", existingUser });
  }
}

//Forgot password:

export async function ForgotPassword(req, res) {
  const email = req.body.email;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
    console.log(email);
  } catch (err) {
    return console.log(err);
  }
  if (!existingUser) {
    return res.status(404).json({
      massage: "Couldn't find the User by this email",
    });
  }

  //Send rondom string through email
  const newOtp = randString();
  await sendMail(email, existingUser, newOtp);
  const otp = new String({ OTP: newOtp });
  try {
    await otp.save();
    return res.status(201).json({
      message: "OTP created successfully && Email also sent",
      otp,
      _id: existingUser._id,
    });
  } catch (error) {
    return console.log(error);
  }
}

//OTP verfication:
export async function OtpVerfication(req, res) {
  const _id = req.params.id;
  const OTP = req.body.OTP;
  console.log(OTP);
  let getOtpFromDB;
  try {
    getOtpFromDB = await String.findOne({ _id: _id });
  } catch (err) {
    return console.log(err);
  }

  if (OTP !== getOtpFromDB.OTP) {
    return res.status(400).json({ message: "Invalid OTP" });
  } else {
    await String.deleteOne({ _id: _id });
  }
  return res.status(200).json({ message: "Email verified successfully." });
}

export async function ResetPassword(req, res) {
  const _id = req.params.id;
  const { password, confirmPassword } = req.body;

  if (password === confirmPassword) {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hashSync(password, salt);
    console.log(hashedPassword);

    const updateUser = await User.findByIdAndUpdate(_id, {
      $set: { password: hashedPassword },
    });
    return res.json({ message: "Password changed successfully", updateUser });
  } else {
    return res.status(400).json({ message: "Incorrect password match" });
  }
}
