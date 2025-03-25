// app/api/auth/[...nextauth]/register/route.ts
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import { sendNotification } from "@/lib/notification";


// MongoDB connection string - use environment variable in production
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DATABASE_NAME = process.env.DATABASE_NAME || "myapp";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, username, email, password } =
      await request.json();

    // Validate data
    if (!firstName || !lastName || !username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      await client.close();
      return NextResponse.json(
        { message: "Email or username already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);
    await client.close();

    if (!result.acknowledged) {
      return NextResponse.json(
        { message: "Failed to create user" },
        { status: 500 }
      );
    }

    // Send notification email
    await sendNotification({
      type: "ACCOUNT_CREATED",
      recipient: email,
      data: {
        name: `${firstName} ${lastName}`,
        email: email,
        password: password, // Note: In production, you would NOT send the actual password
      },
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
