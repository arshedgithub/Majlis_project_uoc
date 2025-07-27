// import {db} from '@/config';
// import { collection, getDocs } from 'firebase/firestore';
import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { SignUpDto } from "../../../../types/dto/signup.dto";
import bcryptjs from "bcryptjs";

export async function POST(request: Request) {
  try {
    const reqBody = await request.json();
    const signUpDto: SignUpDto = ({
      email: reqBody.email,
      password: reqBody.password,
      name: reqBody.name,
      userType: reqBody.userType,
    } = reqBody);

    //validations
    if (!signUpDto.email || !signUpDto.password || !signUpDto.name) {
      return NextResponse.json(
        { message: "Email, password and name are required" },
        { status: 400 }
      );
    }

    //Email validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signUpDto.email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    const passwordValidation = AuthService.validatePassword(signUpDto.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message);
    }

    //check user existence
    const existingUser = AuthService.findUserByEmail(signUpDto.email);
    if (existingUser !== null && existingUser !== undefined) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 400 }
      );
    }

    //Hash password
    const hashedPassword = await bcryptjs.hash(signUpDto.password, 10);
    signUpDto.password = hashedPassword;

    // Call AuthService to handle registration logic
    const userToRegister = {
      ...signUpDto,
      isAdmin: false,
      isActive: true,
      isEmailVerified: false,
      isPhoneVerified: false,
    };
    const authResponse = await AuthService.register(userToRegister);
    return NextResponse.json(
      {
        message: "Registration successful",
        user: {
          email: authResponse.email,
          name: authResponse.name,
          userType: authResponse.userType,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sign up" },
      { status: 500 }
    );
  }
}
