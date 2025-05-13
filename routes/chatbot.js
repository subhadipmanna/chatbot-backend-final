const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        error: "Hey! What would you like to know about Ashim?" 
      });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.7,
        topP: 0.95,
      }
    });

    // Subhadip's Resume Data (keep this as is)
const resumeData = `
Hey there! I'm Amit Ghosh's AI sidekick—here to spill all the good stuff about his work, skills, projects, and life. Whether you're curious about what he's building or where he studied, I’ve got the full scoop. Just ask!

About Amit:
- Name: Amit Ghosh  
- Email: amitghosh7602@gmail.com  
- Phone: +91 7602307242  
- Hometown: Bankura, West Bengal, India  
- Current Location: Bankura, India  
- LinkedIn: https://www.linkedin.com/in/aamitghoshofficial  
- GitHub: https://github.com/AGhoshGit  
- Portfolio: https://aamitghosh.vercel.app

Quick Bio:
I'm Amit—passionate about full-stack development, embedded systems, IoT, and AI. I'm currently pursuing my Master of Technology in Information Technology with a specialization in the Internet of Things from MAKAUT. I love solving real-world problems using smart automation and AI-powered systems. I’ve got hands-on experience in backend development, IoT integrations, and cloud-based apps. My dream? To create impactful tech that connects the physical and digital world.

Skills:
- Languages: Python, C++, C, Java, Objective-C, C#, SQL, JavaScript, Assembly  
- Web & App Development: ASP.NET, HTML, CSS, JavaScript, Bootstrap  
- Frameworks/Platforms: .NET, Microsoft SQL Server, Interface Builder  
- Databases: SQL, Firebase  
- IoT & Embedded Systems: Raspberry Pi, Arduino, ESP8266, Sensor Integration  
- Tools & IDEs: Arduino IDE, Visual Studio, VS Code, GitHub  
- Others: OTA Firmware Updates, Embedded C, Cloud Integration  

Certifications (by Globsyn & Oracle):
- HTML, CSS, and JavaScript for Web Developers  
- Application Development in ASP.NET using MVC  
- Programming for Everybody (MySQL & PHP)  
- Fundamentals of Network Communication  

Work / Projects:

Academic Projects:
1. Online Classroom Management System  
   Tech: ASP.NET, C#, CSS, HTML, JS, Bootstrap  
   Description: Developed a virtual classroom platform with tools for online teaching and collaboration.  
   GitHub: https://github.com/AGhoshGit/Online-Classroom-Management-System

2. Online Book Store (Second-Hand Books)  
   Tech: ASP.NET, C#, CSS, HTML, JS, Bootstrap  
   Description: Built a platform that promotes sharing by letting users buy and sell used books.  
   GitHub: https://github.com/AGhoshGit/Online-Second-Hand-Book-Buying-Selling

3. Online Prescription Management System  
   Tech: ASP.NET, C#, CSS, HTML, JS, Bootstrap  
   Description: Created a system for patients to store prescriptions digitally and access them anytime.  
   GitHub: https://github.com/AGhoshGit/Online-Prescription-Management

Personal Projects:
1. Smart Water Management System  
   Tech: C, C++, Arduino IDE, ESP8266, Blynk  
   Description: An IoT-powered smart tank system with OTA firmware updates for efficient water usage.  
   GitHub: https://github.com/AGhoshGit/Smart-Water-Management-System

2. Smart Room with Fingerprint Door Lock  
   Tech: C, C++, Arduino IDE, ESP8266, Blynk  
   Description: A home automation system that uses fingerprint authentication for enhanced security.  
   GitHub: https://github.com/AGhoshGit/Smart-room-with-fingerprint-door-lock

Publication:
- Title: IoT-Driven Automated Hydroponic System for Climate-Independent Indoor Crop Cultivation  
- Authors: J. Samadder, S. Roy, S. Mapa, S. Gharami, J. C. Das & A. Ghosh  
- Conference: IEEE EDKCON 2024  
- DOI: https://doi.org/10.1109/EDKCON62339.2024.10870630  
- Date: February 2025  

Education Details:
- M.Tech in Information Technology (IoT), MAKAUT (2023–Present) – YGPA: 7.87  
- MCA, Kalyani Government Engineering College (2019–2022) – DGPA: 8.77  
- BCA, Dr. B. C. Roy Engineering College, Durgapur (2016–2019) – DGPA: 7.33  
- Higher Secondary, Bankura Municipal High School (2016) – 60%  
- Secondary, Bankura Zilla School (2014) – 56.85%  

Personal Vibes:
- Passion: Full-stack development, smart IoT solutions, backend systems, AI-powered apps  
- Hobbies: Learning new technologies, solving real-world problems through embedded systems  
- Style: Curious, innovative, solution-focused
`; // Your existing resume data

    // Format chat history with proper role validation
    let formattedHistory = (history || []).map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // Ensure conversation starts with user message
    if (formattedHistory.length === 0 || formattedHistory[0].role !== "user") {
      formattedHistory.unshift({
        role: "user",
        parts: [{ text: `${resumeData}\n\nTell me about Ashim Rudra Paul` }]
      });
    }

    // Start chat session with validated history
    const chat = model.startChat({ history: formattedHistory });

    // Generate response with current message
    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return res.json({ 
      response: response.trim(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat Error:', error);
    return res.status(500).json({
      error: "Oops! My circuits are buzzing. Try again?",
      technical: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;