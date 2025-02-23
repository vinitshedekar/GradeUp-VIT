# GradeUp VIT 📚

A modern web application to help VIT students calculate, track, and visualize their academic performance through GPA calculations and semester management.

![Application Demo](./assets/demo_image.png)

## ✨ Features

- 🧮 Accurate GPA & CGPA calculation based on VIT's grading system
- 📊 Visual representation of academic performance with interactive charts
- 📱 Responsive design - works on desktop and mobile
- 🌓 Dark/Light mode support
- 📄 Generate PDF reports of academic performance
- 🔐 Secure authentication and data storage
- ⚡ Real-time updates and calculations

## 🛠️ Tech Stack

**Frontend:**  
React · TypeScript · Vite · Tailwind CSS  
**Backend:**  
Supabase (PostgreSQL) · Supabase Auth  
**Visualization:**  
Recharts · Lucide Icons  
**Utilities:**  
jsPDF · html2canvas  

## 🚀 Live Demo

[Visit Live Site](https://your-deployment-url.com)  
*(Add your hosted application link here)*

![Features Overview](./assets/features-collage.png)

## 💻 Local Development Setup

1. **Clone Repository**
git clone https://github.com/YOUR-USERNAME/vit-gpa-calculator.git
cd vit-gpa-calculator

text

2. **Install Dependencies**
npm install

text

3. **Environment Setup**
- Create `.env` file:
cp .env.example .env

text
- Add Supabase credentials:
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key

text

4. **Start Development Server**
npm run dev

text
Visit `http://localhost:5173`

## 📱 How to Use

### 1️⃣ Account Setup
- Register with email/password
- Verify email via Supabase magic link
- Login to access dashboard

### 2️⃣ Semester Management
1. Click "+ Add Semester"
2. Enter semester details
3. Add courses with:
   - Course code
   - Credits (1-4)
   - Grade (S/A/B+/B/C+/C/D/E/F)
4. Save to auto-calculate GPA

### 3️⃣ Performance Tracking
- View CGPA in dashboard header
- Analyze GPA trends via line chart
- Click semester cards for details

### 4️⃣ Report Generation
1. Navigate to Dashboard
2. Click "Generate Report"
3. Wait for PDF generation
4. Download/share PDF

![Usage Demo](./assets/usage-demo.gif)

## 🔒 Security Features

- 🔑 Row Level Security (RLS) enabled
- 🛡️ Encrypted authentication tokens
- 🗑️ Session-based data management
- 🚫 No sensitive data in local storage

## 🤝 Contributing

1. Fork repository
2. Create feature branch:
git checkout -b feature/your-feature

text
3. Commit changes:
git commit -m "Add: New feature"

text
4. Push to branch:
git push origin feature/your-feature

text
5. Open Pull Request

## 📜 License

MIT License - See [LICENSE](LICENSE) for details

## 👨💻 Author

**Your Name**  
[GitHub Profile](https://github.com/vinitshedekar)  
[Project Repository](https://github.com/YOUR-USERNAME/vit-gpa-calculator)

---