import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("."));
const PORT = process.env.PORT || 3000;
// CODM Tips API
app.post("/api/codm", (req, res) => {
    try {
        const { weapon_type, playstyle, map } = req.body;
        const result = {
            title: "🎮 CODM Gameplay Tips",
            overview: `Personalized tips for ${weapon_type || "your weapon"} with ${playstyle || "your"} playstyle`,
            tips: [
                "Practice aim in training mode for 15 minutes daily",
                "Learn spawn points and high-traffic areas on each map",
                "Use headphones for better audio cues - hear enemy footsteps",
                "Adjust sensitivity settings to match your playstyle",
                "Master at least 2-3 different weapon types for versatility",
                "Use cover effectively and avoid running in open areas",
                "Communicate with your team using pings or voice chat"
            ],
            loadout_suggestion: {
                primary: weapon_type || "Assault Rifle",
                secondary: "MW11 Handgun",
                perks: ["Quick Fix", "Ghost", "Dead Silence"],
                scorestreaks: ["UAV", "Counter UAV", "Hunter Killer Drone"]
            },
            sensitivity_guidance: "Start with medium sensitivity (60-80) and adjust based on preference. Lower for sniping, higher for close combat."
        };
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Business Reply API
app.post("/api/localreply", (req, res) => {
    try {
        const { business_type, customer_message, preferred_tone } = req.body;
        const result = {
            business_type: business_type || "Local Business",
            suggested_reply: `Thank you for reaching out to us! We truly appreciate you taking the time to contact ${business_type || "our business"}. Our team is currently reviewing your message and we will get back to you with a comprehensive response as soon as possible. Your satisfaction is our top priority.`,
            tone: preferred_tone || "Professional and Friendly",
            reassurance_points: [
                "We value your feedback and are committed to excellent service",
                "Our dedicated team is reviewing your inquiry",
                "We aim to respond to all messages within 24 hours",
                "Your concern is important to us and will be addressed promptly"
            ],
            followup_question: "Is there any additional information that would help us assist you better?"
        };
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Serve the main page
app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/index.html");
});
app.listen(PORT, () => {
    console.log(`🚀 AI Tools Server running on http://localhost:${PORT}`);
    console.log(`🎮 CODM Tips API: POST /api/codm`);
    console.log(`💼 Business Replies API: POST /api/localreply`);
});
