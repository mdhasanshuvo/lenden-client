# <img width="40px" src="./public/images.png"/> LenDen - Mobile Banking System

## 🚀 Introduction

Welcome to **LenDen**, a secure and dynamic **Mobile Financial Service (MFS)** web application created with the vision to empower digital financial transactions.  
Inspired by industry leaders like **bKash** and **Nagad**, LenDen enables users to seamlessly **send money**, **cash-in**, **cash-out**, and **manage balances** in a secure environment.

This is a **full-stack personal project** developed to showcase real-world system design, backend security practices, and frontend user experience excellence.

**Live Demo**: [Visit LenDen](https://lenden-mfs.netlify.app)

---

## ✨ Features

✅ Secure **User Authentication & Authorization** (JWT-based)  
✅ **5-digit PIN** protected login system  
✅ **Send Money** with transaction fees and minimum transaction rules  
✅ **Cash-In & Cash-Out** via verified agents  
✅ **Role-Based Access Control (RBAC)**: User, Agent, Admin  
✅ **Admin Panel** for agent approval, user management, and transaction tracking  
✅ **Transaction History** (last 100 transactions for users and agents)  
✅ **Agent Commission** and **Admin Revenue** calculation  
✅ **One Device Login Restriction** for enhanced account safety  
✅ **Encrypted PIN** using Bcrypt  
✅ **Real-time Notifications** on transaction actions

---

## 🛠️ Technology Stack

| Component         | Technology Used       |
|------------------|------------------------|
| **Frontend**      | React.js |
| **Backend**       | Node.js, Express.js |
| **Database**      | MongoDB |
| **Authentication**| JWT (JSON Web Token) |
| **Security**      | Bcrypt (PIN Hashing) |
| **State Management** | React Context API |
| **Styling**       | TailwindCSS |

---

## 📌 Usage

&nbsp; 1. **Register** as a User or Agent.
   - User receives **40 Taka** bonus on registration.
   - Agent receives **100,000 Taka** balance after admin approval.
&nbsp;2. **Login** using mobile number or email + PIN.
   - **One Device Only**: Users and agents can access from a single device at a time.
&nbsp;3. **Perform Transactions**:
   - **Send Money** (fees applied after 100 Taka)
   - **Cash-In** via agents (no fee)
   - **Cash-Out** via agents (1.5% fee)
&nbsp;4. **Admin Panel**:
   - Approve or reject agents
   - Block or unblock users
   - Monitor all system transactions and revenue

---

## 👥 User Roles & Functionalities

### 🧑‍💻 User
- Register/Login securely
- Send Money to other users
- Cash-In through agents
- Cash-Out through agents
- View Transaction History
- Check Balance (initially blurred for security)

### 🏪 Agent
- Secure Registration/Login (requires admin approval)
- Start with **100,000 Taka** balance
- Facilitate Cash-In and Cash-Out transactions
- Earn **1% commission** per cash-out
- Request balance recharge from admin

### 🛠️ Admin
- Single Super Admin role
- Approve agents and manage users
- View transaction details of all users and agents
- Manage system finances and revenue

---

## 💰 Transactions & Fees

| Transaction Type | Fee Structure | Earnings |
|------------------|----------------|----------|
| **Send Money**   | 5 Taka (above 100 Taka) | Admin earns 5 Taka |
| **Cash-In**      | Free | No earnings |
| **Cash-Out**     | 1.5% Fee | 1% for Agent, 0.5% for Admin |
| **All Money Operations** | 5 Taka | Admin |

---

## 🔒 Security Implementations

- **JWT Authentication** for secure API communication
- **Bcrypt Hashing** for user PIN encryption
- **One Device Login Enforcement** (multi-device login disabled for security)
- **Role-based Route Protection** for API endpoints
- **Unique Transaction ID** tracking for all money operations

---

## 🖼️ Screenshots

| Page | Preview |
|------|---------|
| **Registration Page (User/Agent)** | ![Registration](your-screenshot-link-here) |
| **Login Page (PIN-based)** | ![Login](your-screenshot-link-here) |
| **User Dashboard** | ![User Dashboard](your-screenshot-link-here) |
| **Send Money Page** | ![Send Money](your-screenshot-link-here) |
| **Cash-In/Cash-Out Pages** | ![Cash-In Cash-Out](your-screenshot-link-here) |
| **Admin Panel (Agent Approval)** | ![Agent Approval](your-screenshot-link-here) |
| **Admin Panel (User Management)** | ![User Management](your-screenshot-link-here) |
| **Transaction History** | ![Transaction History](your-screenshot-link-here) |

---

## 🎯 Future Enhancements

- 📱 **Launch a React Native Mobile App**
- ✉️ **Integrate Email Notifications** for all transaction actions
- 🔒 **Two-Factor Authentication (2FA)** for login process
- 📊 **Admin Dashboard Analytics** with graphical reports
- 🌐 **Payment Gateway Integration** for real-world transactions
- 🔗 **Multi-currency support** for broader regional use
- 🛡️ **Device Session Management System**

---

## 📥 Installation

### Prerequisites:
- Node.js (v14+)
- MongoDB (Local or Atlas)
- npm or yarn

### Clone the Repository
```bash
git clone https://github.com/your-repo/Lenden-Mobile-Banking-System.git
cd Lenden-Mobile-Banking-System
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Configure environment variables
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## ⚙️ Configuration

Create a `.env` file inside the `backend/` folder and add:

```plaintext
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## 👨‍💻 Contributor

- **Mohammed Hasan** – *Full Stack Developer* 🚀

---

> ⚡ Feel free to explore, fork, and enhance the project.  
> Connect with me on [LinkedIn](https://www.linkedin.com/in/mohammedd-hasan) or view more on [GitHub](https://github.com/mdhasanshuvo)!

---
