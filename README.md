# 🤖 InterviewIQ.Ai

## 🚀 What is InterviewIQ.Ai?

InterviewIQ.Ai is a SaaS platform that helps developers and job seekers prepare smarter for interviews. Users upload their resume (PDF), and the AI generates role-specific interview questions across technical and HR domains. After each session, users receive detailed intelligent feedback to track their performance and improve over time.

The platform runs on a **credit-based access system** — users get free credits on signup and can purchase more via **Razorpay** when they run out.

---

## ✅ Features

- 📄 **Resume Upload** — Upload PDF resume for personalized question generation
- 🤖 **AI-Generated Questions** — Get tailored technical and HR interview questions
- 🎯 **Practice Rounds** — Simulate real interview sessions interactively
- 📊 **Intelligent Feedback** — Receive AI-powered performance analysis after each session
- 💳 **Credit System** — Credit-based access with free credits on signup
- 💰 **Razorpay Payments** — Purchase credit packs via secure Razorpay integration
- 🔐 **Google Authentication** — One-click sign-in via Firebase Google Auth
- ✨ **Smooth Animations** — Polished UI with Framer Motion transitions
- 🚀 **Production Deployed** — Full stack deployed on Render

---

## 💻 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Authentication | Firebase (Google OAuth) |
| Payments | Razorpay |
| Animations | Framer Motion |
| Deployment | Render (Frontend + Backend) |

---

## 📁 Project Structure

```
InterviewIQ.Ai/
├── Frontend/
│   ├── src/
│   │   ├── PAGES/
│   │   │   ├── Home.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── Interview.jsx
│   │   │   ├── InterviewHistory.jsx
│   │   │   ├── InterviewReport.jsx
│   │   │   ├── Pricing.jsx
│   │   │   └── ProtectedRoutes.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── constant.js
│   │   └── App.jsx
│   └── package.json
│
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── .env
│   └── server.js
│
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Firebase project (Google Auth)
- Razorpay account
- Render account (for deployment)

---

### 1. Clone the repository

```bash
git clone https://github.com/harshitpaliwal04/InterviewIQ.AI.git
cd interviewiq-ai
```

---

### 2. Setup Backend

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
OPENAI_API_KEY=your_openai_or_ai_api_key
```

Start the backend server:

```bash
npm run dev
```

---

### 3. Setup Frontend

```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend/` folder:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start the frontend:

```bash
npm run dev
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/google | Google OAuth login / register |
| GET | /api/auth/me | Get current user |

### Interview
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/interview/generate | Generate questions from resume |
| POST | /api/interview/feedback | Get AI feedback on answers |
| GET | /api/interview/history | Get all past sessions |
| GET | /api/interview/report/:id | Get specific session report |

### Credits & Payments
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/credits/balance | Get user credit balance |
| POST | /api/payment/order | Create Razorpay order |
| POST | /api/payment/verify | Verify payment & add credits |

---

## 💳 Credit System

| Action | Credits |
|---|---|
| Signup bonus | 100 free credits |
| Generate interview session | 50 credit |
| Purchase — Starter Pack | 150 credits |
| Purchase — Pro Pack | 650 credits |

---

## 🔐 Authentication Flow

1. User clicks "Sign in with Google"
2. Firebase handles OAuth and returns user info
3. Backend verifies the Firebase token
4. JWT is issued and stored in `localStorage`
5. All protected routes validate JWT on every request
6. Expired or invalid tokens are auto-removed and user is redirected to `/auth`

---

## 🚀 Deployment

Both frontend and backend are deployed on **Render**.

### Backend (Web Service)
- Build command: `npm install`
- Start command: `node server.js`
- Add all `.env` variables in Render dashboard

### Frontend (Static Site)
- Build command: `npm run build`
- Publish directory: `dist`
- Add all `VITE_` env variables in Render dashboard

---

## 🌍 Environment Variables Summary

### Backend `.env`
```env
MONGO_URI=
JWT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
OPENAI_API_KEY=
```

### Frontend `.env`
```env
VITE_SERVER_URL=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_RAZORPAY_KEY_ID=
```

---

## 💡 What This Project Teaches

- Real-world SaaS architecture with credit-based access
- Firebase Google Authentication with JWT
- AI API integration for dynamic content generation
- PDF parsing and resume processing
- Razorpay payment gateway integration
- Protected routes and token validation
- Framer Motion animations in production
- Full stack deployment on Render

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch 
3. Commit your changes 
4. Push to the branch 
5. Open a Pull Request

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 👨‍💻 Author

**Harshit**

> Made with ❤️ for the developer community
