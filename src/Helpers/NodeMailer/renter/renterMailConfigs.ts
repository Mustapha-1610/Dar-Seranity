import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
const user = "mustapha.talbi2002@gmail.com";
const pass = "lhxa ryjh kszp sejk";

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});
export const renterConfirmationMail = async (
  name: string,
  email: string,
  activationCode: string
) => {
  const tokenPayload = {
    email: email,
    aCode: activationCode,
  };
  const mailToken = jwt.sign(
    tokenPayload,
    process.env.NODEMAILER_TOKEN_SECRET!,
    {
      expiresIn: "1y",
    }
  );
  await transport
    .sendMail({
      from: user,
      to: email,
      subject: "Dar-Seranity Account Activation",
      html: `
      <div style="font-family: Arial, sans-serif; font-size: 16px; padding: 20px; background-color: #F5F5F5; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <h2 style="text-align: center; margin-bottom: 20px;">Welcome to Dar-Seranity !</h2>
  <div style="text-align: center; margin-bottom: 5px;">
    <img src="https://firebasestorage.googleapis.com/v0/b/dar-seranity.appspot.com/o/Needs%20For%20Project%2F_eb24e2af-b658-4422-b125-b41f76a85688.jpg?alt=media&token=678651e4-e036-4c1b-9863-997699ab2d8d" style="width: 130px;">
    <h3>Hi ${name}, Activate Your Account And Start Exploring Our Serene Offerings.</h3>
  </div>
  <div style="text-align: center; margin-bottom: 5px;">
    <a href="${process.env
      .NEXT_PUBLIC_API_BASE_URL!}/verify/${mailToken}" style="background-color: #138808; border: 1px solid #097969; color: white; padding: 10px 20px; text-decoration: none;">Activate</a>
    <p>Thank you for choosing Dar-Seranity !</p>
  </div>
</div>`,
    })
    .catch((err) => console.log(err));
};

export const sendPassResetMail = async (name: string, email: string) => {
  const tokenPayload = {
    email: email,
  };
  const mailToken = jwt.sign(
    tokenPayload,
    process.env.NODEMAILER_TOKEN_SECRET!,
    {
      expiresIn: "1h",
    }
  );
  await transport
    .sendMail({
      from: user,
      to: email,
      subject: "Dar-Seranity Password Reset",
      html: `
      <div style="font-family: Arial, sans-serif; font-size: 16px; padding: 20px; background-color: #F5F5F5; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <h2 style="text-align: center; margin-bottom: 20px;">Seems Like You Have Forgotten Your Password !</h2>
  <div style="text-align: center; margin-bottom: 5px;">
    <img src="https://firebasestorage.googleapis.com/v0/b/dar-seranity.appspot.com/o/Needs%20For%20Project%2F6179072.png?alt=media&token=ae53d403-9c57-4ca5-b41d-d4eee4a74a57" style="width: 130px;">
    <h3>Hello ${name}, Click Here To Reset Your Password</h3>
  </div>
  <div style="text-align: center; margin-bottom: 5px;">
    <a href="${process.env
      .NEXT_PUBLIC_API_BASE_URL!}/resetPassword/${mailToken}" style="background-color: #000000; border: 1px solid #097969; color: white; padding: 10px 20px; text-decoration: none;">Reset Password</a>
          <p>This Link Will Expire In 1 Hour </p>
  </div>
</div>`,
    })
    .catch((err) => console.log(err));
};

export const sendContactMeMail = async (
  email: string,
  name: string,
  subject: string
) => {
  await transport
    .sendMail({
      from: email,
      to: user,
      subject: "Contact Me Mail",
      html: `
      <div style="font-family: Arial, sans-serif; font-size: 16px; padding: 20px; background-color: #F5F5F5; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <h3>From ${email} </h3>
      <p>Sent By ${name} : ${subject}</p>
      </div>
`,
    })
    .catch((err) => console.log(err));
};
