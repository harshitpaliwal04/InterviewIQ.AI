const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
const fs = require("fs");
const { AskAi } = require("../SERVICES/openRouter");
const UserModel = require("../MODEL/user.model");
const Interview = require("../MODEL/interview.model");

pdfjsLib.GlobalWorkerOptions.workerSrc = require.resolve("pdfjs-dist/legacy/build/pdf.worker.js");

const analyzeResume = async (req, res) => {
        try {
                const resume = req.file;
                if (!resume) {
                        return res.status(400).json({ message: "Resume is required" });
                }

                // Extract PDF text (your existing code)
                const fileBuffer = fs.readFileSync(resume.path);
                const uint8Array = new Uint8Array(fileBuffer);
                const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

                let text = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        const pageText = content.items.map(item => item.str).join(" ");
                        text += pageText + "\n";
                }

                text = text.replace(/\s+/g, " ").trim();

                if (!text || text.length < 50) {
                        fs.unlinkSync(resume.path);
                        return res.status(400).json({
                                message: "Could not extract enough text from PDF"
                        });
                }

                // ✅ CORRECT: Prompt as array of messages
                const prompt = [
                        {
                                role: "system",
                                content: `You are an expert resume analyst and career coach.
                
                                Return ONLY valid JSON, no markdown, no extra text, no backticks.

                                Response format:
                                {
                                "role": "Most recent job title or career focus",
                                "experience": "Summary of experience (e.g., '5 years in full-stack development')",
                                "skills": ["skill1", "skill2", "skill3"],
                                "projects": ["project1", "project2", "project3"]
                                }

                                If information is missing, use empty strings or empty arrays.`
                        },
                        {
                                role: "user",
                                content: `Analyze this resume and extract the information:\n\n${text.substring(0, 6000)}`
                        }
                ];

                // ✅ IMPORTANT: Must AWAIT the AskAi function
                console.log("Calling AI service...");
                const aiResponse = await AskAi(prompt);  // ← AWAIT is CRITICAL!

                console.log("Raw AI response:", aiResponse);

                // ✅ Check if response is valid
                if (!aiResponse || typeof aiResponse !== 'string') {
                        throw new Error("Invalid AI response");
                }

                // Clean the response
                let cleanResponse = aiResponse;

                // Remove markdown code blocks
                cleanResponse = cleanResponse.replace(/```json\n?/g, '');
                cleanResponse = cleanResponse.replace(/```\n?/g, '');
                cleanResponse = cleanResponse.trim();

                // Extract JSON
                let parsed;
                try {
                        const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
                        if (jsonMatch) {
                                parsed = JSON.parse(jsonMatch[0]);
                        } else {
                                parsed = JSON.parse(cleanResponse);
                        }
                } catch (parseError) {
                        console.error("JSON parse error:", parseError.message);
                        console.error("Response was:", cleanResponse);

                        // Fallback
                        parsed = {
                                role: "Unable to parse",
                                experience: "Could not extract from resume",
                                skills: [],
                                projects: []
                        };
                }

                // Clean up file
                fs.unlinkSync(resume.path);

                return res.status(200).json({
                        message: "Resume analyzed successfully",
                        data: {
                                role: parsed.role || "Not specified",
                                experience: parsed.experience || "0",
                                skills: parsed.skills || [],
                                projects: parsed.projects || []
                        }
                });

        } catch (error) {
                console.error("analyzeResume error →", error);

                if (req.file && fs.existsSync(req.file.path)) {
                        fs.unlinkSync(req.file.path);
                }

                return res.status(500).json({
                        message: "Internal Server Error",
                        error: error.message
                });
        }
};

const GenerateQuestion = async (req, res) => {
        try {
                // ✅ Use 'let' instead of 'const' for variables that need reassignment
                let { role, experience, mode, text, skills, projects } = req.body;

                // ✅ Trim string values safely
                role = role?.trim();
                experience = experience?.trim();
                mode = mode?.trim();
                text = text?.trim();

                // ✅ Handle arrays properly - don't trim arrays
                // skills and projects should remain as arrays
                if (skills && !Array.isArray(skills)) {
                        skills = [skills]; // Convert to array if string
                }
                if (projects && !Array.isArray(projects)) {
                        projects = [projects]; // Convert to array if string
                }

                // ✅ Validate required fields
                if (!role || !experience || !mode) {
                        return res.status(400).json({ message: "All fields are required" });
                }

                // ✅ Check if user exists
                const user = await UserModel.findById(req.user.id);
                if (!user) {
                        return res.status(404).json({ message: "User not found" });
                }

                // ✅ Check credits
                if (user.credits < 50) {
                        return res.status(400).json({
                                message: "Insufficient credits. Minimum 50 credits required",
                                currentCredits: user.credits
                        });
                }

                // ✅ Safely format arrays
                const projectText = projects?.length > 0 ? `Projects: ${projects.join(", ")}` : "";
                const skillText = skills?.length > 0 ? `Skills: ${skills.join(", ")}` : "";
                const safeResume = text?.length > 0 ? `Resume: ${text}` : "";

                // ✅ Build the prompt
                const userPrompt = `Generate 5 interview questions for the following candidate:
                        Role: ${role}
                        Experience: ${experience}
                        Mode: ${mode}
                        ${projectText}
                        ${skillText}
                        ${safeResume}`;

                const prompt = [
                        {
                                role: "system",
                                content: `You are a real human interviewer conducting a professional interview.

                                Speak in simple, natural English as if you are directly talking to the candidate.

                                Generate exactly 5 interview questions.

                                Strict Rules:
                                - Each question must contain between 15 and 25 words.
                                - Each question must be a single complete sentence.
                                - Do NOT number them.
                                - Do NOT add explanations.
                                - Do NOT add extra text before or after.
                                - One question per line only.
                                - Keep language simple and conversational.
                                - Questions must feel practical and realistic.

                                Difficulty progression:
                                Question 1 → easy  
                                Question 2 → easy  
                                Question 3 → medium  
                                Question 4 → medium  
                                Question 5 → hard  

                                Make questions based on the following details of the candidate:
                                Role: ${role}
                                Experience: ${experience}
                                Mode: ${mode}
                                ${projectText}
                                ${skillText}
                                ${safeResume}

                                Return ONLY valid JSON in this exact format:
                                {
                                "questions": [
                                        "First question here?",
                                        "Second question here?",
                                        "Third question here?",
                                        "Fourth question here?",
                                        "Fifth question here?"
                                ]
                                }`
                        },
                        {
                                role: "user",
                                content: userPrompt
                        }
                ];

                // ✅ Call AI service (make sure AskAi is imported)
                const aiResponse = await AskAi(prompt);

                // ✅ Parse JSON response safely
                let questionsArray = [];
                try {
                        // Try to parse as JSON first
                        let parsedResponse;
                        if (typeof aiResponse === 'string') {
                                parsedResponse = JSON.parse(aiResponse);
                        } else {
                                parsedResponse = aiResponse;
                        }

                        if (parsedResponse && parsedResponse.questions && Array.isArray(parsedResponse.questions)) {
                                questionsArray = parsedResponse.questions;
                        }
                } catch (parseError) {
                        // Fallback: parse line by line if JSON parsing fails
                        console.log("JSON parse failed, falling back to line parsing");
                        questionsArray = aiResponse
                                .split("\n")
                                .map((q) => q.trim())
                                .filter((q) => q.length > 0)
                                .filter((q) => !q.startsWith('{') && !q.startsWith('}')) // Remove JSON braces
                                .slice(0, 5);
                }

                // ✅ Validate we have exactly 5 questions
                if (questionsArray.length !== 5) {
                        console.error("Expected 5 questions, got:", questionsArray.length);
                        console.error("AI Response:", aiResponse);
                        return res.status(400).json({
                                message: "Failed to generate questions",
                                details: `Expected 5 questions but got ${questionsArray.length}`,
                                rawResponse: aiResponse
                        });
                }

                // ✅ Deduct credits
                user.credits -= 50;
                await user.save();

                // ✅ Create interview with proper difficulty mapping
                const interview = await Interview.create({
                        userId: user._id,
                        role,
                        experience,
                        mode,
                        resumeText: text, // Changed from 'text' to avoid confusion
                        questions: questionsArray.map((q, i) => ({
                                question: q,
                                difficulty: i < 2 ? "easy" : i < 4 ? "medium" : "hard",
                                timeLimit: [60, 60, 120, 120, 150][i],
                                answer: null, // Initialize with null
                                feedback: null // Initialize with null
                        })),
                });

                return res.status(200).json({
                        success: true,
                        username: user.name,
                        interviewId: interview._id,
                        questions: interview.questions,
                        credits: user.credits,
                        message: "Questions generated successfully"
                });

        } catch (error) {
                console.error("GenerateQuestion error →", error);
                return res.status(500).json({
                        success: false,
                        message: "Internal Server Error",
                        error: error.message
                });
        }
};

const submitAnswer = async (req, res) => {
        try {
                const { interviewId, questionId, answer, timeTaken } = req.body;

                if (!interviewId || !questionId || !answer) {
                        return res.status(400).json({ message: "All fields are required" });
                }

                const interview = await Interview.findById(interviewId);
                if (!interview) {
                        return res.status(404).json({ message: "Interview not found" });
                }

                const question = interview.questions.id(questionId);
                if (!question) {
                        return res.status(404).json({ message: "Question not found" });
                }

                if (!answer.trim()) {
                        question.score = 0;
                        question.answer = "";
                        question.feedback = "No answer submitted";
                        question.status = "Completed";
                        await interview.save();
                        return res.status(200).json({
                                message: "Answer submitted successfully"
                        });
                }

                if (timeTaken > question.timeLimit) {
                        question.score = 0;
                        question.feedback = "Time limit exceeded, Not Eligible for Score";
                        question.status = "Completed";
                        await interview.save();
                        return res.status(200).json({
                                message: "Answer submitted successfully"
                        });
                }

                question.answer = answer;

                const prompt = [
                        {
                                role: "system",
                                content: `
                                You are a professional human interviewer evaluating a candidate's answer in a real interview.

                                Evaluate naturally and fairly, like a real person would.

                                Score the answer in these areas (0 to 10):

                                1. Confidence – Does the answer sound clear, confident, and well-presented?
                                2. Communication – Is the language simple, clear, and easy to understand?
                                3. Correctness – Is the answer accurate, relevant, and complete?

                                Rules:
                                - Be realistic and unbiased.
                                - Do not give random high scores.
                                - If the answer is weak, score low.
                                - If the answer is strong and detailed, score high.
                                - Consider clarity, structure, and relevance.

                                Calculate:
                                finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

                                Feedback Rules:
                                - Write natural human feedback.
                                - 10 to 15 words only.
                                - Sound like real interview feedback.
                                - Can suggest improvement if needed.
                                - Do NOT repeat the question.
                                - Do NOT explain scoring.
                                - Keep tone professional and honest.

                                Return ONLY valid JSON in this format:

                                {
                                "confidence": number,
                                "communication": number,
                                "correctness": number,
                                "finalScore": number,
                                "feedback": "short human feedback"
                                }`
                        },
                        {
                                role: "user",
                                content: `
                                Question: ${question.question}
                                Answer: ${answer}
                                `
                        }
                ];

                const aiResponse = await AskAi(prompt);
                const parsedResponse = JSON.parse(aiResponse);

                question.answer = answer;
                question.confidence = parsedResponse.confidence;
                question.communication = parsedResponse.communication;
                question.correctness = parsedResponse.correctness;
                question.finalScore = parsedResponse.finalScore;
                question.feedback = parsedResponse.feedback;
                question.status = "Completed";

                await interview.save();

                return res.status(200).json({
                        message: "Answer submitted successfully",
                        feedback: parsedResponse.feedback
                });

        } catch (error) {
                console.error("submitAnswer error →", error);
                return res.status(500).json({
                        message: "Internal Server Error",
                        error: error.message
                });
        }
};

const finishInterview = async (req, res) => {
        try {
                const { interviewId } = req.body;

                if (!interviewId) {
                        return res.status(400).json({ message: "Interview ID is required" });
                }

                const interview = await Interview.findById(interviewId);
                if (!interview) {
                        return res.status(404).json({ message: "Interview not found" });
                }

                const totalQuestions = interview.questions.length;

                let totalScore = 0;
                let totalCommunication = 0;
                let totalConfidence = 0;
                let totalCorrectness = 0;

                interview.questions.forEach(question => {
                        totalScore += question.score || 0;
                        totalCommunication += question.communication || 0;
                        totalConfidence += question.confidence || 0;
                        totalCorrectness += question.correctness || 0;
                });

                const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
                const finalCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;
                const finalConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
                const finalCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

                interview.totalScore = finalScore;
                interview.totalCommunication = finalCommunication;
                interview.totalConfidence = finalConfidence;
                interview.totalCorrectness = finalCorrectness;
                interview.status = "Completed";
                await interview.save();

                return res.status(200).json({
                        message: "Interview completed successfully",
                        finalScore: Number.parseFloat(finalScore).toFixed(2),
                        finalCommunication: Number.parseFloat(finalCommunication).toFixed(2),
                        finalConfidence: Number.parseFloat(finalConfidence).toFixed(2),
                        finalCorrectness: Number.parseFloat(finalCorrectness).toFixed(2),
                        questions: interview.questions.map((q) => ({
                                question: q.question || "",
                                answer: q.answer || "",
                                feedback: q.feedback || "",
                                score: q.score || 0,
                                communication: q.communication || 0,
                                confidence: q.confidence || 0,
                                correctness: q.correctness || 0
                        }))
                });

        } catch (error) {
                console.error("finishInterview error →", error);
                return res.status(500).json({
                        message: "Internal Server Error",
                        error: error.message
                });
        }
};

const getAllInterviewHistory = async (req, res) => {
        try {
                const userId = req.user.id;
                const interviews = await Interview.find({ userId }).sort({ createdAt: -1 });
                return res.status(200).json({
                        message: "Interview history fetched successfully",
                        interviews
                });
        } catch (error) {
                console.error("getInterviewHistory error →", error);
                return res.status(500).json({
                        message: "Internal Server Error",
                        error: error.message
                });
        }
};

const getInterviewReport = async (req, res) => {
        try {
                const { interviewId } = req.params;

                if (!interviewId) {
                        return res.status(400).json({ message: "Interview ID is required" });
                }

                const interview = await Interview.findById(interviewId);
                if (!interview) {
                        return res.status(404).json({ message: "Interview not found" });
                }

                const totalQuestions = interview.questions.length;

                let totalScore = 0;
                let totalCommunication = 0;
                let totalConfidence = 0;
                let totalCorrectness = 0;

                interview.questions.forEach(question => {
                        totalScore += question.score || 0;
                        totalCommunication += question.communication || 0;
                        totalConfidence += question.confidence || 0;
                        totalCorrectness += question.correctness || 0;
                });

                const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
                const finalCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;
                const finalConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
                const finalCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

                interview.totalScore = finalScore;
                interview.totalCommunication = finalCommunication;
                interview.totalConfidence = finalConfidence;
                interview.totalCorrectness = finalCorrectness;
                interview.status = "Completed";
                await interview.save();

                return res.status(200).json({
                        message: "Interview report fetched successfully",
                        finalScore: Number.parseFloat(finalScore).toFixed(2),
                        finalCommunication: Number.parseFloat(finalCommunication).toFixed(2),
                        finalConfidence: Number.parseFloat(finalConfidence).toFixed(2),
                        finalCorrectness: Number.parseFloat(finalCorrectness).toFixed(2),
                        questions: interview.questions.map((q) => ({
                                question: q.question || "",
                                answer: q.answer || "",
                                feedback: q.feedback || "",
                                score: q.score || 0,
                                communication: q.communication || 0,
                                confidence: q.confidence || 0,
                                correctness: q.correctness || 0
                        }))
                });

        } catch (error) {
                console.error("getInterviewReport error →", error);
                return res.status(500).json({
                        message: "Internal Server Error",
                        error: error.message
                });
        }
};

module.exports = { analyzeResume, GenerateQuestion, submitAnswer, finishInterview, getAllInterviewHistory, getInterviewReport };
