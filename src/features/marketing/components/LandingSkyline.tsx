import * as S from '../pages/LandingPage.styles';

/** Fachada estilizada do hero — decorativa, sem significado semântico. */
export function LandingSkyline() {
  return (
    <S.Skyline viewBox="0 0 720 420" aria-hidden>
      <defs>
        <linearGradient id="facade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#244a6e" />
          <stop offset="100%" stopColor="#0c1d30" />
        </linearGradient>
        <linearGradient id="facadeTall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a557c" />
          <stop offset="100%" stopColor="#0d2033" />
        </linearGradient>
        <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b8944a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#b8944a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1624" />
          <stop offset="100%" stopColor="#06101c" />
        </linearGradient>
      </defs>

      <ellipse cx="540" cy="48" rx="110" ry="48" fill="url(#glow)" />

      <rect x="48" y="210" width="96" height="210" fill="url(#facade)" />
      <rect x="158" y="140" width="128" height="280" fill="url(#facadeTall)" />
      <rect x="300" y="88" width="148" height="332" fill="url(#facadeTall)" />
      <rect x="462" y="160" width="108" height="260" fill="url(#facade)" />
      <rect x="584" y="64" width="120" height="356" fill="url(#facadeTall)" />

      {/* Janelas — torre 1 */}
      <rect x="64" y="236" width="14" height="18" fill="#b8944a" opacity="0.35" />
      <rect x="90" y="236" width="14" height="18" fill="#b8944a" opacity="0.18" />
      <rect x="64" y="272" width="14" height="18" fill="#b8944a" opacity="0.28" />
      <rect x="90" y="308" width="14" height="18" fill="#b8944a" opacity="0.4" />

      {/* Torre 2 */}
      <rect x="178" y="168" width="16" height="22" fill="#b8944a" opacity="0.42" />
      <rect x="208" y="168" width="16" height="22" fill="#b8944a" opacity="0.22" />
      <rect x="178" y="214" width="16" height="22" fill="#b8944a" opacity="0.3" />
      <rect x="238" y="214" width="16" height="22" fill="#b8944a" opacity="0.18" />
      <rect x="208" y="260" width="16" height="22" fill="#b8944a" opacity="0.36" />

      {/* Torre central */}
      <rect x="324" y="118" width="18" height="24" fill="#b8944a" opacity="0.48" />
      <rect x="358" y="118" width="18" height="24" fill="#b8944a" opacity="0.24" />
      <rect x="392" y="118" width="18" height="24" fill="#b8944a" opacity="0.32" />
      <rect x="324" y="168" width="18" height="24" fill="#b8944a" opacity="0.28" />
      <rect x="358" y="218" width="18" height="24" fill="#b8944a" opacity="0.4" />
      <rect x="392" y="268" width="18" height="24" fill="#b8944a" opacity="0.22" />

      {/* Torre 4 */}
      <rect x="482" y="190" width="14" height="20" fill="#b8944a" opacity="0.34" />
      <rect x="510" y="230" width="14" height="20" fill="#b8944a" opacity="0.2" />
      <rect x="482" y="270" width="14" height="20" fill="#b8944a" opacity="0.38" />

      {/* Torre alta */}
      <rect x="604" y="92" width="18" height="26" fill="#b8944a" opacity="0.5" />
      <rect x="638" y="92" width="18" height="26" fill="#b8944a" opacity="0.26" />
      <rect x="604" y="140" width="18" height="26" fill="#b8944a" opacity="0.34" />
      <rect x="638" y="188" width="18" height="26" fill="#b8944a" opacity="0.42" />
      <rect x="604" y="236" width="18" height="26" fill="#b8944a" opacity="0.2" />

      <path d="M0 392 H720 V420 H0 Z" fill="url(#ground)" />
      <path
        d="M0 392 C120 378 240 404 360 392 C480 380 600 400 720 388 V392 H0 Z"
        fill="#081421"
        opacity="0.7"
      />
    </S.Skyline>
  );
}
