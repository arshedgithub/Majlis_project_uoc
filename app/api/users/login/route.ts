import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { SignInDto } from "../../../../types/dto/signin.dto";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const signInDto: SignInDto = {
      email: reqBody.email,
      password: reqBody.password,
    };

    // Validations
    if (!signInDto.email || !signInDto.password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signInDto.email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check user existence
    const existingUser = AuthService.findUserByEmail(signInDto.email);
    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found with this email" },
        { status: 400 }
      );
    }

    // Compare password (if using bcrypt)
    const isPasswordValid = await bcryptjs.compare(signInDto.password, existingUser.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 401 }
      );
    }

    // Create token data
    const tokenData = {
      userId: existingUser.id,
      email: existingUser.email,
      userType: existingUser.userType,
    };

    // Create token
    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    // Prepare response
    const response = NextResponse.json(
      {
        message: "Sign-in successful",
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          userType: existingUser.userType,
        },
        token,
      },
      { status: 200 }
    );
    response.cookies.set("token", token, { httpOnly: true });
    return response;
  } catch (error) {
    console.error("Error fetching user : ", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
// export async function GET() {
//   try {
//     const usersRef = collection(db, 'users');
//     const snapshot = await getDocs(usersRef);
//     const users = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));

//     return NextResponse.json({ users }, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch users' },
//       { status: 500 }
//     );
//   }
// }
