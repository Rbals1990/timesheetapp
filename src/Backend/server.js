import express from "express";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

import nodemailer from "nodemailer";

//.env configuratie laden
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });

/*
//debugging
console.log("Email User:", process.env.EMAIL_USER);
console.log("Email Pass:", process.env.EMAIL_PASS ? "Loaded" : "Not loaded");
console.log("Current directory:", __dirname);
*/
//routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Als je een frontend op een andere poort draait (bijv. React), moet je CORS inschakelen

// Pad naar de JSON-database
const dbPath = path.join(__dirname, "users.json");
const hoursDbPath = path.join(__dirname, "Hours.json");

// Hulpfunctie om gebruikers te lezen uit de JSON-database
const readUsers = () => {
  if (fs.existsSync(dbPath)) {
    const data = fs.readFileSync(dbPath);
    return JSON.parse(data);
  }
  return [];
};

// Hulpfunctie om de gebruikerslijst bij te werken in de JSON-database
const writeUsers = (users) => {
  fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
};

// POST /register endpoint om een nieuwe gebruiker te registreren
app.post("/register", async (req, res) => {
  const {
    firstName,
    lastName,
    address,
    postalCode,
    city,
    department,
    email,
    password,
  } = req.body;

  // Controleer of alle vereiste velden aanwezig zijn
  if (
    !firstName ||
    !lastName ||
    !address ||
    !postalCode ||
    !city ||
    !department ||
    !email ||
    !password
  ) {
    return res.status(400).json({ message: "Alle velden zijn verplicht." });
  }

  // Check of het emailadres al bestaat in de database
  const users = readUsers();
  const emailExists = users.some((user) => user.email === email);
  if (emailExists) {
    return res.status(400).json({ message: "E-mailadres is al in gebruik." });
  }

  // Wachtwoord hashen voor veiligheid
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Maak een nieuw gebruikersobject aan
  const newUser = {
    id: uuidv4(),
    firstName,
    lastName,
    address,
    postalCode,
    city,
    department,
    email,
    password: hashedPassword, // Gebruik het gehashte wachtwoord
  };

  // Voeg de nieuwe gebruiker toe aan de "database"
  users.push(newUser);
  writeUsers(users);

  return res.status(201).json({ message: "Account succesvol aangemaakt." });
});

//get all users
app.get("/users", (req, res) => {
  const users = readUsers();
  return res.status(200).json(users);
});

// POST /login endpoint om een gebruiker in te loggen
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email en wachtwoord zijn verplicht." });
  }

  const users = readUsers();
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(400).json({ message: "Gebruiker niet gevonden." });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(400).json({ message: "Wachtwoord is incorrect." });
  }

  // Let op: stuur geen wachtwoord terug
  const { password: _, ...userWithoutPassword } = user;

  return res
    .status(200)
    .json({ message: "Inloggen succesvol.", user: userWithoutPassword });
});

//POST / Hours endpoint om uren in te voeren
const readHours = () => {
  if (fs.existsSync(hoursDbPath)) {
    const data = fs.readFileSync(hoursDbPath);
    return JSON.parse(data);
  }
  return [];
};

// Functie om nieuwe registratie op te slaan
const writeHours = (hours) => {
  fs.writeFileSync(hoursDbPath, JSON.stringify(hours, null, 2));
};

// POST endpoint om urenregistratie op te slaan
app.post("/urenregistratie", (req, res) => {
  const newEntry = req.body;

  // Controle op vereiste velden
  if (
    !newEntry ||
    !newEntry.userId ||
    !newEntry.weekNumber ||
    !newEntry.data ||
    !newEntry.totalHours ||
    !newEntry.createdAt
  ) {
    return res.status(400).json({ message: "Ongeldige registratie." });
  }

  const currentHours = readHours();

  // Eventueel kun je hier nog duplicaten controleren per user/week
  currentHours.push({ ...newEntry, ingediend: true });
  writeHours(currentHours);

  res.status(201).json({ message: "Urenregistratie succesvol opgeslagen." });
});

// GET alle urenregistraties (optioneel filter op userId via querystring)
app.get("/urenregistraties", (req, res) => {
  const allHours = readHours();

  const { userId } = req.query;

  if (userId) {
    const filtered = allHours.filter((entry) => entry.userId === userId);
    return res.status(200).json(filtered);
  }

  return res.status(200).json(allHours);
});

// Contactformulier endpoint
app.post("/contact", async (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ message: "Naam en bericht zijn verplicht." });
  }

  try {
    // Transporter instellen (voorbeeld met Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "contactformulier@jouwdomein.nl",
      to: "devtestrens@gmail.com",
      subject: "Nieuw bericht via contactformulier",
      text: `Naam: ${name}\n\nBericht:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Bericht succesvol verzonden." });
  } catch (error) {
    console.error("Fout bij verzenden mail:", error);
    res
      .status(500)
      .json({ message: "Er is iets misgegaan bij het verzenden." });
  }
});

// Start de server
app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});
