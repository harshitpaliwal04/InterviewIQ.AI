const axios = require("axios");

const AskAi = async (prompt) => {
        try {
                if (!prompt) {
                        throw new Error("Prompt is required");
                }

                console.log("Sending to OpenRouter...");

                const response = await axios.post(
                        "https://openrouter.ai/api/v1/chat/completions",
                        {
                                model: "openai/gpt-3.5-turbo", // Or use "openai/gpt-3.5-turbo" for faster/cheaper
                                messages: prompt, // ✅ FIXED: prompt is already an array of messages
                                max_tokens: 2000
                        },
                        {
                                headers: {
                                        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                                        "Content-Type": "application/json",
                                        "HTTP-Referer": "http://localhost:3000", // Required by OpenRouter
                                        "X-Title": "Resume Analyzer"
                                },
                                timeout: 30000 // 30 second timeout
                        }
                );

                // ✅ Safely extract the content
                const content = response?.data?.choices?.[0]?.message?.content;

                if (!content) {
                        console.error("Invalid response structure:", response?.data);
                        throw new Error("No content in AI response");
                }

                console.log("AI response received, length:", content.length);

                return content;

        } catch (error) {
                console.error("AskAi error:", error.message);

                if (error.response) {
                        console.error("OpenRouter API error:", error.response.status, error.response.data);
                }

                // ✅ IMPORTANT: Always return a valid JSON string, never undefined
                return JSON.stringify({
                        role: "Error",
                        experience: "AI service temporarily unavailable",
                        skills: [],
                        projects: []
                });
        }
};

module.exports = { AskAi };