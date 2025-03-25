import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { writeFile } from "fs/promises";
import { join } from "path";

// MongoDB connection string - replace with your actual connection string
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "machine-management";
const collectionName = "machines";

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Parse the form data
    const formData = await request.formData();

    // Extract form fields
    const machineName = formData.get("machineName") as string;
    const machineDescription = formData.get("machineDescription") as string;
    const role = formData.get("role") as string;
    const username = formData.get("username") as string;
    const file = formData.get("file") as File | null;

    // Prepare document for MongoDB
    const doc = {
      machineName,
      machineDescription,
      role,
      username,
      createdAt: new Date(),
      fileInfo: null as any | null,
    };

    // Handle file upload if a file was provided
    if (file) {
      // Create unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${new ObjectId().toString()}.${fileExt}`;
      const filePath = `/uploads/${fileName}`;

      // Save file info to document
      doc.fileInfo = {
        originalName: file.name,
        path: filePath,
        size: file.size,
        type: file.type,
      };

      // Save file to server (in production you might want to use a storage service)
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Ensure uploads directory exists
      const uploadDir = join(process.cwd(), "public", "uploads");
      try {
        await writeFile(join(uploadDir, fileName), buffer as any);
      } catch (error) {
        console.error("Error saving file:", error);
        // Still save the record even if file upload fails
        doc.fileInfo.uploadError = true;
      }
    }

    // Insert document into MongoDB
    const result = await collection.insertOne(doc);

    return NextResponse.json(
      {
        success: true,
        message: "Machine added successfully",
        id: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error handling request:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add machine",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  } finally {
    // Close MongoDB connection
    await client.close();
  }
}
