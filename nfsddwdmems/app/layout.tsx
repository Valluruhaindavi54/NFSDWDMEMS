// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'NFSDWDMEMS - Dashboard',
  description: 'EMS/NMS Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700&display=swap"
        />
        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </head>
      <body>
        <div className="container">
          {/* Header */}
          <header>
            <div className="logo">
              <img
                src="https://images.jdmagicbox.com/v2/comp/bangalore/52/080p25252/catalogue/united-telecoms-ltd-mahadevapura-bangalore-telecom-product-dealers-2rth1xd.jpg"
                alt="Logo"
              />
            </div>
            <h1>NFSDWDMEMS</h1>
            <div className="profile">
              <i className="fas fa-user-circle"></i>
            </div>
          </header>

          {/* Render page content */}
          {children}
        </div>
      </body>
    </html>
  );
}
