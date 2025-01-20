"use server";

import { db as client } from "@/lib/prisma";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { getServerSession } from "next-auth";

export const getCurrentUserFromDb = async () => {
  const session = await getServerSession();

  if (!session || !session.user.email) {
    return null;
  }
  const { user } = session;
  const userFromDb = await client.user.findUnique({
    where: { email: user.email ?? "" },
    include: { subscription: true },
  });

  return userFromDb;
};

export const registerUser = async (
  email: string,
  fullName: string,
  type: string,
  otp?: string,
  password?: string
) => {
  try {
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    await client.user.upsert({
      where: { email },
      create: {
        email: email,
        fullName: fullName,
        type,
        password: hashedPassword,
        otp,
        subscription: {
          create: {},
        },
      },
      update: { fullName },
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendEmail = async (to: string, otp: string) => {
  try {
    const EMAIL = process.env.EMAIL;
    const PASSWORD = process.env.PASSWORD;
    console.log({ EMAIL, PASSWORD });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: PASSWORD,
      },
    });
    const templatePath = path.join(
      process.cwd(),
      "public",
      "html",
      "otp-email-template.html"
    );
    let htmlContent = fs.readFileSync(templatePath, "utf-8");

    htmlContent = htmlContent.replace("{OTP}", otp);

    const logoPath = path.join(process.cwd(), "public", "images", "logo.png");

    const info = await transporter.sendMail({
      from: '"Kouah AI" <noreply@kouahai.com>',
      to: to,
      subject: "Your OTP for Kouah AI",
      html: htmlContent,
      attachments: [
        {
          filename: "logo.png",
          path: logoPath,
          cid: "logo",
        },
      ],
    });

    console.log("Message sent: %s", info.messageId);
  } catch (err: any) {
    console.log(err);
  }
};

export const verifyOTP = async (email: string, otp: string) => {
  try {
    const user = await client.user.findFirst({ where: { email } });
    if (user?.otp === otp) {
      await client.user.update({ where: { email }, data: { otp: "" } });
      return { status: 200 };
    }
    return { status: 400 };
  } catch (err) {
    console.log(err);
    return { status: 400 };
  }
};
