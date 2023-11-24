const express = require("express");
const router = new express.Router();
const users = require("../models/userSchema");
const nodemailer = require("nodemailer");

// email config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

//register user details
router.post("/register", async (req, res) => {
  const { Fname, Lname, Email, Mobile, Message } = req.body;

  if (!Fname || !Lname || !Email || !Mobile) {
    res.status(401).json({ status: 401, error: "All Input require" });
  }

  try {
    const preuser = await users.findOne({ email: Email });

    if (preuser) {
      const userMessage = await preuser.Messagesave(Message);
      console.log(userMessage);
      const mailOptions = {
        from: process.env.EMAIL,
        to: Email,
        subject: "sending email using nodejs",
        text: "Your Response Has Been Submitted",
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error" + error);
        } else {
          console.log("Email sent" + info.response);
          res
            .status(201)
            .json({ status: 201, message: "Email sent SUccesfully" });
        }
      });
    } else {
      const finalUser = new users({
        Fname,
        Lname,
        Email,
        Mobile,
        Messages: { message: Message },
      });

      const storeData = await finalUser.save();

      const mailOptions = {
        from: process.env.EMAIL,
        to: Email,
        subject: "sending email using nodejs",
        text: "Your Response Has Been Submitted",
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error" + error);
        } else {
          console.log("Email sent" + info.response);
          res
            .status(201)
            .json({ status: 201, message: "Email sent SUccesfully" });
        }
      });
      res.status(201).json({ status: 201, storeData });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error: "All Input require" });
    console.log("catch error");
  }
});

module.exports = router;
