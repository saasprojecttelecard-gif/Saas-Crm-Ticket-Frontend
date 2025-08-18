# SaaS CRM Landing Page

A modern, responsive landing page for a SaaS CRM subscription service built with React, Vite, and Tailwind CSS.

## Features

- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Built with Shadcn/ui components and Tailwind CSS
- 📦 **Package Selection** - Interactive pricing plans with feature comparison
- 📝 **Contact Form** - Lead capture form with validation
- 🚀 **Fast Performance** - Built with Vite for optimal loading speeds
- ✨ **Smooth Animations** - Hover effects and transitions for better UX

## Tech Stack

- **React 19** - Latest React with modern features
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality React components
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Elegant notifications

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd saas-crm-landing
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   └── ui/              # Shadcn/ui components
├── lib/
│   ├── apiClient.js     # Mock API client
│   └── utils.js         # Utility functions
├── pages/
│   └── SubscriptionRequest.jsx  # Main landing page
├── App.jsx              # Root component
└── main.jsx             # Entry point
```

## Customization

### Pricing Plans

Edit the `packages` array in `src/pages/SubscriptionRequest.jsx` to modify:

- Plan names and descriptions
- Pricing and billing periods
- Included features/modules

### Styling

- Modify `src/index.css` for global styles
- Update Tailwind classes in components for design changes
- Customize the color scheme in `tailwind.config.js`

### Form Handling

The contact form currently shows a success message. To integrate with a real backend:

1. Replace the mock API in `src/lib/apiClient.js` with actual API calls
2. Update the `handleSubmitRequest` function in `SubscriptionRequest.jsx`
3. Add proper error handling and validation

## Deployment

This is a static React application that can be deployed to:

- **Vercel** - `npm run build` then deploy the `dist` folder
- **Netlify** - Connect your Git repository for automatic deployments
- **GitHub Pages** - Use GitHub Actions to build and deploy
- **Any static hosting** - Upload the `dist` folder contents

## License

MIT License - feel free to use this for your own projects!
# Saas-Crm-Subscription-Frontend
# Saas-Crm-Ticket-Frontend
