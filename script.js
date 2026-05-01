:root {
  --text: #2f3a2e;
  --muted: #6b7765;
  --gold-1: #fff6d6;
  --gold-2: #f3d28a;
  --gold-3: #d4a84f;
  --page-bg: #e9e7e1;
}

/* RESET */
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--page-bg);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}

#app {
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
}

.hidden {
  opacity: 0 !important;
  pointer-events: none !important;
  visibility: hidden !important;
}

/* BASE SCHERMATE */
.screen,
.panel {
  position: absolute;
  inset: 0;
  z-index: 10; /* sopra lo sfondo */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 22px;
  overflow: hidden;
}

.screen {
  z-index: 1;
}

.panel {
  z-index: 20;
  pointer-events: auto;
}

.panel::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  background: rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

/* =========================================================
   1. PORTA INIZIALE
   ========================================================= */

.door-intro {
  position: fixed;
  inset: 0;
  z-index: 99999;
  overflow: hidden;
  background: var(--page-bg);
}

.door-scene {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  perspective: 1400px;
  overflow: hidden;
  background: var(--page-bg);
}

.door-bg-real,
.door-leaf {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.door-bg-real {
  z-index: 1;
}

.door-leaf {
  z-index: 2;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transition:
    transform 1.8s cubic-bezier(.18,.84,.22,1),
    filter 1.4s ease,
    opacity 1.4s ease;
  filter: drop-shadow(0 12px 20px rgba(0,0,0,0.22));
}

.door-left {
  transform-origin: 45% 50%;
}

.door-right {
  transform-origin: 55% 50%;
}

.door-intro.opening .door-left {
  transform: rotateY(-68deg) translateX(-2%);
  filter: drop-shadow(-18px 12px 24px rgba(0,0,0,0.28));
}

.door-intro.opening .door-right {
  transform: rotateY(68deg) translateX(2%);
  filter: drop-shadow(18px 12px 24px rgba(0,0,0,0.28));
}

.door-intro.finished {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.8s ease;
}

/* AREA CLIC MANIGLIE */
.door-handle-hotspot {
  position: absolute;
  left: 50%;
  top: 62%;
  width: 140px;
  height: 70px;
  transform: translate(-50%, -50%);
  border: none;
  background: transparent !important;
  cursor: pointer;
  z-index: 5;
}

.door-intro.opening .door-handle-hotspot {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s ease;
}

/* BAGLIORI MANIGLIE */
.handle-glow {
  position: absolute;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: radial-gradient(
    circle,
    rgba(255, 225, 145, 0.95) 0%,
    rgba(255, 205, 95, 0.45) 34%,
    rgba(255, 190, 70, 0.18) 58%,
    transparent 72%
  );
  filter: blur(1px);
  opacity: 0.72;
  animation: handlePulse 1.9s ease-in-out infinite;
  pointer-events: none;
}

.handle-glow-left {
  left: 6%;
  top: 10%;
}

.handle-glow-right {
  left: 69%;
  top: 10%;
}

@keyframes handlePulse {
  0%, 100% {
    opacity: 0.35;
    transform: scale(0.85);
  }
  50% {
    opacity: 0.95;
    transform: scale(1.18);
  }
}


@keyframes tapHerePulse {
  0%, 100% {
    opacity: 0.45;
    transform: translate(-50%, 10px);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, 5px);
  }
}

/* ICONA TAP DOPO APERTURA PORTA */

.door-intro.show-enter .enter-seal {
  opacity: 1;
  pointer-events: auto;
  animation: enterSealFloat 2.4s ease-in-out infinite;
}

.enter-seal:active {
  transform: translateX(-50%) scale(0.88);
}

@keyframes enterSealFloat {
  0%, 100% {
    transform: translateX(-50%) translateY(0) scale(1);
  }
  50% {
    transform: translateX(-50%) translateY(-8px) scale(1.04);
  }
}

/* =========================================================
   2. SCELTA LINGUA
   ========================================================= */

#language-screen {
  background: var(--page-bg) !important;
}

.hero-envelope,
.bg-full {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.hero-envelope-img,
.bg-full img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: var(--page-bg);
}

.overlay-soft,
.overlay-focus {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.overlay-soft {
  background: radial-gradient(circle at center, rgba(0,0,0,0.02), rgba(0,0,0,0.08));
}

.overlay-focus {
  background: radial-gradient(circle at center, rgba(0,0,0,0.10), transparent 70%);
}

#language-box {
  position: absolute;
  left: 50%;
  top: 58%;
  width: min(92%, 500px);
  transform: translate(-50%, -50%);
  z-index: 4;
}

.language-box {
  padding: 38px 30px;
  border-radius: 38px;
  text-align: center;

  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(7px) saturate(1.05);
  -webkit-backdrop-filter: blur(7px) saturate(1.05);

  border: 1px solid rgba(255, 255, 255, 0.22);

  box-shadow:
    0 18px 45px rgba(0,0,0,0.10),
    inset 0 1px 0 rgba(255,255,255,0.22);
}

.language-kicker {
  margin: 0 0 12px;
  color: rgba(255,255,255,0.90);
  letter-spacing: 4px;
  font-size: 13px;
  font-weight: 600;
  text-shadow: 0 3px 12px rgba(0,0,0,0.42);
}

.language-rotator {
  margin: 0 0 26px;
  color: rgba(255,255,255,0.94);
  font-size: 34px;
  font-weight: 800;
  transition: all 0.4s ease;
  text-shadow: 0 3px 12px rgba(0,0,0,0.42);
}

.language-rotator.fade-out {
  opacity: 0;
  transform: translateY(-6px);
}

.language-rotator.fade-in {
  opacity: 1;
}

.lang-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.lang-buttons button {
  padding: 12px 18px;
  border-radius: 999px;
  border: none;
  background: rgba(255,255,255,0.92);
  color: #2f3a2e;
  font-weight: 700;
  cursor: pointer;
}

/* =========================================================
   3. HOME COME IMMAGINE + HOTSPOT
   ========================================================= */

.home-luxury-bg {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--page-bg);
}

.home-luxury-bg img {
  height: 100%;
  width: auto;
  max-width: 100%;
  object-fit: contain;
}

.hotspot {
  position: absolute;
  z-index: 9999;
  border: none;
  background: rgba(255, 0, 0, 0.01);
  cursor: pointer;
}

/* hotspot schermata home-luxury */
.hs-language {
  top: 9.8%;
  left: 70.8%;
  width: 6.8%;
  height: 6.2%;
}

.hs-ceremony {
  top: 44.5%;
  left: 23%;
  width: 26%;
  height: 16%;
}

.hs-reception {
  top: 44.5%;
  left: 50.5%;
  width: 26%;
  height: 16%;
}

.hs-rsvp {
  top: 64.5%;
  left: 23%;
  width: 54%;
  height: 12%;
}

.hs-info {
  top: 78.5%;
  left: 23%;
  width: 18%;
  height: 13%;
}

.hs-photos {
  top: 78.5%;
  left: 41.5%;
  width: 18%;
  height: 13%;
}

.hs-gift {
  top: 78.5%;
  left: 60%;
  width: 18%;
  height: 13%;
}

/* =========================================================
   4. PANNELLI INTERNI
   ========================================================= */

.panel-card {
  position: relative;
  z-index: 1;
  pointer-events: auto;
  width: min(100%, 430px);
  max-width: 430px;
  padding: 34px 26px;
  border-radius: 34px;

  background: linear-gradient(
    135deg,
    rgba(255,255,255,0.22),
    rgba(255,255,255,0.10)
  );

  backdrop-filter: blur(24px) saturate(1.15);
  -webkit-backdrop-filter: blur(24px) saturate(1.15);

  border: 1px solid rgba(255,255,255,0.34);

  box-shadow:
    0 24px 60px rgba(0,0,0,0.22),
    inset 0 1px 0 rgba(255,255,255,0.45),
    inset 0 -1px 0 rgba(255,255,255,0.08);

  text-align: center;
}

.panel-card h2 {
  margin: 0 0 10px;
  color: var(--gold-2);
  font-size: 34px;
  text-shadow:
    0 2px 6px rgba(0,0,0,0.28),
    0 0 10px rgba(255,215,150,0.22);
}

.section-icon {
  width: 130px;
  height: 130px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.section-title {
  margin: 12px 0 10px;
  font-family: "Playfair Display", "Times New Roman", serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--gold-2);
  text-shadow: 0 2px 6px rgba(0,0,0,0.28);
}

.section-text,
.section-time {
  margin: 8px 0;
  font-size: 17px;
  line-height: 1.45;
  color: rgba(255,255,255,0.92);
  text-shadow: 0 2px 5px rgba(0,0,0,0.22);
}

/* pulsante principale */
.map-button {
  position: relative;
  z-index: 5;
  isolation: isolate;
  pointer-events: auto;
  cursor: pointer;
  border: none;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  margin-top: 18px;
  padding: 14px 26px;
  min-width: 240px;
  border-radius: 999px;

  font-weight: 800;
  font-size: 18px;
  color: #2f3a2e;
  text-decoration: none;

  background: linear-gradient(180deg, #fff3c4 0%, #f0c96d 55%, #d4a84f 100%);

  box-shadow:
    0 0 18px rgba(255, 218, 128, 0.55),
    0 12px 26px rgba(0,0,0,0.22),
    inset 0 1px 0 rgba(255,255,255,0.9),
    inset 0 -2px 0 rgba(160,110,25,0.25);

  overflow: hidden;
  transition: transform 0.18s ease, filter 0.18s ease;
  animation: mapGlow 2.2s ease-in-out infinite;
}

.map-button::before {
  content: "";
  position: absolute;
  inset: -30%;
  background: linear-gradient(
    115deg,
    transparent 0%,
    transparent 38%,
    rgba(255,255,255,0.68) 48%,
    transparent 58%,
    transparent 100%
  );
  transform: translateX(-130%);
  animation: mapShine 3.2s ease-in-out infinite;
  pointer-events: none;
}

.map-button:hover {
  transform: translateY(-2px) scale(1.03);
  filter: brightness(1.06) saturate(1.18);
}

.map-button:active {
  transform: scale(0.96);
}

/* pulsanti secondari */
.secondary-button,
.panel-card button:not(.map-button) {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  margin-top: 14px;
  padding: 11px 18px;

  border: 1px solid rgba(255,255,255,0.36);
  border-radius: 999px;

  background: rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.85);

  font-weight: 700;
  cursor: pointer;

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  box-shadow:
    0 8px 18px rgba(0,0,0,0.12),
    inset 0 1px 0 rgba(255,255,255,0.35);
}

.back-button {
  margin-top: 16px !important;
  padding: 8px 10px !important;

  background: transparent !important;
  border: none !important;
  box-shadow: none !important;

  color: rgba(255,255,255,0.68) !important;

  font-size: 14px !important;
  font-weight: 600 !important;

  text-decoration: underline;
  text-underline-offset: 4px;
  cursor: pointer;
}

.back-button:hover {
  color: var(--gold-2) !important;
}

/* CERIMONIA */
.ceremony-card .section-icon {
  width: 170px;
  height: 170px;
}

.ceremony-card .section-icon img {
  transform: scale(1.25);
}

/* RICEVIMENTO */
.reception-card .section-icon {
  width: 250px;
  height: 250px;
  margin-bottom: 18px;
}

.reception-card .section-icon img {
  transform: scale(1.25);
}

.reception-card .map-button,
.reception-card .secondary-button,
.reception-card .back-button {
  display: flex !important;
  width: fit-content;
  margin-left: auto !important;
  margin-right: auto !important;
}

/* RSVP */
.rsvp-card {
  width: min(100%, 520px);
  max-width: 520px;
  padding: 40px 28px 36px;
}

.rsvp-card .section-icon {
  width: 260px;
  height: 170px;
  margin: 0 auto 8px;
}

.rsvp-card .section-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform: scale(1.35);
}

.rsvp-card h2 {
  font-size: 44px;
  margin: 0 0 16px;
}

.rsvp-card .section-text {
  max-width: 440px;
  margin: 0 auto 28px;
  font-size: 19px;
  line-height: 1.35;
}

/* INFO */
.info-card {
  max-height: 82dvh;
  overflow-y: auto;
  padding: 26px 22px;
}

.info-intro {
  font-size: 15px;
  margin-bottom: 10px;
  opacity: 0.85;
}

.info-content {
  text-align: left;
  max-width: 100%;
  color: #2f3a2e;
  text-shadow: none;
}

.info-section {
  margin: 0 0 18px;
  padding: 14px 16px;
  border-radius: 20px;
  background: rgba(255,255,255,0.28);
  border: 1px solid rgba(255,255,255,0.45);
}

.info-section h3 {
  margin: 0 0 8px;
  color: #d4a84f;
  font-size: 18px;
  line-height: 1.2;
  text-align: left;
  text-shadow: 0 1px 2px rgba(255,255,255,0.35);
}

.info-section p {
  margin: 6px 0;
  font-size: 14px;
  line-height: 1.35;
  text-align: left;
  color: #2f3a2e;
  text-shadow: none;
}

/* FOTO */
.photos-card .section-icon {
  width: 130px;
  height: 130px;
  margin-bottom: 18px;
}

.photos-card .section-icon img {
  transform: scale(1.18);
}

.photo-note {
  max-width: 320px;
  margin: 14px auto 0;
  font-size: 14px;
  line-height: 1.35;
  color: #2f3a2e;
  opacity: 0.9;
}

/* REGALO */
.gift-card .section-icon {
  width: 140px;
  height: 140px;
  margin: 0 auto 16px;
}

.iban-box {
  max-width: 360px;
  margin: 20px auto;
  padding: 14px 18px;
  border-radius: 14px;

  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  font-size: 16px;
  letter-spacing: 1px;
  text-align: center;
  word-break: break-all;
}

/* PARCHEGGI */
.parking-block {
  margin-top: 14px;
}

.parking-toggle {
  border: 1px solid rgba(243,210,138,0.55);
  border-radius: 999px;
  padding: 10px 20px;
  background: rgba(243,210,138,0.13);
  color: var(--gold-2);
  font-weight: 800;
  cursor: pointer;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.parking-list {
  margin-top: 14px;
  display: grid;
  gap: 10px;
  animation: parkingFade 0.35s ease forwards;
}

.parking-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  padding: 12px 14px;
  border-radius: 20px;

  background: rgba(255,255,255,0.14);
  border: 1px solid rgba(255,255,255,0.26);

  text-align: left;
}

.parking-item strong {
  color: var(--gold-2);
  font-size: 15px;
}

.parking-item p {
  margin: 3px 0 0;
  color: rgba(255,255,255,0.86);
  font-size: 13px;
}

.parking-item button {
  min-width: 58px;
  padding: 8px 12px;
  border-radius: 999px;
  border: none;

  background: linear-gradient(180deg, #fff3c4, #f0c96d 60%, #d4a84f);
  color: #2f3a2e;

  font-weight: 800;
  cursor: pointer;
}

/* =========================================================
   5. ANIMAZIONI
   ========================================================= */

.fade-in {
  animation: fadeIn 0.6s forwards;
}

.fade-out {
  animation: fadeOut 0.4s forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes mapGlow {
  0%, 100% {
    box-shadow:
      0 0 16px rgba(255, 218, 128, 0.42),
      0 10px 24px rgba(0,0,0,0.18),
      inset 0 1px 0 rgba(255,255,255,0.85);
  }
  50% {
    box-shadow:
      0 0 30px rgba(255, 218, 128, 0.72),
      0 14px 30px rgba(0,0,0,0.22),
      inset 0 1px 0 rgba(255,255,255,0.92);
  }
}

@keyframes mapShine {
  0% { transform: translateX(-130%); }
  45% { transform: translateX(130%); }
  100% { transform: translateX(130%); }
}

@keyframes parkingFade {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.enter-text-button {
  position: absolute;
  left: 50%;
  bottom: 20%;
  transform: translateX(-50%);
  z-index: 30;

  border: none;
  background: transparent;
  cursor: pointer;

  font-family: "Cinzel", serif;
  font-size: 28px;          /* più grande */
  font-weight: 800;
  letter-spacing: 10px;

  color: #fff6d6;

  text-shadow:
    0 3px 8px rgba(0,0,0,0.6),     /* contrasto forte */
    0 0 18px rgba(255,220,150,0.9), /* glow oro */
    0 0 35px rgba(255,200,100,0.6);

  opacity: 0;
  pointer-events: none;

  transition: opacity 0.4s ease;
}

/* quando appare */
.door-intro.show-enter .enter-text-button {
  opacity: 1;
  pointer-events: auto;
  animation: enterPulse 1.6s ease-in-out infinite;
}

/* animazione più elegante */
@keyframes enterPulse {
  0%, 100% {
    transform: translateX(-50%) scale(1);
    opacity: 0.75;
  }
  50% {
    transform: translateX(-50%) scale(1.06);
    opacity: 1;
  }
}

.door-intro.show-enter .enter-text-button {
  opacity: 1;
  pointer-events: auto;
  animation: enterTextFloat 2.2s ease-in-out infinite;
}

.enter-text-button:active {
  transform: translateX(-50%) scale(0.94);
}

@keyframes enterTextFloat {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
    opacity: 0.72;
  }
  50% {
    transform: translateX(-50%) translateY(-8px);
    opacity: 1;
  }
}
.door-video {

  position: absolute;

  inset: 0;

  width: 100%;

  height: 100%;

  object-fit: contain;

  background: #e9e7e1;

  z-index: 1;

}

.door-video-tap {

  position: absolute;

  left: 50%;

  top: 62%;

  transform: translate(-50%, -50%);

  z-index: 10;

  border: none;

  background: transparent;

  cursor: pointer;

  font-family: "Cinzel", serif;

  font-size: 22px;

  font-weight: 700;

  letter-spacing: 7px;

  color: rgba(255,245,210,0.96);

  text-shadow:

    0 2px 4px rgba(0,0,0,0.45),

    0 0 16px rgba(255,220,150,0.75);

  animation: tapHerePulse 1.8s ease-in-out infinite;

}

.door-intro.video-playing .door-video-tap {

  opacity: 0;

  pointer-events: none;

}

@keyframes tapHerePulse {

  0%, 100% {

    opacity: 0.55;

    transform: translate(-50%, -50%) translateY(0);

  }

  50% {

    opacity: 1;

    transform: translate(-50%, -50%) translateY(-8px);

  }

}

.door-video-tap {
  top: 66%;  /* prima era ~62% */
}

.door-intro.show-enter .enter-text-button {
  opacity: 1;
  pointer-events: auto;
  animation: enterTextFloat 2.2s ease-in-out infinite;
}

@keyframes enterTextFloat {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
    opacity: 0.7;
  }
  50% {
    transform: translateX(-50%) translateY(-8px);
    opacity: 1;
  }
}
/* TAP HERE sparisce quando parte il video e quando appare ENTER */
.door-intro.video-playing .door-video-tap,
.door-intro.show-enter .door-video-tap {
  display: none !important;
}


.door-intro.show-enter .enter-text-button {
  display: block !important;
}
#home-screen {
  position: fixed !important;
  inset: 0 !important;
  width: 100vw !important;
  height: 100dvh !important;
  padding: 0 !important;
  z-index: 10 !important;
  background: transparent !important;
}

#home-screen .home-luxury-bg {
  position: fixed !important;
  inset: 0 !important;
  width: 100vw !important;
  height: 100dvh !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

#home-screen .home-luxury-bg img {
  height: 100dvh !important;
  width: auto !important;
  max-width: none !important;
  object-fit: contain !important;
  display: block !important;
}
#seal-hotspot-bg,
#tap-hint-bg {
  display: none !important;
}
#global-bg {
  position: fixed;
  inset: 0;
  background: url("assets/door-open.jpg") center / cover no-repeat;
  z-index: 0;
}
#home-screen {
  opacity: 0;
  visibility: hidden;
  will-change: opacity;
}
#language-screen {
  pointer-events: auto;
}

#language-box,
#language-box * {
  pointer-events: auto;
}

#home-screen.hidden,
.panel.hidden,
#language-screen.hidden {
  pointer-events: none !important;
}
.panel {
  overflow-y: auto !important;
  align-items: flex-start !important;
  padding-top: max(22px, env(safe-area-inset-top)) !important;
  padding-bottom: max(110px, env(safe-area-inset-bottom)) !important;
}

.panel-card {
  margin: auto 0;
}

.ceremony-card {
  margin-top: 24px !important;
  margin-bottom: 120px !important;
}

.back-button {
  display: inline-flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  margin-bottom: 20px !important;
}    parkingWalk10: "10 min a piedi",
    openSmall: "Apri",

    receptionPlace: "Masseria Montalbano",
    receptionAddress: "SS16, km 871,800\n72017 Ostuni (BR), Italia",
    receptionTime: "Ore 15:00",
    openWebsite: "Sito web",

    rsvpTitle: "RSVP",
    rsvpText: "Conferma la tua presenza entro il 10 settembre",
    rsvpButton: "Conferma partecipazione",

    infoIntro: "Tutte le informazioni utili per il vostro soggiorno",
    infoContent: `
      <div class="info-section">
        <h3>🏨 Alloggi</h3>
        <p>Consigliamo di soggiornare direttamente presso la struttura del ricevimento.</p>
        <p><em>(Link struttura)</em></p>
        <p>In alternativa sono disponibili diversi B&amp;B nei dintorni di Brindisi, Ostuni e Fasano.</p>
      </div>

      <div class="info-section">
        <h3>✈️ 🚆 🚗 Trasporti</h3>
        <p>Brindisi è raggiungibile in aereo tramite l’aeroporto di Brindisi o Bari, circa 1h20 in auto.</p>
        <p>È disponibile un collegamento bus tra i due aeroporti, circa 7€.</p>
        <p>In treno: stazione Brindisi Centrale.</p>
        <p>Uber non è disponibile. I taxi sono limitati. Si consiglia il noleggio auto.</p>
        <p>Per condividere passaggi tra invitati sarà disponibile un modulo dedicato.</p>
        <p>Sarà disponibile un servizio navetta tra chiesa e ricevimento.</p>
      </div>

      <div class="info-section">
        <h3>👔 Dress code</h3>
        <p>Elegante.</p>
      </div>

      <div class="info-section">
        <h3>📞 Contatti</h3>
        <p>Fabio: +39 XXX<br>Inna: +XX XXX</p>
      </div>
    `,

    photosTitle: "Foto",
    photosText: "Hai scattato qualche foto? 👇",
    photosButton: "Condividi i tuoi ricordi",
    photosNote: "Puoi caricare foto e video anche dopo il matrimonio.",

    giftTitle: "Regalo",
    giftText: "Il regalo più grande è la vostra presenza. Se desiderate contribuire, potete farlo qui.",
    copyIban: "Copia IBAN",
    ibanCopied: "IBAN copiato",
    ibanManual: "Copia manualmente l'IBAN"
  },

  en: {
    weddingInvitation: "WEDDING INVITATION",
    eventDate: "XX October 2026",
    ceremony: "Ceremony",
    reception: "Reception",
    rsvp: "RSVP",
    info: "Info",
    photos: "Photos",
    gift: "Gift",

    tapSeal: "Tap the seal",
    back: "Back",

    ceremonyPlace: "Duomo di San Giovanni Battista",
    ceremonyAddress: "Via Duomo, 12\n72100 Brindisi (BR), Italy",
    ceremonyTime: "Time: 13:00",
    openMap: "Open in Google Maps",

    parkingTitle: "Recommended parking",
    parkingNear: "Nearest parking",
    parkingEasy: "Easy parking",
    parkingAlt: "Alternative",
    parkingWalk2: "2 min walk",
    parkingWalk5: "5 min walk",
    parkingWalk10: "10 min walk",
    openSmall: "Open",

    receptionPlace: "Masseria Montalbano",
    receptionAddress: "SS16, km 871,800\n72017 Ostuni (BR), Italy",
    receptionTime: "Time: 15:00",
    openWebsite: "Website",

    rsvpTitle: "RSVP",
    rsvpText: "Please confirm your attendance by September 10",
    rsvpButton: "Confirm attendance",

    infoIntro: "All the useful information for your stay",
    infoContent: `
      <div class="info-section">
        <h3>🏨 Accommodation</h3>
        <p>We recommend staying directly at the reception venue.</p>
        <p><em>(Venue link)</em></p>
        <p>Alternatively, there are several B&amp;Bs around Brindisi, Ostuni and Fasano.</p>
      </div>

      <div class="info-section">
        <h3>✈️ 🚆 🚗 Transport</h3>
        <p>Brindisi can be reached by flying into Brindisi Airport or Bari Airport, about 1h20 by car.</p>
        <p>A shuttle bus connects the two airports, approx. €7.</p>
        <p>By train: Brindisi Central Station.</p>
        <p>Uber is not available. Taxis are limited. Car rental is recommended.</p>
        <p>A dedicated form will be available for guests who wish to share rides.</p>
        <p>A shuttle service will be available between the church and the reception.</p>
      </div>

      <div class="info-section">
        <h3>👔 Dress code</h3>
        <p>Elegant.</p>
      </div>

      <div class="info-section">
        <h3>📞 Contacts</h3>
        <p>Fabio: +39 XXX<br>Inna: +XX XXX</p>
      </div>
    `,

    photosTitle: "Photos",
    photosText: "Did you take some photos? 👇",
    photosButton: "Share your memories",
    photosNote: "You can upload photos and videos even after the wedding.",

    giftTitle: "Gift",
    giftText: "Your presence is the greatest gift. If you wish to contribute, you can do it here.",
    copyIban: "Copy IBAN",
    ibanCopied: "IBAN copied",
    ibanManual: "Copy the IBAN manually"
  },

  ua: {
    weddingInvitation: "ВЕСІЛЬНЕ ЗАПРОШЕННЯ",
    eventDate: "XX жовтня 2026",
    ceremony: "Церемонія",
    reception: "Святкування",
    rsvp: "Підтвердження",
    info: "Інфо",
    photos: "Фото",
    gift: "Подарунок",

    tapSeal: "Натисніть на печатку",
    back: "Назад",

    ceremonyPlace: "Duomo di San Giovanni Battista",
    ceremonyAddress: "Via Duomo, 12\n72100 Brindisi (BR), Італія",
    ceremonyTime: "Час: 13:00",
    openMap: "Відкрити в Google Maps",

    parkingTitle: "Рекомендовані парковки",
    parkingNear: "Найближча парковка",
    parkingEasy: "Зручна парковка",
    parkingAlt: "Альтернатива",
    parkingWalk2: "2 хв пішки",
    parkingWalk5: "5 хв пішки",
    parkingWalk10: "10 хв пішки",
    openSmall: "Відкрити",

    receptionPlace: "Masseria Montalbano",
    receptionAddress: "SS16, km 871,800\n72017 Ostuni (BR), Італія",
    receptionTime: "Час: 15:00",
    openWebsite: "Сайт",

    rsvpTitle: "Підтвердження",
    rsvpText: "Підтвердіть свою присутність до 10 вересня",
    rsvpButton: "Підтвердити участь",

    infoIntro: "Уся корисна інформація для вашого перебування",
    infoContent: `
      <div class="info-section">
        <h3>🏨 Проживання</h3>
        <p>Рекомендуємо зупинитися безпосередньо в місці проведення святкування.</p>
        <p><em>(Посилання на локацію)</em></p>
        <p>Також доступні різні B&amp;B у районах Бріндізі, Остуні та Фазано.</p>
      </div>

      <div class="info-section">
        <h3>✈️ 🚆 🚗 Транспорт</h3>
        <p>До Бріндізі можна дістатися літаком через аеропорт Бріндізі або Барі, приблизно 1 год 20 хв на авто.</p>
        <p>Між аеропортами курсує автобус, приблизно 7€.</p>
        <p>Потягом: станція Brindisi Centrale.</p>
        <p>Uber недоступний. Таксі обмежені. Рекомендуємо оренду автомобіля.</p>
        <p>Буде доступна окрема форма для гостей, які бажають поділитися поїздкою.</p>
        <p>Буде організований трансфер між церквою та місцем святкування.</p>
      </div>

      <div class="info-section">
        <h3>👔 Дрес-код</h3>
        <p>Елегантний.</p>
      </div>

      <div class="info-section">
        <h3>📞 Контакти</h3>
        <p>Fabio: +39 XXX<br>Inna: +XX XXX</p>
      </div>
    `,

    photosTitle: "Фото",
    photosText: "Зробили кілька фото? 👇",
    photosButton: "Поділіться спогадами",
    photosNote: "Ви можете завантажувати фото та відео навіть після весілля.",

    giftTitle: "Подарунок",
    giftText: "Найбільший подарунок — це ваша присутність. Якщо бажаєте зробити внесок, можете зробити це тут.",
    copyIban: "Скопіювати IBAN",
    ibanCopied: "IBAN скопійовано",
    ibanManual: "Скопіюйте IBAN вручну"
  }
};

function applyTranslations(lang) {
  const dict = translations[lang] || translations.it;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key || !(key in dict)) return;
    el.innerHTML = String(dict[key]).replace(/\n/g, "<br>");
  });

  document.documentElement.lang = lang === "ua" ? "uk" : lang;
}


function startLanguageRotation() {
  const el = document.getElementById("language-rotator");
  if (!el) return;

  stopLanguageRotation();

  langIndex = 0;
  el.textContent = languageTitles[langIndex];
  el.classList.remove("fade-out", "fade-in");

  langInterval = setInterval(() => {
    el.classList.add("fade-out");

    setTimeout(() => {
      langIndex = (langIndex + 1) % languageTitles.length;
      el.textContent = languageTitles[langIndex];
      el.classList.remove("fade-out");
      el.classList.add("fade-in");
    }, 400);

    setTimeout(() => {
      el.classList.remove("fade-in");
    }, 850);
  }, 2000);
}

function stopLanguageRotation() {
  if (!langInterval) return;
  clearInterval(langInterval);
  langInterval = null;
}

function setLanguage(lang) {
  stopLanguageRotation();

  currentLang = translations[lang] ? lang : "it";
  localStorage.setItem("wedding_lang", currentLang);

  applyTranslations(currentLang);

  const homeImg = document.querySelector(".home-luxury-bg img");

  const imageMap = {
    it: "assets/home-luxury-it.jpg",
    en: "assets/home-luxury-en.jpg",
    ua: "assets/home-luxury-ua.jpg"
  };

  const newSrc = imageMap[currentLang] || imageMap.it;

  if (!homeImg) {
    openEnvelope();
    return;
  }

  const preload = new Image();

  preload.onload = () => {
    homeImg.src = newSrc;
    openEnvelope();
  };

  preload.onerror = () => {
    console.warn("Immagine non trovata:", newSrc);
    openEnvelope(); // così non resta bloccato
  };

  preload.src = newSrc;
}

function openEnvelope() {

  const languageScreen = document.getElementById("language-screen");

  const homeScreen = document.getElementById("home-screen");

  if (!languageScreen || !homeScreen) return;

  homeScreen.classList.remove("hidden");

  homeScreen.style.visibility = "visible";

  homeScreen.style.opacity = "1";

  homeScreen.style.pointerEvents = "auto";

  languageScreen.style.opacity = "0";

  languageScreen.style.visibility = "hidden";

  languageScreen.style.pointerEvents = "none";

  setTimeout(() => {

    languageScreen.classList.add("hidden");

  }, 120);

}

function openSection(sectionId) {
  const homeScreen = document.getElementById("home-screen");
  const section = document.getElementById(sectionId);

  if (!section) return;

  if (homeScreen) {
    homeScreen.classList.add("hidden");
    homeScreen.style.opacity = "0";
    homeScreen.style.visibility = "hidden";
    homeScreen.style.pointerEvents = "none";
  }

  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.add("hidden");
    panel.classList.remove("fade-in", "fade-out");
    panel.style.opacity = "0";
    panel.style.visibility = "hidden";
    panel.style.pointerEvents = "none";
  });

  section.classList.remove("hidden");
  section.style.opacity = "1";
  section.style.visibility = "visible";
  section.style.pointerEvents = "auto";
  section.classList.add("fade-in");

  applyTranslations(currentLang);
}

function goBack() {
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.add("hidden");
    panel.classList.remove("fade-in", "fade-out");
    panel.style.opacity = "0";
    panel.style.visibility = "hidden";
    panel.style.pointerEvents = "none";
  });

  const homeScreen = document.getElementById("home-screen");
  if (!homeScreen) return;

  homeScreen.classList.remove("hidden");
  homeScreen.style.opacity = "1";
  homeScreen.style.visibility = "visible";
  homeScreen.style.pointerEvents = "auto";
}

function resetLanguageScreen() {
  const languageScreen = document.getElementById("language-screen");
  const homeScreen = document.getElementById("home-screen");
  const box = document.getElementById("language-box");

  stopLanguageRotation();

  if (homeScreen) {
    homeScreen.classList.add("hidden");
    homeScreen.style.opacity = "0";
    homeScreen.style.visibility = "hidden";
    homeScreen.style.pointerEvents = "none";
  }

  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.add("hidden");
    panel.classList.remove("fade-in", "fade-out");
    panel.style.opacity = "0";
    panel.style.visibility = "hidden";
    panel.style.pointerEvents = "none";
  });

  if (languageScreen) {
    languageScreen.classList.remove("hidden", "fade-in", "fade-out");
    languageScreen.style.opacity = "1";
    languageScreen.style.visibility = "visible";
    languageScreen.style.pointerEvents = "auto";
  }

  if (box) {
    box.style.display = "block";
    box.style.opacity = "1";
    box.style.visibility = "visible";
    box.style.pointerEvents = "auto";
  }

  startLanguageRotation();
}

function goBackToLanguage() {
  resetLanguageScreen();
}

function changeLanguage() {
  resetLanguageScreen();
}

function copyIBAN() {
  const ibanEl = document.getElementById("iban");
  const dict = translations[currentLang] || translations.it;

  if (!ibanEl) return;

  const iban = ibanEl.textContent.trim();

  navigator.clipboard.writeText(iban)
    .then(() => alert(dict.ibanCopied))
    .catch(() => alert(dict.ibanManual));
}

function openCeremonyMap() {
  window.open("https://maps.app.goo.gl/bbaEuzwVKs98JcAu7", "_blank");
}

function toggleParking() {
  const list = document.getElementById("parking-list");
  const arrow = document.getElementById("parking-arrow");

  if (!list || !arrow) return;

  list.classList.toggle("hidden");
  list.classList.toggle("parking-open");

  arrow.textContent = list.classList.contains("hidden") ? "⌄" : "⌃";
}

function openParkingMap(number) {
  const links = {
    1: "https://maps.app.goo.gl/exuddjALBbtdyYV59",
    2: "https://maps.app.goo.gl/oVoGKFF5gi2VfXUD9",
    3: "https://maps.app.goo.gl/HiJgw4G2VcMLMoN39"
  };

  if (links[number]) window.open(links[number], "_blank");
}

function openReceptionMap() {
  window.open("https://maps.app.goo.gl/mqKc28RPTLKqBD8P9", "_blank");
}

function openReceptionWebsite() {
  window.open("https://www.masseriamontalbano.it/", "_blank");
}

function openRSVPForm() {
  const params = new URLSearchParams(window.location.search);

  const guestId = params.get("id") || "F001";
  const guestName = params.get("name") || "Fabio Greco";

  const forms = {
    it: "https://docs.google.com/forms/d/e/1FAIpQLSe7k03qwau1hYumu90xT_IRGECOyBpikZ3oQGsSTZWaO5mkXQ/viewform?usp=pp_url",
    en: "https://docs.google.com/forms/d/e/1FAIpQLSfksh99J6tctzbF52lIzZIPuwsFFbpGtuK4pyAqxIqw8X0HYw/viewform?usp=pp_url",
    ua: "https://docs.google.com/forms/d/e/1FAIpQLSfQ9pza3r-AxOzcppb69tEbS-XTsNu10OtQUhN3SgkO0zVsNw/viewform?usp=pp_url"
  };

  const base = forms[currentLang] || forms.it;

  const url =
    base +
    "&entry.1990752556=" + encodeURIComponent(guestId) +
    "&entry.321333560=" + encodeURIComponent(guestName);

  window.open(url, "_blank");
}

function confirmRSVP() {
  const messages = {
    it: "Verrai reindirizzato al modulo di conferma.",
    en: "You will be redirected to the RSVP form.",
    ua: "Вас буде перенаправлено до форми підтвердження."
  };

  if (confirm(messages[currentLang] || messages.it)) {
    openRSVPForm();
  }
}

function openPhotosUpload() {
  window.open("https://www.dropbox.com/request/m84qjpml4iolvosgwgit", "_blank");
}

function restoreSavedLanguage() {
  const savedLang = localStorage.getItem("wedding_lang");
  currentLang = savedLang && translations[savedLang] ? savedLang : "it";
  applyTranslations(currentLang);
}

window.addEventListener("load", () => {
  restoreSavedLanguage();
  startLanguageRotation();
});

window.addEventListener("resize", () => {
  positionSealHotspot();
});

function openDoorIntro() {
  const intro = document.getElementById("door-intro");
  if (!intro) return;

  intro.classList.add("opening");

  setTimeout(() => {
    intro.classList.add("show-enter");
  }, 1300);
}

function playDoorVideo() {
  const intro = document.getElementById("door-intro");

  if (!intro) return;

  intro.classList.add("video-playing");
  intro.classList.add("show-enter");
}

function enterInvitation() {
  const intro = document.getElementById("door-intro");
  const languageScreen = document.getElementById("language-screen");

  if (intro) {
    intro.classList.add("finished");
    setTimeout(() => {
      intro.style.display = "none";
    }, 800);
  }

  if (languageScreen) {
    languageScreen.classList.remove("hidden");
    languageScreen.classList.add("fade-in");
  }

  startLanguageRotation();
}
