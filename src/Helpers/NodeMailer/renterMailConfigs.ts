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
  renterId: string,
  activationCode: string
) => {
  const tokenPayload = {
    id: renterId,
    aCode: activationCode,
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
      subject: "Dar-Seranity Account Activation",
      html: `
      <div style="font-family: Arial, sans-serif; font-size: 16px; padding: 20px; background-color: #F5F5F5; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <h2 style="text-align: center; margin-bottom: 20px;">Welcome to Dar-Seranity !</h2>
  <div style="text-align: center; margin-bottom: 5px;">
    <img src="https://firebasestorage.googleapis.com/v0/b/dar-seranity.appspot.com/o/favicon.ico?alt=media&token=b5499d11-7d68-4da1-91ec-fee14c22e513" style="width: 130px;">
    <h3>Hi ${name},Activate your account and start exploring our serene offerings.</h3>
  </div>
  <div style="text-align: center; margin-bottom: 5px;">
    <a href="https://auctionwebapp-liard.vercel.app//Bactivation=${mailToken}" style="background-color: #C1E1C1; border: 1px solid #007bff; color: white; padding: 10px 20px; text-decoration: none;">Activate</a>
    <p>Thank you for choosing Dar-Seranity !</p>
  </div>
</div>`,
    })
    .catch((err) => console.log(err));
};
