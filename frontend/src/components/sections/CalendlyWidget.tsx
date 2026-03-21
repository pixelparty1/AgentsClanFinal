'use client';

import { useEffect } from 'react';

export default function CalendlyWidget() {
  useEffect(() => {
    // Dynamically load Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full">
      {/* Calendly widget wrapper with custom styling */}
      <style>{`
        .calendly-inline-widget {
          min-width: 100% !important;
          height: 700px !important;
        }

        /* Theme customization for dark mode */
        .calendly-inline-widget iframe {
          background-color: transparent !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 1.5rem !important;
        }

        /* Calendar header */
        .calendly-inline-widget .calendly-header {
          background: linear-gradient(135deg, #00ff88 0%, #6366f1 100%) !important;
        }

        /* Button styling */
        .calendly-inline-widget button {
          background-color: #00ff88 !important;
          color: #0b1a13 !important;
          border: none !important;
          font-weight: 600 !important;
        }

        .calendly-inline-widget button:hover {
          background-color: #00ff88 !important;
          opacity: 0.9 !important;
        }

        /* Time slot styling */
        .calendly-inline-widget .slot {
          border-color: rgba(0, 255, 136, 0.3) !important;
          color: #e6fff5 !important;
        }

        .calendly-inline-widget .slot:hover {
          background-color: rgba(0, 255, 136, 0.1) !important;
          border-color: rgba(0, 255, 136, 0.6) !important;
        }

        .calendly-inline-widget .slot--selected {
          background-color: #00ff88 !important;
          border-color: #00ff88 !important;
          color: #0b1a13 !important;
        }

        /* Text styling */
        .calendly-inline-widget {
          color: #e6fff5 !important;
        }

        .calendly-inline-widget h1,
        .calendly-inline-widget h2,
        .calendly-inline-widget h3,
        .calendly-inline-widget p {
          color: #e6fff5 !important;
        }

        /* Form inputs */
        .calendly-inline-widget input,
        .calendly-inline-widget textarea {
          background-color: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #e6fff5 !important;
        }

        .calendly-inline-widget input:focus,
        .calendly-inline-widget textarea:focus {
          border-color: rgba(0, 255, 136, 0.4) !important;
          background-color: rgba(255, 255, 255, 0.08) !important;
        }

        .calendly-inline-widget input::placeholder {
          color: rgba(230, 255, 245, 0.3) !important;
        }

        /* Navigation arrows */
        .calendly-inline-widget .chevron {
          color: #00ff88 !important;
        }

        /* Selected date styling */
        .calendly-inline-widget .day--selected {
          background-color: #00ff88 !important;
          color: #0b1a13 !important;
        }

        /* Today highlighting */
        .calendly-inline-widget .day--today {
          color: #00ff88 !important;
          border-color: #00ff88 !important;
        }
      `}</style>

      <div
        className="calendly-inline-widget"
        data-url="https://calendly.com/agentsclan2026/agentsclan-consultation"
      ></div>
    </div>
  );
}
