import React from 'react';

// --- SVG Filters for Custom Button ---
export const CustomButtonFilters = () => (
  <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <svg className="filter">
          <filter id="bump">
              <feTurbulence result="noise" numOctaves="4" baseFrequency="0.678" type="fractalNoise" />
              <feSpecularLighting result="specular" lightingColor="#fffffa" specularExponent="15" specularConstant="0.7" surfaceScale="0.22" in="noise">
                  <fePointLight z="210" y="-50" x="40" />
              </feSpecularLighting>
              <feComposite result="noise2" operator="in" in="specular" in2="SourceGraphic" />
              <feBlend mode="difference" in2="noise2" in="SourceGraphic" result="out" />
              <feBlend mode="overlay" in2="out" in="SourceGraphic" />
          </filter>
      </svg>
      <svg className="filter">
          <defs>
              <filter id="linen">
                  <feTurbulence type="fractalNoise" baseFrequency="0.9 0.03" numOctaves="2" seed="8" result="verticalNoise" />
                  <feTurbulence type="fractalNoise" baseFrequency="0.03 0.9" numOctaves="2" seed="12" result="horizontalNoise" />
                  <feBlend in="verticalNoise" in2="horizontalNoise" mode="multiply" result="woven" />
                  <feComponentTransfer in="woven" result="threadContrast">
                      <feFuncR type="gamma" amplitude="1.3" exponent="2.4" />
                      <feFuncG type="gamma" amplitude="1.3" exponent="2.4" />
                      <feFuncB type="gamma" amplitude="1.3" exponent="2.4" />
                  </feComponentTransfer>
                  <feGaussianBlur in="threadContrast" stdDeviation="0.22" result="softThreads" />
                  <feComposite in="softThreads" in2="SourceGraphic" operator="in" result="textureMask" />
                  <feBlend in="SourceGraphic" in2="textureMask" mode="color-burn" />
              </filter>
          </defs>
      </svg>
  </div>
);

export const CustomButton = ({ label, secondaryLabel, onClick }: { label: string, secondaryLabel: string, onClick?: () => void }) => (
  <button className="btn" onClick={onClick}>
      <div className="fabric"></div>
      <span className="txt">{label}</span>
      <span className="txt">{secondaryLabel}</span>
      <div className="shadow left"></div>
      <div className="shadow right"></div>
      <div className="dot"></div>
      <div className="light"></div>
  </button>
);
