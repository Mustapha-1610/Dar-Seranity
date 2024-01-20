import nodemailer from "nodemailer";
const user = "mustapha.talbi2002@gmail.com";
const pass = "lhxa ryjh kszp sejk";

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});

export const landlordConfirmationMail = async (name: string, email: string) => {
  await transport
    .sendMail({
      from: user,
      to: email,
      subject: "Landlord Account Application Under Review",
      html: `
    <div style="font-family: Arial, sans-serif; font-size: 16px; padding: 20px; background-color: #F5F5F5; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <h2 style="text-align: center; margin-bottom: 20px;">Thank you for your Application!</h2>
      <div style="text-align: center; margin-bottom: 5px;">
        <img src="https://firebasestorage.googleapis.com/v0/b/dar-seranity.appspot.com/o/favicon.ico?alt=media&token=b5499d11-7d68-4da1-91ec-fee14c22e513" style="width: 130px;">
        <h3>Hello ${name},</h3>
      </div>
      <div style="margin-bottom: 15px;">
        <p>We've received your landlord account application and it's currently under review by our team. We'll carefully examine your documentation to ensure all requirements are met.</p>
      </div>
      <div>
        <p>You'll receive an email notification once the review is complete, informing you of the decision.</p>
      </div>
      <div style="text-align: center; margin-bottom: 20px;">
        <p>Thank you for choosing Dar-Seranity!</p>
      </div>
    </div>
    `,
    })
    .catch((err) => console.log(err));
};
