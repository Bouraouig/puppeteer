import puppeteerExtra from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Your custom scripts
import { fillInLogin } from "./filling.js";
import { clickExplorationLogin } from "./clickExplorationLogin.js";

import { processMutamar } from "./processMutamar.js";

dotenv.config();

// ---------------------------
// ENV variables
// ---------------------------
const loginLink = process.env.LOGIN_LINK || "";
const contractLink = process.env.CONTRACTS_LINK || "";
const addMutamarLink = process.env.ADD_MUTAMAR_LINK || "";
const dashBoardLink = process.env.DASHBOARD_LINK || "";
const homeLink = process.env.HOME_LINK || "";

let continueResolve = null; // Promise resolver for POST
let page;

// ---------------------------
// Helper: wait until POST arrives
// ---------------------------
const waitForPostData = () => {
  return new Promise((resolve) => {
    continueResolve = resolve; // POST will call this
  });
};

// ---------------------------
// Helper: run Puppeteer actions
// ---------------------------
const runPuppeteerTask = async (data) => {
  try {
    await processMutamar(page, data); // Your custom puppeteer logic
    return "success";
  } catch (err) {
    console.error("❌ Puppeteer error:", err);
    throw err;
  }
};

// ---------------------------
// Express setup
// ---------------------------
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------
// POST endpoint
// ---------------------------
app.post("/send-data", async (req, res) => {
  const data = req.body;

  // Puppeteer isn't ready to receive data yet
  if (!continueResolve) {
    return res.status(400).json({ error: "Puppeteer is not waiting" });
  }

  try {
    // Wake up Puppeteer and pass the data
    continueResolve(data);
    continueResolve = null;

    // Wait for Puppeteer to finish
    const response = await runPuppeteerTask(data);

    res.status(200).json({ Erreur: "Success" });
  } catch (err) {
    res.status(500).json({ error: err.message || "Unknown error" });
  }
});

// ---------------------------
// Server start
// ---------------------------
app.listen(3000, () => {
  console.log("API ready → http://localhost:3000");
});

// ---------------------------
// Puppeteer main logic
// ---------------------------
const start = async () => {
  puppeteerExtra.use(StealthPlugin());

  const browser = await puppeteerExtra.launch({
    headless: false,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: [
      "--disable-blink-features=AutomationControlled",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=1400,900",
    ],
  });

  page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Login
  await page.goto("https://masar.nusuk.sa/pub/login", {
    waitUntil: "networkidle2",
  });

  await fillInLogin(page);

  // ---------------------------
  // Monitor URL until you reach contract page
  // ---------------------------
  const urlCheck = setInterval(async () => {
    const currentUrl = page.url();
    console.log("Current URL:", currentUrl);

    if (currentUrl === dashBoardLink) {
      await page.goto(homeLink);
      await clickExplorationLogin(page);
      await new Promise((r) => setTimeout(r, 2000));
    }

    if (currentUrl === contractLink) {
      console.log("Contracts page reached");

      try {
        const element = await page.$("span.badge.badge-success");
        if (element) {
          const text = await page.evaluate(
            (el) => el.textContent?.trim(),
            element
          );

          if (text === "Active") {
            await element.click();
            clearInterval(urlCheck);

            await new Promise((r) => setTimeout(r, 1000));

            await page.goto(addMutamarLink, { waitUntil: "networkidle2" });
            console.log("Ready for POST triggers");

            // Start waiting loop
            waitForPosts();
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, 1000);
};

// ---------------------------
// Loop system
// ---------------------------
const waitForPosts = async () => {
  while (true) {
    console.log("⏳ Waiting for POST...");

    const data = await waitForPostData();
  }
};

start();
