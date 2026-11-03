import {
  AbsoluteFill,
  Easing,
  Sequence,
  Series,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// =====================================================================
//  SEGITIGA MISTERIUS  -  animasi pendek (1280x720, 30fps, ~36 detik)
// =====================================================================

const FONT = "'Nunito', 'Trebuchet MS', 'Arial Rounded MT Bold', Arial, sans-serif";
const FEET = 570; // posisi kaki karakter di scene kelas
const SVG_STYLE = { position: "absolute", width: "100%", height: "100%" } as const;
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const popIn = (frame: number, fps: number, delay = 0) =>
  spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 10, stiffness: 120 } });

// ---------------------------------------------------------------------
//  KARAKTER  (ubah warna / ciri di sini)
// ---------------------------------------------------------------------
type Look = {
  name: string;
  skin: string;
  hair?: string;
  hairStyle?: "side" | "spiky";
  glasses?: boolean;
  hijab?: boolean;
};

const HESSAM: Look = { name: "Hessam", skin: "#f1c9a5", hair: "#3b2a20", hairStyle: "side", glasses: true };
const HIRZI: Look = { name: "Hirzi", skin: "#dba77f", hair: "#161616", hairStyle: "spiky" };
const ARA: Look = { name: "Ara", skin: "#f3d2b3", hijab: true };

type Mood = "normal" | "happy" | "surprised" | "shy";

type StudentProps = Look & {
  x: number;
  y: number;
  frame: number;
  scale?: number;
  talking?: boolean;
  mood?: Mood;
  armL?: number; // sudut lengan kiri (layar), + = keluar
  armR?: number; // sudut lengan kanan (layar), + = keluar/naik
  showLabel?: boolean;
  flip?: boolean;
};

function Student(p: StudentProps) {
  const {
    x, y, frame, scale = 1, talking = false, mood = "normal",
    armL = 0, armR = 0, showLabel = true, flip = false,
  } = p;
  const bob = Math.sin(frame / 12 + x) * 3;
  const blink = frame % 90 < 4;
  const mouthH = 3 + Math.abs(Math.sin(frame / 3)) * 8;
  const eyeRy = blink ? 0.8 : mood === "surprised" ? 6 : 4;
  const browY = mood === "surprised" ? -277 : -270;

  return (
    <g transform={`translate(${x},${y})`}>
      <ellipse cx={0} cy={2} rx={60 * scale} ry={10 * scale} fill="rgba(0,0,0,0.18)" />
      <g transform={`translate(0,${bob}) scale(${flip ? -scale : scale},${scale})`}>
        {/* kaki / rok */}
        {p.hijab ? (
          <>
            <path d="M-42,-130 L42,-130 L54,-22 L-54,-22 Z" fill="#6b7280" />
            <line x1={0} y1={-130} x2={0} y2={-22} stroke="#4b5563" strokeWidth={3} />
          </>
        ) : (
          <>
            <rect x={-30} y={-125} width={26} height={116} fill="#6b7280" />
            <rect x={4} y={-125} width={26} height={116} fill="#6b7280" />
          </>
        )}
        <ellipse cx={-16} cy={-8} rx={22} ry={9} fill="#111827" />
        <ellipse cx={16} cy={-8} rx={22} ry={9} fill="#111827" />

        {/* badan: seragam putih */}
        <rect x={-40} y={-220} width={80} height={112} rx={16} fill="#ffffff" stroke="#cbd5e1" strokeWidth={3} />
        {!p.hijab && <rect x={-40} y={-128} width={80} height={14} fill="#374151" />}
        <path d="M-14,-220 L0,-198 L14,-220 Z" fill="#e5e7eb" />
        <circle cx={22} cy={-188} r={7} fill="#ef4444" />

        {/* lengan */}
        <g transform={`rotate(${armL} -40 -208)`}>
          <rect x={-58} y={-212} width={20} height={86} rx={10} fill="#ffffff" stroke="#cbd5e1" strokeWidth={3} />
          <circle cx={-48} cy={-120} r={12} fill={p.skin} />
        </g>
        <g transform={`rotate(${-armR} 40 -208)`}>
          <rect x={38} y={-212} width={20} height={86} rx={10} fill="#ffffff" stroke="#cbd5e1" strokeWidth={3} />
          <circle cx={48} cy={-120} r={12} fill={p.skin} />
        </g>

        {/* leher */}
        <rect x={-10} y={-232} width={20} height={20} fill={p.skin} />

        {/* hijab pink (belakang wajah) */}
        {p.hijab && (
          <>
            <path
              d="M-58,-250 Q-62,-314 0,-314 Q62,-314 58,-250 Q68,-200 48,-166 L-48,-166 Q-68,-200 -58,-250 Z"
              fill="#f472b6"
            />
            <ellipse cx={0} cy={-250} rx={42} ry={46} fill="#ec4899" />
          </>
        )}

        {/* wajah */}
        {p.hijab ? (
          <ellipse cx={0} cy={-250} rx={36} ry={40} fill={p.skin} />
        ) : (
          <>
            <circle cx={-40} cy={-248} r={8} fill={p.skin} />
            <circle cx={40} cy={-248} r={8} fill={p.skin} />
            <circle cx={0} cy={-250} r={40} fill={p.skin} />
          </>
        )}

        {/* rambut */}
        {!p.hijab && p.hairStyle === "side" && (
          <path d="M-42,-256 Q-46,-306 0,-304 Q46,-306 42,-256 Q36,-282 8,-282 Q-20,-280 -42,-256 Z" fill={p.hair} />
        )}
        {!p.hijab && p.hairStyle === "spiky" && (
          <path
            d="M-42,-256 L-38,-296 L-24,-282 L-12,-308 L2,-284 L16,-308 L24,-284 L40,-298 L42,-256 Q30,-276 0,-276 Q-30,-276 -42,-256 Z"
            fill={p.hair}
          />
        )}

        {/* pipi merona */}
        {(mood === "shy" || mood === "happy") && (
          <>
            <circle cx={-24} cy={-238} r={7} fill="#fb7185" opacity={0.4} />
            <circle cx={24} cy={-238} r={7} fill="#fb7185" opacity={0.4} />
          </>
        )}

        {/* alis & mata */}
        <line x1={-22} y1={browY} x2={-8} y2={browY} stroke="#1f2937" strokeWidth={3} strokeLinecap="round" />
        <line x1={8} y1={browY} x2={22} y2={browY} stroke="#1f2937" strokeWidth={3} strokeLinecap="round" />
        <ellipse cx={-15} cy={-252} rx={4} ry={eyeRy} fill="#111827" />
        <ellipse cx={15} cy={-252} rx={4} ry={eyeRy} fill="#111827" />

        {/* kacamata */}
        {p.glasses && (
          <>
            <circle cx={-15} cy={-252} r={13} fill="rgba(186,230,253,0.3)" stroke="#111827" strokeWidth={3} />
            <circle cx={15} cy={-252} r={13} fill="rgba(186,230,253,0.3)" stroke="#111827" strokeWidth={3} />
            <line x1={-2} y1={-252} x2={2} y2={-252} stroke="#111827" strokeWidth={3} />
          </>
        )}

        {/* mulut */}
        {talking ? (
          <ellipse cx={0} cy={-232} rx={9} ry={mouthH} fill="#7f1d1d" />
        ) : mood === "surprised" ? (
          <ellipse cx={0} cy={-232} rx={6} ry={8} fill="#7f1d1d" />
        ) : (
          <path d="M-10,-236 Q0,-226 10,-236" stroke="#7f1d1d" strokeWidth={3} fill="none" strokeLinecap="round" />
        )}
      </g>

      {/* label nama */}
      {showLabel && (
        <g transform={`translate(0,${34 + 10 * scale})`}>
          <rect x={-62} y={-20} width={124} height={36} rx={18} fill="rgba(0,0,0,0.6)" />
          <text x={0} y={6} fontSize={22} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={FONT}>
            {p.name}
          </text>
        </g>
      )}
    </g>
  );
}

// ---------------------------------------------------------------------
//  KOMPONEN PEMBANTU
// ---------------------------------------------------------------------
function Classroom({ board, sub }: { board: string; sub?: string }) {
  return (
    <g>
      <rect width={1280} height={450} fill="#fde7c3" />
      <rect y={450} width={1280} height={270} fill="#c99a6b" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1={0} x2={1280} y1={470 + i * 45} y2={470 + i * 45} stroke="#b88556" strokeWidth={3} />
      ))}
      {/* jendela */}
      <rect x={60} y={70} width={230} height={190} fill="#bae6fd" stroke="#ffffff" strokeWidth={10} />
      <line x1={175} y1={70} x2={175} y2={260} stroke="#ffffff" strokeWidth={8} />
      <line x1={60} y1={165} x2={290} y2={165} stroke="#ffffff" strokeWidth={8} />
      {/* papan tulis */}
      <rect x={380} y={50} width={520} height={220} rx={10} fill="#2f5d50" stroke="#8b5a2b" strokeWidth={12} />
      <text x={640} y={sub ? 125 : 175} fontSize={40} fill="#f8fafc" fontWeight={800} textAnchor="middle" fontFamily={FONT}>
        {board}
      </text>
      {sub && (
        <text x={640} y={225} fontSize={44} fill="#fde047" fontWeight={900} textAnchor="middle" fontFamily={FONT}>
          {sub}
        </text>
      )}
      {/* jam */}
      <circle cx={1090} cy={120} r={46} fill="#ffffff" stroke="#475569" strokeWidth={6} />
      <line x1={1090} y1={120} x2={1090} y2={90} stroke="#111" strokeWidth={4} />
      <line x1={1090} y1={120} x2={1112} y2={128} stroke="#111" strokeWidth={4} />
    </g>
  );
}

function Desk({ x, y, w = 300 }: { x: number; y: number; w?: number }) {
  return (
    <g>
      <rect x={x - w / 2} y={y} width={w} height={22} rx={6} fill="#a16207" />
      <rect x={x - w / 2 + 20} y={y + 22} width={14} height={80} fill="#854d0e" />
      <rect x={x + w / 2 - 34} y={y + 22} width={14} height={80} fill="#854d0e" />
      {/* buku */}
      <rect x={x - 70} y={y - 16} width={60} height={16} fill="#3b82f6" />
      <rect x={x - 62} y={y - 30} width={56} height={14} fill="#ef4444" />
      <rect x={x + 30} y={y - 12} width={44} height={12} fill="#22c55e" />
    </g>
  );
}

function Bin({ x }: { x: number }) {
  return (
    <g>
      <rect x={x - 90} y={405} width={180} height={50} rx={8} fill="#ffffff" stroke="#16a34a" strokeWidth={5} />
      <text x={x} y={440} fontSize={26} fontWeight={900} fill="#16a34a" textAnchor="middle" fontFamily={FONT}>
        BANK SAMPAH
      </text>
      <rect x={x - 60} y={480} width={120} height={90} rx={10} fill="#16a34a" />
      <rect x={x - 70} y={470} width={140} height={16} rx={6} fill="#15803d" />
      <circle cx={x} cy={527} r={20} fill="none" stroke="#dcfce7" strokeWidth={6} />
    </g>
  );
}

function Bag({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <ellipse cx={0} cy={0} rx={34} ry={40} fill="#1f2937" />
      <ellipse cx={-10} cy={-8} rx={8} ry={14} fill="rgba(255,255,255,0.2)" />
      <path d="M-10,-36 L0,-54 L10,-36 Z" fill="#111827" />
    </g>
  );
}

function Hearts({ start, x, y }: { start: number; x: number; y: number }) {
  const frame = useCurrentFrame();
  const t = frame - start;
  if (t < 0) return null;
  return (
    <g>
      {[0, 1, 2, 3, 4].map((i) => {
        const life = (t + i * 14) % 70;
        const hx = x + (i - 2) * 30 + Math.sin((t + i * 14) / 9) * 14;
        const hy = y - life * 2.4;
        return (
          <path
            key={i}
            transform={`translate(${hx},${hy}) scale(${0.6 + (i % 3) * 0.15})`}
            d="M0,-8 C-14,-26 -40,-6 0,24 C40,-6 14,-26 0,-8Z"
            fill="#fb7185"
            opacity={1 - life / 70}
          />
        );
      })}
    </g>
  );
}

function Crowd({ jump }: { jump: number }) {
  const xs = [90, 210, 330, 450, 880, 1000, 1120, 1230];
  const hair = ["#111", "#3b2a20", "#111", "#5b3a29", "#111", "#7c4a2d", "#111", "#3b2a20"];
  const hijabs: Record<number, string> = { 2: "#60a5fa", 5: "#a78bfa" };
  return (
    <g>
      {xs.map((cx, i) => {
        const dy = jump * (0.6 + 0.4 * Math.abs(Math.sin(i * 2)));
        const hj = hijabs[i];
        return (
          <g key={i} transform={`translate(${cx},${-dy})`}>
            <rect x={-34} y={436} width={68} height={90} rx={22} fill="#ffffff" stroke="#cbd5e1" strokeWidth={3} />
            {hj && <ellipse cx={0} cy={412} rx={36} ry={38} fill={hj} />}
            <circle cx={0} cy={410} r={hj ? 24 : 26} fill="#e8b891" />
            {!hj && (
              <path d="M-27,408 Q-28,380 0,380 Q28,380 27,408 Q15,396 0,396 Q-15,396 -27,408 Z" fill={hair[i]} />
            )}
            <circle cx={-9} cy={410} r={3} fill="#111" />
            <circle cx={9} cy={410} r={3} fill="#111" />
            {jump > 0 && <ellipse cx={0} cy={422} rx={7} ry={6} fill="#7f1d1d" />}
          </g>
        );
      })}
    </g>
  );
}

function FloatingQ({ x, y, size, phase }: { x: number; y: number; size: number; phase: number }) {
  const frame = useCurrentFrame();
  const dy = Math.sin(frame / 15 + phase) * 14;
  return (
    <text
      x={x}
      y={y + dy}
      fontSize={size}
      fontWeight={900}
      fill="#fbbf24"
      textAnchor="middle"
      fontFamily={FONT}
      opacity={0.85}
    >
      ?
    </text>
  );
}

function Bubble({
  text, left, top, width = 360, size = 32, bg = "#ffffff",
}: { text: string; left: number; top: number; width?: number; size?: number; bg?: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = popIn(frame, fps);
  return (
    <div
      style={{
        position: "absolute", left, top, width,
        transform: `translate(-50%,-100%) scale(${s})`,
        transformOrigin: "50% 100%", fontFamily: FONT, pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "relative", background: bg, border: "5px solid #1f2937", borderRadius: 28,
          padding: "12px 20px", fontSize: size, fontWeight: 800, textAlign: "center",
          color: "#111827", lineHeight: 1.2, boxShadow: "0 8px 0 rgba(0,0,0,0.18)",
        }}
      >
        {text}
        <div
          style={{
            position: "absolute", left: "50%", bottom: -16, width: 24, height: 24, background: bg,
            borderRight: "5px solid #1f2937", borderBottom: "5px solid #1f2937",
            transform: "translateX(-50%) rotate(45deg)",
          }}
        />
      </div>
    </div>
  );
}

function Caption({ text }: { text: string }) {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8], [0, 1], CLAMP);
  return (
    <div
      style={{
        position: "absolute", left: 0, right: 0, bottom: 0, padding: "18px 40px",
        background: "rgba(15,23,42,0.82)", color: "#fff", fontFamily: FONT,
        fontWeight: 700, fontSize: 34, textAlign: "center", opacity: o,
      }}
    >
      {text}
    </div>
  );
}

// ---------------------------------------------------------------------
//  SCENE 0 - JUDUL  (120 frame)
// ---------------------------------------------------------------------
function TitleScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = popIn(frame, fps, 5);
  const sub = interpolate(frame, [40, 60], [0, 1], CLAMP);
  const p1 = popIn(frame, fps, 30);
  const p2 = popIn(frame, fps, 42);
  const p3 = popIn(frame, fps, 54);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg,#312e81,#7e22ce 60%,#be185d)" }}>
      <svg viewBox="0 0 1280 720" style={SVG_STYLE}>
        <FloatingQ x={150} y={300} size={110} phase={0} />
        <FloatingQ x={1130} y={340} size={140} phase={2} />
        <FloatingQ x={260} y={560} size={80} phase={4} />
        <FloatingQ x={1040} y={600} size={90} phase={1} />
        <Student {...HESSAM} x={400} y={650} scale={0.95 * p1} frame={frame} showLabel={p1 > 0.7} />
        <Student {...ARA} x={640} y={650} scale={0.95 * p2} frame={frame} showLabel={p2 > 0.7} mood="shy" />
        <Student {...HIRZI} x={880} y={650} scale={0.95 * p3} frame={frame} showLabel={p3 > 0.7} mood="happy" />
      </svg>
      <div
        style={{
          position: "absolute", top: 100, width: "100%", textAlign: "center", fontFamily: FONT,
          fontWeight: 900, fontSize: 112, color: "#fff", textShadow: "0 8px 0 rgba(0,0,0,0.3)",
          transform: `scale(${t})`,
        }}
      >
        Segitiga Misterius
      </div>
      <div
        style={{
          position: "absolute", top: 250, width: "100%", textAlign: "center", fontFamily: FONT,
          fontWeight: 800, fontSize: 40, color: "#fde68a", opacity: sub,
        }}
      >
        Hessam  •  Ara  •  Hirzi
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------
//  SCENE 1 - PERKENALAN  (150 frame)
// ---------------------------------------------------------------------
function IntroScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const araPop = popIn(frame, fps, 70);
  const wave = Math.sin(frame / 4) * 15;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1280 720" style={SVG_STYLE}>
        <Classroom board="KELAS XI" />
        <Student {...HESSAM} x={330} y={FEET} scale={1.1} frame={frame} mood="happy"
          talking={frame > 10 && frame < 50} armR={frame < 70 ? 150 + wave : 0} />
        <Student {...HIRZI} x={560} y={FEET} scale={1.1} frame={frame} mood="happy"
          talking={frame > 25 && frame < 60} armR={frame < 70 ? 150 - wave : 0} />
        <Student {...ARA} x={920} y={FEET} scale={1.1 * araPop} frame={frame} mood="shy"
          showLabel={araPop > 0.7} />
      </svg>
      <Sequence from={10} durationInFrames={45}>
        <Bubble text="Halo!" left={330} top={225} width={200} />
      </Sequence>
      <Sequence from={25} durationInFrames={40}>
        <Bubble text="Yo!" left={560} top={225} width={200} />
      </Sequence>
      <Sequence from={0} durationInFrames={70}>
        <Caption text="Hessam & Hirzi: dua sahabat yang satu kelas." />
      </Sequence>
      <Sequence from={70}>
        <Caption text="Di kelas yang sama, ada seorang cewek bernama Ara." />
      </Sequence>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------
//  SCENE 2 - KELOMPOK & BANK SAMPAH  (180 frame)
// ---------------------------------------------------------------------
function BeatA() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1280 720" style={SVG_STYLE}>
        <Classroom board="KERJA KELOMPOK" />
        <Student {...HESSAM} x={520} y={FEET} scale={1.1} frame={frame} mood="happy"
          talking={frame > 10 && frame < 50} />
        <Student {...ARA} x={760} y={FEET} scale={1.1} frame={frame} mood="happy"
          talking={frame > 50 && frame < 80} />
        <Desk x={640} y={470} w={420} />
      </svg>
      <Sequence from={10} durationInFrames={42}>
        <Bubble text="Kita bagi tugas ya, Ra!" left={520} top={225} width={380} />
      </Sequence>
      <Sequence from={50} durationInFrames={38}>
        <Bubble text="Siap, Sam!" left={760} top={225} width={260} />
      </Sequence>
      <Caption text="Hessam sering sekelompok dengan Ara..." />
    </AbsoluteFill>
  );
}

function BeatB() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1280 720" style={SVG_STYLE}>
        <Classroom board="PENGURUS BANK SAMPAH" />
        <Bin x={640} />
        <Student {...HIRZI} x={450} y={FEET} scale={1.1} frame={frame} mood="happy"
          talking={frame > 45 && frame < 80} />
        <Student {...ARA} x={830} y={FEET} scale={1.1} frame={frame} mood="happy"
          talking={frame > 8 && frame < 42} />
      </svg>
      <Sequence from={8} durationInFrames={40}>
        <Bubble text="Botol di sini, kertas di situ." left={830} top={225} width={400} />
      </Sequence>
      <Sequence from={45} durationInFrames={40}>
        <Bubble text="Oke, aku timbang dulu!" left={450} top={225} width={380} />
      </Sequence>
      <Caption text="...tapi Hirzi adalah partner Ara mengurus bank sampah." />
    </AbsoluteFill>
  );
}

function GroupScene() {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={90}>
        <BeatA />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <BeatB />
      </Sequence>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------
//  SCENE 3 - "TUNGGU, BIAR AKU AJA"  (240 frame)
// ---------------------------------------------------------------------
function TrashScene() {
  const frame = useCurrentFrame();
  const S = 1.1;
  const araX = 520;
  const hirziX = 780;
  const hessamX = 1000;

  const t = interpolate(frame, [135, 170], [0, 1], CLAMP);
  const bagAraX = araX + 52 * S;
  const bagAraY = FEET - 94;
  const bagHirziX = hirziX - 88;
  const bagHirziY = FEET - 105;
  const bagX = bagAraX + (bagHirziX - bagAraX) * t;
  const bagY = bagAraY + (bagHirziY - bagAraY) * t - Math.sin(Math.PI * t) * 40 + Math.sin(frame / 8) * 3;

  const jump = frame >= 185 ? Math.abs(Math.sin((frame - 185) / 4)) * 20 : 0;
  const shake = frame >= 185 ? Math.sin(frame * 1.5) * 4 : 0;
  const shoutO = interpolate(frame, [185, 195], [0, 1], CLAMP);

  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1280 720" style={SVG_STYLE}>
        <Classroom board="JADWAL PIKET" />
        <Crowd jump={jump} />
        <Student {...ARA} x={araX} y={FEET} scale={S} frame={frame}
          mood={frame > 140 ? "shy" : "normal"} />
        <Student {...HIRZI} x={hirziX} y={FEET} scale={S} frame={frame}
          mood={frame > 110 ? "happy" : "normal"}
          talking={frame > 110 && frame < 170}
          armL={frame > 120 ? 25 : 0} />
        <Student {...HESSAM} x={hessamX} y={FEET} scale={1.0} frame={frame}
          mood={frame > 185 ? "surprised" : "normal"} />
        <Bag x={bagX} y={bagY} />
        <Hearts start={190} x={640} y={330} />
      </svg>

      {/* teriakan satu kelas */}
      <div
        style={{
          position: "absolute", left: 190, top: 290, transform: `translate(-50%,-50%) rotate(${-8 + shake}deg)`,
          fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#ec4899",
          WebkitTextStroke: "3px #fff", opacity: shoutO,
        }}
      >
        CIEEE!
      </div>
      <div
        style={{
          position: "absolute", left: 1170, top: 290, transform: `translate(-50%,-50%) rotate(${8 - shake}deg)`,
          fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#ec4899",
          WebkitTextStroke: "3px #fff", opacity: shoutO,
        }}
      >
        CIEEE!
      </div>

      <Sequence from={0} durationInFrames={100}>
        <Bubble text="Bu Guru: Ara, Hirzi, tolong urus sampah-sampah ya!" left={640} top={150} width={560} bg="#fef08a" />
      </Sequence>
      <Sequence from={110} durationInFrames={70}>
        <Bubble text="Tunggu, biar aku aja." left={hirziX} top={225} width={340} />
      </Sequence>
      <Sequence from={195} durationInFrames={45}>
        <Bubble text="Hah? Ada apa?" left={hessamX} top={235} width={260} size={28} />
      </Sequence>

      <Sequence from={0} durationInFrames={100}>
        <Caption text="Suatu hari, guru menyuruh Ara dan Hirzi mengurus sampah." />
      </Sequence>
      <Sequence from={100} durationInFrames={85}>
        <Caption text="Ara membawa plastik sampah, tapi Hirzi menawarkan diri..." />
      </Sequence>
      <Sequence from={185}>
        <Caption text="Seisi kelas langsung berteriak: cie cie!" />
      </Sequence>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------
//  SCENE 4 - KEESOKAN HARINYA  (210 frame)
// ---------------------------------------------------------------------
function NextDayScene() {
  const frame = useCurrentFrame();
  const count = Math.round(interpolate(frame, [50, 110], [1, 8], CLAMP));
  const hirziX = interpolate(frame, [95, 135], [1400, 1040], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const overlay = interpolate(frame, [0, 25, 45], [1, 1, 0], CLAMP);

  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1280 720" style={SVG_STYLE}>
        <Classroom board="KELOMPOK BARU!" sub={`Hessam+Ara: ke-${count}`} />
        <Student {...HESSAM} x={520} y={FEET} scale={1.1} frame={frame}
          mood={frame > 55 ? "surprised" : "normal"} talking={frame > 60 && frame < 110} />
        <Student {...ARA} x={760} y={FEET} scale={1.1} frame={frame}
          mood={frame > 140 ? "shy" : "normal"} />
        <Student {...HIRZI} x={hirziX} y={FEET} scale={1.1} frame={frame} mood="happy"
          talking={frame > 140 && frame < 205}
          armR={frame > 135 ? 140 + Math.sin(frame / 4) * 15 : 0} />
        <Hearts start={150} x={640} y={330} />
      </svg>

      <Sequence from={60} durationInFrames={60}>
        <Bubble text="Sama Ara lagi?!" left={520} top={225} width={320} />
      </Sequence>
      <Sequence from={140} durationInFrames={70}>
        <Bubble text="Jodoh ngga kemana-mana, Sam!" left={1020} top={225} width={420} />
      </Sequence>

      <Sequence from={45} durationInFrames={85}>
        <Caption text="Besoknya, Hessam sekelompok lagi dengan Ara: yang ke-8 kalinya!" />
      </Sequence>
      <Sequence from={130}>
        <Caption text="Hirzi pun menggoda Hessam." />
      </Sequence>

      <AbsoluteFill
        style={{
          background: "#0f172a", opacity: overlay, justifyContent: "center", alignItems: "center",
          fontFamily: FONT, fontWeight: 900, fontSize: 80, color: "#fff",
        }}
      >
        Keesokan harinya...
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------
//  SCENE 5 - PERTANYAAN PENUTUP  (180 frame)
// ---------------------------------------------------------------------
function EndingScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line = interpolate(frame, [20, 60], [0, 1], CLAMP);
  const q = interpolate(frame, [40, 60], [0, 1], CLAMP);
  const last = interpolate(frame, [110, 130], [0, 1], CLAMP);
  const pA = popIn(frame, fps, 5);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#1e1b4b,#4c1d95)" }}>
      <svg viewBox="0 0 1280 720" style={SVG_STYLE}>
        <FloatingQ x={120} y={260} size={100} phase={0} />
        <FloatingQ x={1160} y={300} size={120} phase={2} />
        <FloatingQ x={640} y={470} size={70} phase={3} />
        <polygon
          points="350,390 930,390 640,308"
          fill="none"
          stroke="#fbbf24"
          strokeWidth={4}
          strokeDasharray="14 12"
          opacity={line}
        />
        <Student {...ARA} x={640} y={520} scale={0.85 * pA} frame={frame} mood="shy" showLabel={false} />
        <Student {...HESSAM} x={350} y={640} scale={1.0} frame={frame} mood="surprised" />
        <Student {...HIRZI} x={930} y={640} scale={1.0} frame={frame} mood="happy" />
      </svg>
      <div
        style={{
          position: "absolute", top: 60, width: "100%", padding: "0 80px", boxSizing: "border-box",
          textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 54, color: "#fff",
          lineHeight: 1.25, opacity: q,
        }}
      >
        Bagaimanakah cerita selanjutnya dari ketiga tokoh ini?
      </div>
      <div
        style={{
          position: "absolute", top: 220, width: "100%", textAlign: "center", fontFamily: FONT,
          fontWeight: 800, fontSize: 36, color: "#fde68a", opacity: last,
        }}
      >
        Segitiga Misterius  •  Tulis tebakanmu!
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------
//  GABUNGAN SEMUA SCENE
// ---------------------------------------------------------------------
export const TOTAL_FRAMES = 120 + 150 + 180 + 240 + 210 + 180; // 1080 frame = 36 detik

export function SegitigaMisterius() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Series>
        <Series.Sequence durationInFrames={120}>
          <TitleScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={150}>
          <IntroScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={180}>
          <GroupScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={240}>
          <TrashScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={210}>
          <NextDayScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={180}>
          <EndingScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
}
