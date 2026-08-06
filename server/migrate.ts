import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

async function migrate() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("No MONGODB_URI found in env");
    return;
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const usersCollection = db.collection("user");

    const users = await usersCollection.find({}).toArray();
    let updatedCount = 0;

    for (const user of users) {
      const currentEmail = user.email || "";
      const fixedEmail = currentEmail.trim().toLowerCase();

      if (currentEmail !== fixedEmail) {
        // Check if lowercase/trimmed version already exists (rare, but possible if duplicate registered)
        const existing = await usersCollection.findOne({ email: fixedEmail });
        if (existing && existing._id.toString() !== user._id.toString()) {
          console.warn(`WARNING: Cannot fix ${currentEmail} because ${fixedEmail} already exists!`);
          continue;
        }

        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { email: fixedEmail } }
        );
        console.log(`Updated: '${currentEmail}' -> '${fixedEmail}'`);
        updatedCount++;
      }
    }

    console.log(`Migration complete. Updated ${updatedCount} users.`);
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.close();
  }
}

migrate();
