# 🤖 KURC Inventory Tracker

An intelligent inventory management system built for the Kathmandu University Robotics Club (KURC). This application helps track electronic components, manage borrowing and returns, and ensures the club's resources are used safely and efficiently, with an AI-powered sanity check for borrowing purposes.

---

## 📸 Screenshots

| Dashboard | Components Page |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/6f728e1c-0141-477e-aa6b-76bc18562b48" alt="Dashboard Screenshot" data-ai-hint="dashboard application" /> | <img src="https://github.com/user-attachments/assets/a7c86847-7772-4efc-b09e-4c2028328042" alt="Components Page Screenshot" data-ai-hint="inventory table" /> |

| Transaction Logs | Issue Item Dialog |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/933535a0-93af-45a5-aaae-bcfb9e5813d5" alt="Logs Page Screenshot" data-ai-hint="transaction log" /> | <img src="https://github.com/user-attachments/assets/9a286cd3-c074-4ea9-bc79-22923cd0ea88" alt="Issue Item Dialog Screenshot" data-ai-hint="modal dialog" /> |


---

## ✨ Core Features

- ✅ **Dashboard Overview**: At-a-glance summary of total, borrowed, and available components.
- ✅ **Component Management**: Easily add, edit, and delete components and their categories.
- ✅ **Real-time Inventory Tracking**: Quantities are automatically updated when items are borrowed or returned.
- ✅ **Transaction Logging**: A complete history of all borrowing and return activities.
- ✅ **AI-Powered Sanity Check**: A Genkit-powered AI tool warns users if their stated purpose for borrowing a component sounds unsafe or against club rules.
- ✅ **User Authentication**: Secure user login and registration managed by Firebase Auth.
- ✅ **Account Management**: Users can update their profile information and change their password.
- ✅ **Responsive Design**: A clean, dark-themed UI that works seamlessly on both desktop and mobile devices.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Generative AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/kurc-inventory-tracker.git
    cd kurc-inventory-tracker
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up your environment variables:**
    - Create a `.env` file in the root of your project.
    - Add your Firebase project configuration to the `.env` file. You can get these from your Firebase project settings.

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_auth_domain"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
    NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

    The application should now be running at [http://localhost:9002](http://localhost:3000).

---

## 🤝 Contributors

A huge thanks to all the people who have contributed to this project:

- **[Your Name]** - Project Lead & Developer
  <!-- Add more contributors here -->

---

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
