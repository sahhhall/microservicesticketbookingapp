import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// Define `mongo` with the correct type
let mongo: MongoMemoryServer;

// Hook that runs before all tests
beforeAll(async () => {
  process.env.JWT_KEY = "fuc";
  // Initialize and start the in-memory MongoDB server
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  // Connect to the in-memory MongoDB server
  await mongoose.connect(mongoUri);
});

// Hook that runs before each test
beforeEach(async () => {
  const collections = await mongoose.connection?.db?.collections();

  if (collections) {
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

// Hook that runs after all tests
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

