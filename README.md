# 📌 LenDen Mobile Financial Service (MFS) Application

## 🚀 Introduction

Welcome to LenDen, a secure and user-friendly Mobile Financial Service (MFS) platform inspired by popular financial applications like **bKash** and **Nagad**. This web-based platform enables users to send money, cash-in, cash-out, and check balances securely, while agents and admins manage transactions efficiently.

This project serves as a **Skill Assessment Task**, evaluating proficiency in backend and frontend technologies, security implementations, and system design.

---

## 📜 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [User Roles & Functionalities](#user-roles--functionalities)
- [Transactions & Fees](#transactions--fees)
- [Security Implementations](#security-implementations)
- [API Documentation](#api-documentation)
- [Contributors](#contributors)
- [License](#license)

---

## ✨ Features

✅ Secure **User Authentication & Authorization** (JWT-based)  
✅ **User Registration & Login** with a **5-digit PIN-based security system**  
✅ **Send Money** with a transaction fee structure  
✅ **Cash-In & Cash-Out** via authorized agents  
✅ **Role-Based Access Control (RBAC)** (User, Agent, Admin)  
✅ **Admin Panel** for user management, agent verification, and transaction monitoring  
✅ **Transaction History & Balance Inquiry**  
✅ **Agent Commission & Admin Revenue Calculation**  
✅ **Secure Route Access with Device Restriction**  
✅ **Data Encryption for User PIN**  

---

## 🛠️ Technology Stack

| Component       | Technology Used |
|----------------|----------------|
| **Frontend**   | React.js |
| **Backend**    | Node.js, Express.js |
| **Database**   | MongoDB (with Mongoose ORM) |
| **Authentication** | JWT (JSON Web Token) |
| **Security** | Bcrypt for password hashing |
| **State Management** | React Context API / Redux |
| **Styling** | TailwindCSS / Bootstrap |

---

## 📥 Installation

### Prerequisites:
- Install **Node.js** (v14+)
- Install **MongoDB** (Local or Cloud)
- Install **npm** or **yarn**

### Clone the Repository
```bash
git clone https://github.com/your-repo/MFS-App.git
cd MFS-App
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

Update the **`.env`** file in the backend:

```plaintext
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## 📌 Usage

1. **Register as a User or Agent**  
   - Users get **40 Taka bonus**  
   - Agents need **admin approval** and get **100,000 Taka** as initial balance  

2. **Login using Mobile Number & PIN**  
   - Users, Agents, and Admin have separate role-based access  

3. **Perform Transactions**  
   - Send Money, Cash-in, Cash-out, and Check Balance  

4. **Admin Panel for Management**  
   - Approve agents, monitor transactions, and handle balance requests  

---

## 👥 User Roles & Functionalities

### 🧑‍💻 User
- Register/Login securely
- Send money with applicable fees
- Cash-in via agents (no fee)
- Cash-out via agents (1.5% fee)
- View **transaction history**
- Check balance (initially blurred)

### 🏪 Agent
- Register/Login (Admin Approval Needed)
- Initial balance **100,000 Taka**
- Process **cash-in** for users (no fee)
- Process **cash-out** (earns **1% commission** per transaction)
- Request balance recharge from Admin

### 🛠️ Admin
- Single **Super Admin** account
- **Approve agents**
- **Manage users** (block/unblock)
- **View and monitor** all transactions
- **Add money** to agents' accounts
- Earn revenue from transactions

---

## 💰 Transactions & Fees

| Transaction Type | Fee Structure | Earnings |
|-----------------|--------------|----------|
| **Send Money** | 5 Taka (for amounts over 100 Taka) | Goes to Admin |
| **Cash-In** | Free | No earnings |
| **Cash-Out** | 1.5% Fee | Agent earns **1%**, Admin earns **0.5%** |
| **Every Transaction Processing** | 5 Taka | Goes to Admin |

---

## 🔒 Security Implementations

- **JWT Authentication** (for secure API access)
- **BCrypt PIN Hashing** (users' PINs are encrypted)
- **One Device Login Restriction** (users and agents can log in only from one device at a time)
- **Secure API Routes** (role-based access control)
- **Transaction Verification** (unique transaction IDs stored in DB)

---

## 📖 API Documentation

The API provides **secure endpoints** for all functionalities. Here’s a quick overview:

| Method | Endpoint | Description | Access |
|--------|---------|-------------|--------|
| **POST** | `/api/auth/register` | Register User/Agent | Public |
| **POST** | `/api/auth/login` | Login (User/Agent/Admin) | Public |
| **POST** | `/api/transaction/send` | Send Money | User |
| **POST** | `/api/transaction/cash-in` | Cash-in from Agent | Agent |
| **POST** | `/api/transaction/cash-out` | Cash-out to Agent | User |
| **GET** | `/api/transaction/history` | View Transaction History | User/Agent |
| **GET** | `/api/admin/users` | View All Users | Admin |
| **PATCH** | `/api/admin/approve-agent` | Approve Agents | Admin |

---

## 👥 Contributors

- **[Your Name]** - _Developer_
- **[Collaborator Name]** - _Reviewer_

If you'd like to contribute, please **fork the repository** and create a pull request!

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🎯 Future Enhancements

✔️ **Agent Balance Withdrawal Requests**  
✔️ **Advanced Search & Filtering for Admin Panel**  
✔️ **Automated Email Notifications for Transactions**  
✔️ **Mobile App Integration** (React Native)  

> 💡 *Feel free to customize the project, add new features, or suggest improvements!*

---