# QuickQR - Instant QR Code Generator

<div align="center">
  <img src="https://via.placeholder.com/128x128/000000/FFFFFF?text=QR" alt="QuickQR Logo" width="128" height="128">
  
  <h3>Generate beautiful QR codes instantly</h3>
  
  <p>
    <strong>Fast • Simple • Beautiful</strong>
  </p>
  
  <p>
    <a href="#features">Features</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#usage">Usage</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>

## ✨ Features

- **Multiple QR Types**: Generate QR codes for URLs, Wi-Fi credentials, contacts (vCard), emails, and plain text
- **Live Preview**: See your QR code update in real-time as you type
- **Download & Share**: Download QR codes as PNG images or copy content to clipboard
- **Recent History**: Save and quickly access your recently generated QR codes
- **Dark/Light Theme**: Beautiful interface that adapts to your preference
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **No Registration**: Start generating QR codes immediately, no account required
- **Privacy First**: All processing happens in your browser, no data sent to servers

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/quickqr.git
cd quickqr
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

### URL QR Codes
1. Select "URL" from the dropdown
2. Enter your website URL
3. QR code generates automatically
4. Download or copy to share

### Wi-Fi QR Codes
1. Select "Wi-Fi" from the dropdown
2. Enter your network name (SSID)
3. Enter password (if required)
4. Select encryption type
5. Share the QR code for easy Wi-Fi access

### Contact QR Codes
1. Select "Contact" from the dropdown
2. Fill in name, phone, and email
3. Generate vCard QR code for easy contact sharing

### Email QR Codes
1. Select "Email" from the dropdown
2. Enter recipient email
3. Add subject and body (optional)
4. Generate mailto QR code

### Text QR Codes
1. Select "Text" from the dropdown
2. Enter any text content
3. Generate QR code for plain text

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **QR Generation**: react-qr-code
- **Theme**: next-themes
- **Icons**: Lucide React
- **Language**: TypeScript

## 📁 Project Structure

\`\`\`
quickqr/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── favicon.ico
├── components/
│   ├── ui/
│   ├── qr-code-generator.tsx
│   └── theme-toggle.tsx
├── lib/
│   └── utils.ts
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
\`\`\`

## 🎨 Customization

### Adding New QR Types

1. Add the new type to the `QRType` union in `qr-code-generator.tsx`
2. Create form fields for the new type
3. Add generation logic in the `useEffect` hook
4. Add parsing logic in the `loadQR` function

### Styling

The app uses Tailwind CSS with a custom design system. Key files:
- `app/globals.css` - Global styles and CSS variables
- `tailwind.config.ts` - Tailwind configuration
- Components use shadcn/ui for consistent styling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow the existing code style
- Add comments for complex logic
- Ensure responsive design
- Test on multiple devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide](https://lucide.dev/) for the icon library
- [react-qr-code](https://github.com/rosskhanas/react-qr-code) for QR code generation

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Join our community discussions

---

<div align="center">
  <p>Made with ❤️ by the QuickQR Team</p>
  <p>
    <a href="https://github.com/yourusername/quickqr">⭐ Star us on GitHub</a>
  </p>
</div>
