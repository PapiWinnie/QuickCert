import dotenv from "dotenv";
const result = dotenv.config();

console.log("dotenv result:", result); //
//  👈 debug output
console.log("GOOGLE_APPLICATION_CREDENTIALS:", process.env.GOOGLE_APPLICATION_CREDENTIALS);
