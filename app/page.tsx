"use client";

import { useMemo, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  OrbitControls,
  Sparkles as DreiSparkles,
  Stars,
  Text,
} from "@react-three/drei";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import {
  ArrowRight,
  Bot,
  Building2,
  Command,
  Cpu,
  Database,
  ExternalLink,
  Globe2,
  Layers3,
  LineChart,
  Network,
  Rocket,
  ShieldCheck,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";

type PortfolioItem = {
  id: number;
  name: string;
  folder: string;
  color: string;
  accent: string;
  purpose: string;
  businessUse: string;
  industries: string[];
  workflowValue: string;
  proves: string[];
  proofDetails: string[];
  status: string;
  live: string;
  github?: string;
};

type OrbAnchor = {
  position: [number, number, number];
  scale: number;
  orbit: number;
  speed: number;
  phase: number;
  tilt: number;
};

type PreviewAnchor = {
  x: number;
  y: number;
  size: number;
  delay: number;
};

function shouldUseMobileVisualBudget() {
  if (typeof window === "undefined") {
    return true;
  }

  return window.matchMedia("(max-width: 760px), (pointer: coarse), (prefers-reduced-motion: reduce)").matches;
}

function subscribeToVisualBudget(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQueries = [
    window.matchMedia("(max-width: 760px)"),
    window.matchMedia("(pointer: coarse)"),
    window.matchMedia("(prefers-reduced-motion: reduce)"),
  ];

  mediaQueries.forEach((query) => query.addEventListener("change", onStoreChange));

  return () => mediaQueries.forEach((query) => query.removeEventListener("change", onStoreChange));
}

function useMobileVisualBudget() {
  return useSyncExternalStore(subscribeToVisualBudget, shouldUseMobileVisualBudget, () => true);
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    name: "AI Systems Lab",
    folder: "ai-systems-lab",
    color: "#ef4444",
    accent: "#fecaca",
    purpose:
      "A central AI portfolio hub showing technical direction, project maturity, and the foundation of the AI systems journey.",
    businessUse:
      "Used as a professional AI systems showcase for recruiters, executives, and technical teams to understand project capability in one place.",
    industries: ["Technology", "Consulting", "Education", "Recruiting"],
    workflowValue:
      "Creates one clear command center for presenting demos, technical proof, project links, and AI career positioning.",
    proves: ["AI portfolio identity", "system presentation", "career positioning"],
    proofDetails: [
      "Clarifies the portfolio's purpose, direction, and system progression so visitors understand the full AI journey quickly.",
      "Organizes multiple projects into one polished experience, making the live demos and technical maturity easy to compare.",
      "Frames the work around practical AI Solutions Engineering value instead of only showing isolated code examples.",
    ],
    status: "Foundation",
    live: "https://ai-systems-lab-blue.vercel.app/",
  },
  {
    id: 2,
    name: "AI Deployment Console",
    folder: "ai-deployment-console",
    color: "#f97316",
    accent: "#fed7aa",
    purpose:
      "Turns a business, strategy, or coding request into a structured deployment brief with problem, solution, action plan, and implementation direction.",
    businessUse:
      "Used by teams that need to turn vague requests into clear deployment plans before engineering work begins.",
    industries: ["Enterprise IT", "Consulting", "Software", "Operations"],
    workflowValue:
      "Reduces confusion by translating business needs into structured implementation steps, technical direction, and execution planning.",
    proves: ["deployment thinking", "prompt-to-plan workflow", "business translation"],
    proofDetails: [
      "Breaks vague requests into deployable scope, priorities, risks, and action steps before engineering work begins.",
      "Turns a user's prompt into a structured plan that teams can review, adjust, and execute without starting from scratch.",
      "Bridges business language and technical implementation so stakeholders and builders can move in the same direction.",
    ],
    status: "Deployment Layer",
    live: "https://ai-deployment-console.vercel.app/",
  },
  {
    id: 3,
    name: "AI Workflow Automation Assistant",
    folder: "ai-workflow-automation",
    color: "#eab308",
    accent: "#fef08a",
    purpose:
      "Helps teams automate repetitive workflows such as intake, task routing, summaries, follow-ups, and operational handoffs.",
    businessUse:
      "Used when departments need to reduce manual tasks, automate intake, and improve handoff reliability.",
    industries: ["Healthcare", "Customer Support", "HR", "Finance", "Operations"],
    workflowValue:
      "Improves speed and consistency by turning repeated work into structured workflows with clear ownership and next actions.",
    proves: ["workflow logic", "automation design", "business process support"],
    proofDetails: [
      "Maps intake, routing, ownership, status changes, and handoffs so repeated work follows a reliable path.",
      "Identifies which manual steps can be standardized or automated before a team invests in a full build.",
      "Supports operations by keeping summaries, next actions, follow-ups, and task flow consistent across teams.",
    ],
    status: "Workflow Layer",
    live: "https://ai-workflow-automation-ias.vercel.app/",
  },
  {
    id: 4,
    name: "AI RAG Knowledge System",
    folder: "ai-rag-system-ias",
    color: "#22c55e",
    accent: "#bbf7d0",
    purpose:
      "Lets a company search, summarize, and reason across internal documents, policies, knowledge bases, notes, and operating procedures.",
    businessUse:
      "Used by organizations that need employees to find answers from large document sets without searching manually.",
    industries: ["Healthcare", "Legal", "Education", "Enterprise Knowledge", "Compliance"],
    workflowValue:
      "Turns documents into searchable intelligence so teams can retrieve policies, procedures, insights, and answers faster.",
    proves: ["RAG thinking", "knowledge retrieval", "document intelligence"],
    proofDetails: [
      "Shows how documents can be prepared, searched, retrieved, and reasoned over by an AI knowledge system.",
      "Helps teams find accurate answers from policies, procedures, notes, and internal knowledge without manual searching.",
      "Turns static files into usable summaries, comparisons, guidance, and operational insight.",
    ],
    status: "Knowledge Layer",
    live: "https://ai-rag-system-ias.vercel.app/",
  },
  {
    id: 5,
    name: "AI Revenue Intelligence Assistant",
    folder: "ai-revenue-intelligence-ias",
    color: "#14b8a6",
    accent: "#99f6e4",
    purpose:
      "Helps sales and revenue teams identify opportunities, risks, customer patterns, pipeline issues, and growth actions.",
    businessUse:
      "Used by sales leaders and revenue teams to understand pipeline movement, customer risk, growth opportunities, and account priorities.",
    industries: ["Sales", "SaaS", "Telecom", "Retail", "Financial Services"],
    workflowValue:
      "Improves revenue workflows by surfacing risks, opportunities, next actions, and executive-level sales intelligence.",
    proves: ["revenue intelligence", "pipeline analysis", "executive insights"],
    proofDetails: [
      "Surfaces growth opportunities, account risk, customer patterns, and deal signals that revenue teams can act on.",
      "Helps leaders understand deal movement, stalled opportunities, bottlenecks, and where attention is needed.",
      "Condenses revenue activity into leadership-ready insight for faster decisions and clearer priorities.",
    ],
    status: "Revenue Layer",
    live: "https://ai-revenue-intelligence-ias.vercel.app/",
  },
  {
    id: 6,
    name: "AI Service Operations Intelligence System",
    folder: "ai-service-ops-ias",
    color: "#3b82f6",
    accent: "#bfdbfe",
    purpose:
      "Analyzes support tickets, escalations, SLA risk, service bottlenecks, and customer experience issues for operational improvement.",
    businessUse:
      "Used by service and support teams to reduce escalations, improve SLA visibility, and identify recurring customer pain points.",
    industries: ["Healthcare Support", "Call Centers", "Managed Services", "Telecom", "IT Helpdesk"],
    workflowValue:
      "Helps service teams route urgent work, detect bottlenecks, prioritize risk, and improve customer experience.",
    proves: ["service operations", "customer intelligence", "risk detection"],
    proofDetails: [
      "Tracks support volume, escalation flow, SLA pressure, and operational workload so service teams can respond faster.",
      "Finds patterns in tickets, complaints, sentiment, recurring issues, and customer needs.",
      "Flags urgent service problems and bottlenecks before they grow into escalations or missed service targets.",
    ],
    status: "Service Layer",
    live: "https://ai-service-ops-ias.vercel.app/",
  },
  {
    id: 7,
    name: "AI Enterprise Orchestrator",
    folder: "ai-enterprise-orchestrator-ias",
    color: "#8b5cf6",
    accent: "#ddd6fe",
    purpose:
      "Transforms business problems into process maps, readiness scoring, automation opportunities, governance controls, roadmaps, and executive visibility.",
    businessUse:
      "Used by leaders who need to understand how departments should coordinate before launching automation or process change.",
    industries: ["Enterprise Operations", "Healthcare Administration", "Finance", "Consulting", "Technology"],
    workflowValue:
      "Connects people, process, automation, governance, and executive visibility into one operating model.",
    proves: ["enterprise orchestration", "governance logic", "multi-agent coordination"],
    proofDetails: [
      "Aligns departments, workflows, readiness, automation opportunities, and roadmaps into one enterprise operating model.",
      "Shows where approvals, controls, oversight, and readiness checks should exist before automation scales across a company.",
      "Models how specialized AI agents or teams can coordinate, pass context, and complete work without losing accountability.",
    ],
    status: "Enterprise Layer",
    live: "https://ai-enterprise-orchestrator-ias.vercel.app/",
  },
  {
    id: 8,
    name: "AI Autonomous Operations Command Center",
    folder: "ai-autonomous-ops-ias",
    color: "#ec4899",
    accent: "#fbcfe8",
    purpose:
      "Simulates an AI operational workforce that routes work, creates execution queues, flags risks, updates workflow states, and prepares executive visibility.",
    businessUse:
      "Used as a model for how AI agents could coordinate real-time operational execution across departments.",
    industries: ["Healthcare Operations", "Enterprise IT", "Customer Operations", "Logistics", "Financial Services"],
    workflowValue:
      "Shows how AI can move beyond answering questions into routing tasks, coordinating action, monitoring risk, and updating execution state.",
    proves: ["autonomous operations", "3D agent networks", "execution simulation"],
    proofDetails: [
      "Shows AI moving operational work forward through queues, risk flags, status updates, routing, and executive visibility.",
      "Visualizes connected agents, dependencies, and coordination paths so complex operational systems are easier to understand.",
      "Demonstrates how automated operations could behave before connecting to real systems or production workflows.",
    ],
    status: "Autonomous Layer",
    live: "https://ai-autonomous-ops-ias.vercel.app/",
    github: "https://github.com/iAnthonyspearman/ai-operations-intel-ias",
  },
];

const project8SystemPalette = portfolioItems.slice(0, 7).map((item) => item.color);
const project8RainbowGradient = `linear-gradient(90deg, ${project8SystemPalette.join(", ")})`;

function paletteForProject(id: number) {
  return id === 8 ? project8SystemPalette : undefined;
}

function Orb({
  anchor,
  color,
  accent,
  active,
}: {
  anchor: OrbAnchor;
  color: string;
  accent: string;
  active: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (group.current) {
      const targetPosition = getOrbPosition(anchor, state.clock.elapsedTime, active);
      const targetScale = active ? anchor.scale * 1.12 : anchor.scale;

      group.current.position.lerp(targetPosition, Math.min(1, delta * 4.2));
      group.current.scale.setScalar(
        THREE.MathUtils.lerp(group.current.scale.x, targetScale, delta * 3.1)
      );
    }

    if (mesh.current) {
      mesh.current.rotation.x += delta * (active ? 0.55 : 0.18) * (1 + anchor.tilt * 0.18);
      mesh.current.rotation.y += delta * (active ? 0.75 : 0.25) * (1 + anchor.speed * 0.08);
    }

    if (ring.current) {
      ring.current.rotation.z += delta * (active ? 0.55 : 0.2) * (1 + anchor.speed * 0.06);
      ring.current.rotation.x += delta * (0.1 + Math.abs(anchor.tilt) * 0.05);
    }
  });

  return (
    <group ref={group} position={anchor.position}>
      <mesh ref={mesh}>
        <sphereGeometry args={[0.18, 48, 48]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 0.24 : 0.08}
          metalness={0.84}
          roughness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
        />
      </mesh>

      <mesh scale={1.52}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.052 : 0.022} />
      </mesh>

      <mesh ref={ring} rotation={[1.2 + anchor.tilt, 0.34, 0.6 - anchor.tilt * 0.5]}>
        <torusGeometry args={[0.255, 0.008, 16, 90]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={active ? 0.52 : 0.18} />
      </mesh>

      <mesh position={[-0.07, 0.08, 0.13]} scale={0.34}>
        <sphereGeometry args={[0.08, 20, 20]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.38} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function getOrbPosition(anchor: OrbAnchor, elapsedTime: number, active: boolean) {
  const motion = active ? 1 : 0.58;
  const orbit = anchor.orbit * motion;
  const time = elapsedTime * anchor.speed + anchor.phase;

  return new THREE.Vector3(
    anchor.position[0] + Math.cos(time) * orbit,
    anchor.position[1] + Math.sin(time * 0.74 + anchor.phase * 0.32) * orbit * 0.62,
    anchor.position[2] + Math.sin(time * 0.47 + anchor.phase * 0.56) * orbit * 1.18
  );
}

function ConstellationLink({
  start,
  end,
  accent,
  active,
  secondary,
}: {
  start: OrbAnchor;
  end: OrbAnchor;
  accent: string;
  active: boolean;
  secondary?: boolean;
}) {
  const attribute = useRef<THREE.BufferAttribute>(null);
  const points = useMemo(() => new Float32Array(6), []);

  useFrame((state) => {
    if (!attribute.current) return;

    const startPosition = getOrbPosition(start, state.clock.elapsedTime, active);
    const endPosition = getOrbPosition(end, state.clock.elapsedTime, active);

    attribute.current.setXYZ(0, startPosition.x, startPosition.y, startPosition.z);
    attribute.current.setXYZ(1, endPosition.x, endPosition.y, endPosition.z);
    attribute.current.needsUpdate = true;
  });

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          ref={attribute}
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={accent}
        transparent
        opacity={secondary ? (active ? 0.22 : 0.09) : active ? 0.52 : 0.2}
      />
    </line>
  );
}

function OrbConstellationCore({
  count,
  color,
  accent,
  active,
  label,
  compact,
  palette,
}: {
  count: number;
  color: string;
  accent: string;
  active: boolean;
  label: string;
  compact: boolean;
  palette?: string[];
}) {
  const group = useRef<THREE.Group>(null);

  const anchors = useMemo<OrbAnchor[]>(() => {
    if (count === 1) {
      return [
        {
          position: [0, 0.02, 0],
          scale: 1.16,
          orbit: 0.045,
          speed: 0.84,
          phase: 0.7,
          tilt: 0.18,
        },
      ];
    }

    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const compactScale = compact ? 0.84 : 1;
    const lateralSpread = Math.min(1.5, 0.66 + count * 0.095) * compactScale;
    const verticalSpread = Math.min(1.12, 0.58 + count * 0.065) * (compact ? 0.88 : 1);
    const depthSpread = Math.min(1.08, 0.34 + count * 0.08) * (compact ? 0.82 : 1);

    return Array.from({ length: count }, (_, index) => {
      const t = count === 1 ? 0.5 : index / (count - 1);
      const angle = index * goldenAngle + count * 0.37;
      const verticalBias = (0.5 - t) * verticalSpread;
      const sphereBand = Math.sqrt(Math.max(0.2, 1 - Math.pow((t * 2 - 1) * 0.78, 2)));
      const depthLayer = ((index % 3) - 1) * 0.22;
      const scale = 0.78 + ((index * 5 + count) % 4) * 0.09;

      return {
        position: [
          Math.cos(angle) * lateralSpread * sphereBand * 0.82 + Math.sin(index * 1.7) * 0.09,
          verticalBias + Math.sin(angle * 1.35) * 0.13,
          Math.sin(angle) * depthSpread + depthLayer + Math.cos(index * 0.73) * 0.11,
        ],
        scale: scale * (compact ? 0.92 : 1),
        orbit: (0.035 + (index % 4) * 0.011) * (compact ? 0.72 : 1),
        speed: compact ? 0.36 + (index % 5) * 0.052 : 0.46 + (index % 5) * 0.075,
        phase: index * 0.91 + count * 0.21,
        tilt: Math.sin(index * 1.23) * 0.42,
      };
    });
  }, [compact, count]);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * (active ? 0.24 : 0.1);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, active ? 0.28 : 0.14, delta);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, active ? -0.08 : -0.035, delta);
  });

  return (
    <Float speed={compact ? 0.9 : 1.2} rotationIntensity={compact ? 0.11 : 0.18} floatIntensity={compact ? 0.32 : 0.52}>
      <group ref={group}>
        {anchors.map((anchor, index) => (
          <Orb
            key={index}
            anchor={anchor}
            color={palette?.[index % palette.length] ?? (index % 2 === 0 ? color : accent)}
            accent={palette?.[(index + 1) % palette.length] ?? accent}
            active={active}
          />
        ))}

        {anchors.length > 1 &&
          anchors.map((anchor, index) => {
            const next = anchors[(index + 1) % anchors.length];
            const depthPartner = anchors[(index + 2) % anchors.length];

            return (
              <group key={`link-set-${index}`}>
                <ConstellationLink start={anchor} end={next} accent={palette?.[index % palette.length] ?? accent} active={active} />
                {anchors.length > 3 && index % 2 === 0 && (
                  <ConstellationLink
                    start={anchor}
                    end={depthPartner}
                    accent={palette?.[(index + 2) % palette.length] ?? accent}
                    active={active}
                    secondary
                  />
                )}
              </group>
            );
          })}

        <Text
          position={[0, compact ? -1.22 : -1.45, 0]}
          fontSize={compact ? 0.105 : 0.13}
          maxWidth={compact ? 1.75 : 2.6}
          color={palette?.[count % palette.length] ?? "#cbd5e1"}
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </group>
    </Float>
  );
}

function OrbConstellation({
  count,
  color,
  accent,
  active,
  label,
  palette,
}: {
  count: number;
  color: string;
  accent: string;
  active: boolean;
  label: string;
  palette?: string[];
}) {
  const isMobile = useMobileVisualBudget();
  const dpr: [number, number] = isMobile ? [1, 1] : [1, 2];
  const primaryLight = palette?.[0] ?? color;
  const secondaryLight = palette?.[palette.length - 1] ?? accent;

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, isMobile ? 4.8 : 4.2], fov: isMobile ? 45 : 42 }}
      gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#050711"]} />
      <ambientLight intensity={isMobile ? 0.34 : 0.26} />
      <directionalLight position={[-3.5, 4.4, 4.5]} intensity={isMobile ? 1.55 : 2.25} />
      <pointLight position={[2.4, 2.2, 2.6]} intensity={isMobile ? 0.82 : 1.14} color={primaryLight} />
      <pointLight position={[-2.2, -1.6, 2]} intensity={isMobile ? 0.36 : 0.54} color={secondaryLight} />
      {!isMobile && <Environment preset="city" />}
      <Stars radius={35} depth={16} count={isMobile ? 70 : 280} factor={2.4} fade speed={0.2} />
      <DreiSparkles count={Math.max(5, count * (isMobile ? 1 : 5))} scale={[2.4, 1.8, 1]} size={isMobile ? 0.82 : 1.4} speed={0.12} color={secondaryLight} />

      <OrbConstellationCore
        count={count}
        color={color}
        accent={accent}
        active={active}
        label={label}
        compact={isMobile}
        palette={palette}
      />

      {!isMobile && (
        <EffectComposer>


          <Bloom intensity={0.18} luminanceThreshold={0.32} luminanceSmoothing={0.42} />


          <Noise opacity={0.018} />


          <Vignette eskil={false} offset={0.18} darkness={0.62} />


        </EffectComposer>
      )}


      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={isMobile ? 0.16 : active ? 0.45 : 0.22} />
    </Canvas>
  );
}

function getPreviewAnchors(count: number): PreviewAnchor[] {
  if (count === 1) {
    return [{ x: 50, y: 50, size: 58, delay: 0 }];
  }

  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const spreadX = Math.min(34, 18 + count * 2.1);
  const spreadY = Math.min(26, 14 + count * 1.35);

  return Array.from({ length: count }, (_, index) => {
    const t = count === 1 ? 0.5 : index / (count - 1);
    const angle = index * goldenAngle + count * 0.32;
    const band = Math.sqrt(Math.max(0.24, 1 - Math.pow((t * 2 - 1) * 0.74, 2)));

    return {
      x: 50 + Math.cos(angle) * spreadX * band + Math.sin(index * 1.8) * 3.5,
      y: 50 + (0.5 - t) * spreadY + Math.sin(angle * 1.2) * 4.5,
      size: 32 + ((index * 7 + count) % 4) * 5,
      delay: index * 0.28,
    };
  });
}

function MobileOrbPreview({
  count,
  color,
  accent,
  label,
  palette,
  active,
}: {
  count: number;
  color: string;
  accent: string;
  label: string;
  palette?: string[];
  active?: boolean;
}) {
  const anchors = useMemo(() => getPreviewAnchors(count), [count]);
  const labelColor = palette ? "#ffffff" : accent;

  return (
    <div
      className={`mobile-orb-preview ${palette ? "mobile-orb-preview-rainbow" : ""}`}
      data-active={active ? "true" : "false"}
      aria-hidden="true"
      style={
        {
          "--preview-color": color,
          "--preview-accent": accent,
          "--preview-label": labelColor,
        } as CSSProperties
      }
    >
      {anchors.length > 1 &&
        anchors.map((anchor, index) => {
          const next = anchors[(index + 1) % anchors.length];
          const xDistance = next.x - anchor.x;
          const yDistance = next.y - anchor.y;
          const length = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
          const angle = Math.atan2(yDistance, xDistance) * (180 / Math.PI);
          const linkColor = palette?.[index % palette.length] ?? accent;

          return (
            <span
              key={`mobile-link-${index}`}
              className="mobile-constellation-link"
              style={{
                left: `${anchor.x}%`,
                top: `${anchor.y}%`,
                width: `${length}%`,
                transform: `rotate(${angle}deg)`,
                background: `linear-gradient(90deg, transparent, ${linkColor}cc, transparent)`,
                boxShadow: `0 0 5px ${linkColor}33`,
              }}
            />
          );
        })}

      {anchors.map((anchor, index) => {
        const orbColor = palette?.[index % palette.length] ?? (index % 2 === 0 ? color : accent);

        return (
          <span
            key={`mobile-orb-${index}`}
            className="mobile-orb"
            style={{
              left: `calc(${anchor.x}% - ${anchor.size / 2}px)`,
              top: `calc(${anchor.y}% - ${anchor.size / 2}px)`,
              width: anchor.size,
              height: anchor.size,
              animationDelay: `${anchor.delay}s`,
              background: `radial-gradient(circle at 32% 24%, #ffffff, ${orbColor} 38%, #02040b 74%)`,
              boxShadow: `0 0 ${active ? 14 : 9}px ${orbColor}44, inset -10px -12px 24px rgba(0,0,0,.62), inset 7px 7px 14px rgba(255,255,255,.1)`,
            }}
          />
        );
      })}

      <span className={`mobile-orb-label ${palette ? "mobile-orb-label-rainbow" : ""}`}>
        {label}
      </span>
    </div>
  );
}

function PowerNode({
  position,
  color,
  accent,
  index,
  selected,
  onSelect,
}: {
  position: [number, number, number];
  color: string;
  accent: string;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const node = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!node.current) return;

    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.4 + index) * 0.06;
    const target = selected ? 1.75 : pulse;

    node.current.scale.setScalar(THREE.MathUtils.lerp(node.current.scale.x, target, delta * 5));
    node.current.rotation.y += delta * (selected ? 1.2 : 0.38);
  });

  return (
    <group
      ref={node}
      position={position}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      <mesh>
        <sphereGeometry args={[0.095, 44, 44]} />
        <meshPhysicalMaterial
          color={selected ? accent : color}
          emissive={selected ? accent : color}
          emissiveIntensity={selected ? 1.35 : 0.42}
          metalness={0.92}
          roughness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.06}
          reflectivity={1}
        />
      </mesh>

      <mesh scale={selected ? 3.2 : 2.05}>
        <sphereGeometry args={[0.095, 32, 32]} />
        <meshBasicMaterial
          color={selected ? accent : color}
          transparent
          opacity={selected ? 0.2 : 0.08}
        />
      </mesh>

      <mesh rotation={[1.2, 0.35, 0.6]}>
        <torusGeometry args={[0.18, 0.009, 16, 90]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={selected ? accent : color}
          emissiveIntensity={selected ? 1.25 : 0.45}
          transparent
          opacity={selected ? 0.68 : 0.34}
        />
      </mesh>
    </group>
  );
}

function MovingPowerLight({
  curve,
  targetT,
  accent,
  color,
  palette,
}: {
  curve: THREE.CatmullRomCurve3;
  targetT: number | null;
  accent: string;
  color: string;
  palette?: string[];
}) {
  const main = useRef<THREE.Group>(null);
  const trailA = useRef<THREE.Mesh>(null);
  const trailB = useRef<THREE.Mesh>(null);
  const trailC = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const progress = useRef(0);

  useFrame((state, delta) => {
    const autoT = (state.clock.elapsedTime * 0.115) % 1;
    const destination = targetT ?? autoT;

    progress.current = THREE.MathUtils.lerp(progress.current, destination, targetT === null ? 0.035 : delta * 2.4);

    const t = progress.current;
    const point = curve.getPoint(t);
    const tangent = curve.getTangent(t);

    if (main.current) {
      main.current.position.copy(point);
      main.current.lookAt(point.clone().add(tangent));
    }

    if (light.current) {
      light.current.position.copy(point);
      light.current.intensity = targetT === null ? 2.4 : 4.8;
      if (palette) {
        light.current.color.set(palette[Math.floor(t * palette.length) % palette.length]);
      }
    }

    const trailPoints = [
      curve.getPoint(Math.max(0, t - 0.035)),
      curve.getPoint(Math.max(0, t - 0.07)),
      curve.getPoint(Math.max(0, t - 0.105)),
    ];

    if (trailA.current) trailA.current.position.copy(trailPoints[0]);
    if (trailB.current) trailB.current.position.copy(trailPoints[1]);
    if (trailC.current) trailC.current.position.copy(trailPoints[2]);
  });

  return (
    <group>
      <pointLight ref={light} color={accent} intensity={3.4} distance={2.6} />

      <group ref={main}>
        <mesh>
          <sphereGeometry args={[0.16, 42, 42]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.98} />
        </mesh>

        <mesh scale={1.9}>
          <sphereGeometry args={[0.16, 36, 36]} />
          <meshBasicMaterial color={accent} transparent opacity={0.36} />
        </mesh>

        <mesh scale={3.2}>
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.16} />
        </mesh>
      </group>

      <mesh ref={trailA}>
        <sphereGeometry args={[0.11, 32, 32]} />
        <meshBasicMaterial color={accent} transparent opacity={0.32} />
      </mesh>

      <mesh ref={trailB}>
        <sphereGeometry args={[0.085, 28, 28]} />
        <meshBasicMaterial color={accent} transparent opacity={0.22} />
      </mesh>

      <mesh ref={trailC}>
        <sphereGeometry args={[0.06, 24, 24]} />
        <meshBasicMaterial color={accent} transparent opacity={0.13} />
      </mesh>
    </group>
  );
}

function PortfolioDnaHelix({
  color,
  accent,
  palette,
}: {
  color: string;
  accent: string;
  palette?: string[];
}) {
  const group = useRef<THREE.Group>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const count = 42;
  const dnaColors = palette ?? [color, accent];
  const centerColor = palette?.[3] ?? accent;
  const leftRailColor = palette?.[5] ?? color;
  const rightRailColor = palette?.[6] ?? accent;

  const left = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const t = i / (count - 1);
      const angle = t * Math.PI * 8.4;
      return new THREE.Vector3(Math.cos(angle) * 0.82, (0.5 - t) * 3.45, Math.sin(angle) * 0.82);
    });
  }, []);

  const right = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const t = i / (count - 1);
      const angle = t * Math.PI * 8.4 + Math.PI;
      return new THREE.Vector3(Math.cos(angle) * 0.82, (0.5 - t) * 3.45, Math.sin(angle) * 0.82);
    });
  }, []);

  const centerPath = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      left.map((point, index) => point.clone().lerp(right[index], 0.5))
    );
  }, [left, right]);

  const selectedT = selectedIndex === null ? null : selectedIndex / Math.max(1, count - 1);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.22;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0.2, delta);
  });

  return (
    <group ref={group}>
      {/* Thick glowing center power channel */}
      <mesh>
        <tubeGeometry args={[centerPath, 240, 0.035, 18, false]} />
        <meshBasicMaterial color={centerColor} transparent opacity={palette ? 0.22 : 0.16} />
      </mesh>

      <mesh>
        <tubeGeometry args={[centerPath, 240, 0.018, 16, false]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={centerColor}
          emissiveIntensity={palette ? 0.95 : 0.76}
          transparent
          opacity={palette ? 0.34 : 0.28}
        />
      </mesh>

      {/* Main DNA rails */}
      <mesh>
        <tubeGeometry args={[new THREE.CatmullRomCurve3(left), 240, 0.04, 18, false]} />
        <meshPhysicalMaterial
          color={leftRailColor}
          emissive={leftRailColor}
          emissiveIntensity={palette ? 0.62 : 0.48}
          metalness={0.92}
          roughness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.06}
        />
      </mesh>

      <mesh>
        <tubeGeometry args={[new THREE.CatmullRomCurve3(right), 240, 0.04, 18, false]} />
        <meshPhysicalMaterial
          color={rightRailColor}
          emissive={rightRailColor}
          emissiveIntensity={palette ? 0.6 : 0.45}
          metalness={0.9}
          roughness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.06}
        />
      </mesh>

      {palette && (
        <>
          <mesh rotation={[0, 0.28, 0]}>
            <tubeGeometry args={[new THREE.CatmullRomCurve3(left), 180, 0.012, 12, false]} />
            <meshBasicMaterial color={palette[0]} transparent opacity={0.35} />
          </mesh>
          <mesh rotation={[0, -0.28, 0]}>
            <tubeGeometry args={[new THREE.CatmullRomCurve3(right), 180, 0.012, 12, false]} />
            <meshBasicMaterial color={palette[2]} transparent opacity={0.28} />
          </mesh>
        </>
      )}

      <MovingPowerLight curve={centerPath} targetT={selectedT} accent={centerColor} color={palette?.[0] ?? color} palette={palette} />

      {left.map((point, index) => {
        const rightPoint = right[index];
        const node = index % 3 === 0;
        const selected = selectedIndex === index;
        const mid = point.clone().lerp(rightPoint, 0.5);
        const rungCurve = new THREE.CatmullRomCurve3([point, mid, rightPoint]);
        const rungColor = dnaColors[index % dnaColors.length];
        const nextRungColor = dnaColors[(index + 1) % dnaColors.length];

        return (
          <group key={index}>
            <mesh
              onClick={(event) => {
                event.stopPropagation();
                setSelectedIndex(index);
              }}
              onPointerOver={(event) => {
                event.stopPropagation();
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                document.body.style.cursor = "default";
              }}
            >
              <tubeGeometry args={[rungCurve, 24, selected ? 0.026 : node ? 0.014 : 0.008, 12, false]} />
              <meshStandardMaterial
                color={selected ? "#ffffff" : node ? rungColor : palette ? rungColor : "#64748b"}
                emissive={selected ? rungColor : node ? rungColor : palette ? rungColor : "#64748b"}
                emissiveIntensity={selected ? 1.35 : node ? (palette ? 0.62 : 0.44) : palette ? 0.2 : 0.08}
                metalness={0.55}
                roughness={0.16}
                transparent
                opacity={selected ? 0.82 : node ? 0.62 : palette ? 0.28 : 0.18}
              />
            </mesh>

            {selected && (
              <mesh position={mid.toArray() as [number, number, number]} scale={2.4}>
                <sphereGeometry args={[0.13, 32, 32]} />
                <meshBasicMaterial color={rungColor} transparent opacity={0.1} />
              </mesh>
            )}

            {node && (
              <>
                <PowerNode
                  position={point.toArray() as [number, number, number]}
                  color={rungColor}
                  accent={nextRungColor}
                  index={index}
                  selected={selected}
                  onSelect={() => setSelectedIndex(index)}
                />
                <PowerNode
                  position={rightPoint.toArray() as [number, number, number]}
                  color={nextRungColor}
                  accent={rungColor}
                  index={index + 1}
                  selected={selected}
                  onSelect={() => setSelectedIndex(index)}
                />
              </>
            )}
          </group>
        );
      })}
    </group>
  );
}

function PortfolioDnaScene({
  color,
  accent,
  palette,
}: {
  color: string;
  accent: string;
  palette?: string[];
}) {
  const isMobile = useMobileVisualBudget();
  const dpr: [number, number] = isMobile ? [1, 1] : [1, 2];
  const primaryLight = palette?.[0] ?? color;
  const secondaryLight = palette?.[5] ?? accent;

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, isMobile ? 5.85 : 5.1], fov: isMobile ? 43 : 39 }}
      gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#050711"]} />
      <ambientLight intensity={isMobile ? 0.34 : 0.26} />
      <directionalLight position={[-3.5, 4.4, 4.5]} intensity={isMobile ? 1.55 : 2.25} />
      <pointLight position={[2.7, 2.4, 2.7]} intensity={isMobile ? 0.95 : 1.65} color={primaryLight} />
      <pointLight position={[-2.4, -1.8, 2.2]} intensity={isMobile ? 0.5 : 0.95} color={secondaryLight} />
      {palette?.map((paletteColor, index) => (
        <pointLight
          key={paletteColor}
          position={[
            Math.cos(index * 0.9) * 2.7,
            Math.sin(index * 1.1) * 2.2,
            2 + (index % 3) * 0.5,
          ]}
          intensity={isMobile ? 0.12 : 0.24}
          color={paletteColor}
        />
      ))}
      {!isMobile && <Environment preset="city" />}
      <Stars radius={42} depth={18} count={isMobile ? 90 : 420} factor={3} fade speed={0.22} />
      {palette ? (
        palette.map((paletteColor, index) => (
          <DreiSparkles
            key={paletteColor}
            count={isMobile ? 3 : 10}
            scale={[2.8, 3.4, 1.6]}
            size={(isMobile ? 0.9 : 1.4) + index * 0.05}
            speed={0.13 + index * 0.01}
            color={paletteColor}
          />
        ))
      ) : (
        <DreiSparkles count={isMobile ? 12 : 42} scale={[2.8, 3.4, 1.6]} size={isMobile ? 1.1 : 1.9} speed={0.18} color={accent} />
      )}
      <Float speed={1.25} rotationIntensity={0.24} floatIntensity={0.7}>
        <PortfolioDnaHelix color={color} accent={accent} palette={palette} />
      </Float>
      {!isMobile && (
        <EffectComposer>

        <Bloom intensity={0.24} luminanceThreshold={0.32} luminanceSmoothing={0.42} />

          <Noise opacity={0.018} />

          <Vignette eskil={false} offset={0.18} darkness={0.62} />

        </EffectComposer>
      )}

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={isMobile ? 0.18 : 0.35} />
    </Canvas>
  );
}

function ProjectModal({
  item,
  onClose,
}: {
  item: PortfolioItem | null;
  onClose: () => void;
}) {
  const isProject8 = item?.id === 8;
  const projectPalette = item ? paletteForProject(item.id) : undefined;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/75 px-3 py-3 backdrop-blur-xl sm:items-center sm:px-5 sm:py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={{ opacity: 0, scale: 0.88, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 28 }}
            transition={{ type: "spring", stiffness: 135, damping: 18 }}
            className={`modal-shell glass-panel w-full max-w-6xl rounded-[1.35rem] p-4 sm:rounded-[2rem] sm:p-6 ${isProject8 ? "project-card-combined modal-combined" : ""}`}
            style={
              {
                "--project-color": item.color,
                "--project-accent": item.accent,
                "--project-rainbow": project8RainbowGradient,
                borderColor: isProject8 ? "rgba(255, 255, 255, 0.36)" : `${item.color}66`,
                boxShadow: isProject8
                  ? "0 0 42px rgba(239,68,68,.22), 0 0 72px rgba(34,197,94,.16), 0 0 104px rgba(59,130,246,.16), 0 40px 140px rgba(0,0,0,.65)"
                  : `0 0 90px ${item.color}22, 0 40px 140px rgba(0,0,0,.65)`,
              } as CSSProperties
            }
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className={`text-sm uppercase tracking-[0.28em] ${isProject8 ? "combined-word subtle" : ""}`} style={{ color: item.accent }}>
                  {item.status}
                </p>
                <h3 id="project-modal-title" className={`mt-2 text-2xl font-semibold tracking-tight sm:text-3xl md:text-5xl ${isProject8 ? "combined-word" : ""}`}>{item.name}</h3>
                <p className={`mt-3 break-words text-sm text-white/45 ${isProject8 ? "combined-word subtle" : ""}`}>{item.folder}</p>
              </div>

              <button
                type="button"
                aria-label="Close project details"
                onClick={onClose}
                className={`rounded-2xl border border-white/10 bg-white/[.06] p-3 text-white/65 transition hover:bg-white/[.12] hover:text-white ${isProject8 ? "combined-icon-button" : ""}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-[.9fr_1.1fr]">
              <div className={`modal-dna h-[260px] overflow-hidden rounded-[1.15rem] border border-white/10 bg-black/35 sm:h-[340px] sm:rounded-[1.7rem] lg:h-[420px] ${isProject8 ? "combined-dna" : ""}`}>
                <PortfolioDnaScene color={item.color} accent={item.accent} palette={projectPalette} />
              </div>

              <div className="space-y-4">
                {[
                  ["What it is", item.purpose],
                  ["Real business use", item.businessUse],
                  ["Workflow value", item.workflowValue],
                ].map(([title, body]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-black/25 p-4 sm:rounded-3xl sm:p-5">
                    <p className={`mb-2 font-semibold ${isProject8 ? "combined-word subtle" : ""}`} style={{ color: item.accent }}>{title}</p>
                    <p className="text-sm leading-7 text-white/62">{body}</p>
                  </div>
                ))}

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4 sm:rounded-3xl sm:p-5">
                    <p className={`mb-3 font-semibold ${isProject8 ? "combined-word subtle" : ""}`} style={{ color: item.accent }}>Industries</p>
                    <div className="flex flex-wrap gap-2">
                      {item.industries.map((industry) => (
                        <span key={industry} className={`rounded-full border border-white/10 bg-white/[.05] px-3 py-1 text-xs text-white/65 ${isProject8 ? "combined-chip" : ""}`}>
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4 sm:rounded-3xl sm:p-5">
                    <p className={`mb-3 font-semibold ${isProject8 ? "combined-word subtle" : ""}`} style={{ color: item.accent }}>Proves</p>
                    <div className="flex flex-wrap gap-2">
                      {item.proves.map((proof) => (
                        <span key={proof} className={`rounded-full border border-white/10 bg-white/[.05] px-3 py-1 text-xs text-white/65 ${isProject8 ? "combined-chip" : ""}`}>
                          {proof}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a href={item.live} target="_blank" rel="noreferrer" className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[.06] px-4 py-3 text-sm text-white transition hover:bg-white/[.1] sm:w-auto ${isProject8 ? "combined-chip" : ""}`}>
                    Open Live Demo <ExternalLink className="h-4 w-4" />
                  </a>
                  {item.github && (
                    <a href={item.github} target="_blank" rel="noreferrer" className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[.06] px-4 py-3 text-sm text-white transition hover:bg-white/[.1] sm:w-auto ${isProject8 ? "combined-chip" : ""}`}>
                      GitHub <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function iconFor(id: number) {
  const icons = [Command, Rocket, Workflow, Database, LineChart, ShieldCheck, Network, Bot];
  return icons[id - 1] ?? Sparkles;
}

export default function Home() {
  const [activeId, setActiveId] = useState(8);
  const [openProject, setOpenProject] = useState<PortfolioItem | null>(null);
  const mobileVisualBudget = useMobileVisualBudget();
  const showLivePreviewCanvases = !mobileVisualBudget;
  const active = portfolioItems.find((item) => item.id === activeId) ?? portfolioItems[7];
  const activeIsProject8 = active.id === 8;
  const activePalette = paletteForProject(active.id);

  return (
    <main className="portfolio-cosmos min-h-screen overflow-x-hidden bg-[#050711] text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(239,68,68,.16),transparent_28%),radial-gradient(circle_at_40%_8%,rgba(234,179,8,.12),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(139,92,246,.14),transparent_32%),radial-gradient(circle_at_50%_92%,rgba(20,184,166,.12),transparent_32%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />
      </div>

      <section className="relative z-10 mx-auto flex max-w-7xl flex-col gap-5 px-4 py-4 sm:gap-7 sm:px-5 sm:py-6 lg:px-8">
        <nav className="glass-panel flex flex-wrap items-start justify-between gap-4 rounded-2xl px-4 py-4 sm:items-center sm:rounded-3xl sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 sm:h-12 sm:w-12">
              <Command className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-white/50">AI Career Portfolio</p>
              <h1 className="text-base font-semibold tracking-tight sm:text-lg">Intelligence Automation Systems</h1>
            </div>
          </div>

          <div className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] px-4 py-2 text-xs text-white/60 sm:w-auto sm:text-sm">
            <Sparkles className="h-4 w-4 shrink-0 text-pink-200" />
            Projects 1–8 • Enterprise AI Systems
          </div>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
          <motion.section initial={false} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-6 md:p-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.06] px-4 py-2 text-sm text-white/70">
              <Globe2 className="h-4 w-4 text-emerald-200" />
              Enterprise AI systems portfolio
            </div>

            <h2 className="max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-6xl">
              Eight AI systems. One evolving intelligence architecture.
            </h2>

            <p className="mt-5 max-w-3xl text-base leading-7 text-white/62 sm:text-lg sm:leading-8">
              This portfolio shows a progression from AI deployment and workflow automation to enterprise orchestration
              and autonomous operations. Each system represents a real business use case, technical skill, and step toward
              enterprise-grade AI Solutions Engineering.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-4">
              {[
                ["8", "Active systems"],
                ["3D", "Interactive visuals"],
                ["AI", "Operational logic"],
                ["Vercel", "Live deployment"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-4 sm:rounded-3xl">
                  <p className="text-2xl font-semibold sm:text-3xl">{value}</p>
                  <p className="mt-1 text-sm text-white/45">{label}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-panel selected-system-panel overflow-hidden rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-6 ${activeIsProject8 ? "project-card-combined selected-system-combined" : ""}`}
            style={
              {
                "--project-color": active.color,
                "--project-accent": active.accent,
                "--project-rainbow": project8RainbowGradient,
              } as CSSProperties
            }
          >
            <div className="mb-4 flex items-start justify-between gap-3 sm:mb-5 sm:items-center">
              <div className="min-w-0">
                <p className={`text-sm text-white/50 ${activeIsProject8 ? "combined-word subtle" : ""}`}>Selected System</p>
                <h3 className={`text-xl font-semibold sm:text-2xl ${activeIsProject8 ? "combined-word" : ""}`}>{active.name}</h3>
              </div>
              <Layers3 className={`h-6 w-6 shrink-0 ${activeIsProject8 ? "combined-icon" : ""}`} style={{ color: active.accent }} />
            </div>

            <div className="h-[290px] overflow-hidden rounded-2xl border border-white/10 bg-black/35 sm:h-[390px] sm:rounded-3xl">
              {showLivePreviewCanvases ? (
                <OrbConstellation count={active.id} color={active.color} accent={active.accent} active label={active.name} palette={activePalette} />
              ) : (
                <MobileOrbPreview count={active.id} color={active.color} accent={active.accent} active label={active.name} palette={activePalette} />
              )}
            </div>
          </motion.section>
        </div>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {portfolioItems.map((item) => {
            const Icon = iconFor(item.id);
            const selected = activeId === item.id;
            const isProject8 = item.id === 8;
            const projectPalette = paletteForProject(item.id);

            return (
              <motion.button
                type="button"
                aria-label={`Open ${item.name} details`}
                key={item.id}
                whileHover={{ y: -6, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => {
                  setActiveId(item.id);
                  setOpenProject(item);
                }}
                className={`glass-panel project-card group rounded-[1.5rem] p-4 text-left transition sm:rounded-[2rem] sm:p-5 ${selected ? "ring-1 ring-white/30" : ""} ${isProject8 ? "project-card-combined" : ""}`}
                style={
                  {
                    "--project-color": item.color,
                    "--project-accent": item.accent,
                    "--project-rainbow": project8RainbowGradient,
                    borderColor: selected ? `${item.color}aa` : `${item.color}44`,
                    boxShadow: selected
                      ? `0 0 38px ${item.color}44, 0 0 90px ${item.color}24, 0 30px 100px rgba(0,0,0,.58)`
                      : `0 0 28px ${item.color}16, 0 24px 80px rgba(0,0,0,.44)`,
                  } as CSSProperties
                }
              >
                <div className="mb-4 flex items-start justify-between gap-3 sm:items-center">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl sm:h-12 sm:w-12" style={{ backgroundColor: `${item.color}25` }}>
                    <Icon className={`h-5 w-5 ${isProject8 ? "combined-icon" : ""}`} style={{ color: item.accent }} />
                  </div>
                  <span className={`rounded-full border border-white/10 bg-black/25 px-3 py-1 text-right text-xs text-white/50 ${isProject8 ? "combined-chip" : ""}`}>{item.status}</span>
                </div>

                <div className="h-[170px] overflow-hidden rounded-2xl border border-white/10 bg-black/35 sm:h-[180px] sm:rounded-3xl">
                  {showLivePreviewCanvases ? (
                    <OrbConstellation
                      count={item.id}
                      color={item.color}
                      accent={item.accent}
                      active={selected || isProject8}
                      label={`${item.id}`}
                      palette={projectPalette}
                    />
                  ) : (
                    <MobileOrbPreview
                      count={item.id}
                      color={item.color}
                      accent={item.accent}
                      active={selected || isProject8}
                      label={`${item.id}`}
                      palette={projectPalette}
                    />
                  )}
                </div>

                <h3 className={`mt-5 text-xl font-semibold ${isProject8 ? "combined-word" : ""}`} style={{ color: item.accent, textShadow: `0 0 16px ${item.color}77` }}>
                  {item.name}
                </h3>
                <p className={`mt-2 text-xs text-white/35 ${isProject8 ? "combined-word subtle" : ""}`}>{item.folder}</p>
                <p className="mt-4 text-sm leading-6 text-white/58">{item.purpose}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {item.proves.map((tag) => (
                    <span key={tag} className={`rounded-full border border-white/10 bg-white/[.04] px-3 py-1 text-xs text-white/50 ${isProject8 ? "combined-chip" : ""}`}>{tag}</span>
                  ))}
                </div>
              </motion.button>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
          <div className="glass-panel rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <Cpu className="h-6 w-6 shrink-0 text-emerald-200" />
              <div className="min-w-0">
                <p className="text-sm text-white/50">Portfolio Maturity Path</p>
                <h3 className="text-xl font-semibold sm:text-2xl">From deployment to autonomous operations</h3>
              </div>
            </div>

            <div className="space-y-3">
              {portfolioItems.map((item) => {
                const isProject8 = item.id === 8;

                return (
                  <motion.button
                    type="button"
                    aria-pressed={activeId === item.id}
                    aria-label={`Select ${item.name}`}
                    key={item.id}
                    onClick={() => setActiveId(item.id)}
                    whileTap={{ scale: 0.985 }}
                    className={`maturity-path-button group flex w-full items-center gap-3 rounded-2xl border bg-black/25 p-3 text-left transition sm:gap-4 sm:rounded-3xl sm:p-4 ${isProject8 ? "project-card-combined maturity-combined" : ""}`}
                    style={
                      {
                        "--project-color": item.color,
                        "--project-accent": item.accent,
                        "--project-rainbow": project8RainbowGradient,
                        borderColor: isProject8 ? "rgba(255, 255, 255, 0.36)" : `${item.color}55`,
                        boxShadow: isProject8
                          ? "0 0 36px rgba(239,68,68,.2), 0 0 46px rgba(34,197,94,.14), 0 0 62px rgba(59,130,246,.14), inset 0 0 24px rgba(255,255,255,.08)"
                          : activeId === item.id
                            ? `0 0 36px ${item.color}33, inset 0 0 24px ${item.color}11`
                            : `0 0 24px ${item.color}18`,
                      } as CSSProperties
                    }
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl font-semibold ${isProject8 ? "combined-chip" : ""}`}
                      style={{ backgroundColor: `${item.color}25`, color: item.accent, boxShadow: `0 0 18px ${item.color}30` }}
                    >
                      {item.id}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`font-semibold tracking-tight transition ${isProject8 ? "combined-word" : ""}`}
                        style={{
                          color: item.accent,
                          textShadow:
                            activeId === item.id
                              ? `0 0 8px ${item.color}, 0 0 18px ${item.color}, 0 0 34px ${item.color}`
                              : `0 0 10px ${item.color}77`,
                        }}
                      >
                        {item.name}
                      </p>
                      <p className={`text-sm text-white/45 ${isProject8 ? "combined-word subtle" : ""}`}>{item.status}</p>
                    </div>
                    <ArrowRight className={`h-4 w-4 shrink-0 transition group-hover:translate-x-1 ${isProject8 ? "combined-icon" : ""}`} style={{ color: item.accent, filter: `drop-shadow(0 0 8px ${item.color})` }} />
                    <span className="maturity-wave" style={{ background: isProject8 ? project8RainbowGradient : `linear-gradient(120deg, transparent, ${item.color}55, ${item.accent}44, transparent)` }} />
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div
            className={`glass-panel rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-6 ${activeIsProject8 ? "project-card-combined value-combined" : ""}`}
            style={
              {
                "--project-color": active.color,
                "--project-accent": active.accent,
                "--project-rainbow": project8RainbowGradient,
              } as CSSProperties
            }
          >
            <div className="mb-5 flex items-center gap-3">
              <Building2 className={`h-6 w-6 shrink-0 ${activeIsProject8 ? "combined-icon" : ""}`} style={{ color: active.accent }} />
              <div className="min-w-0">
                <p className={`text-sm text-white/50 ${activeIsProject8 ? "combined-word subtle" : ""}`}>Real-World Value</p>
                <h3 className={`text-xl font-semibold sm:text-2xl ${activeIsProject8 ? "combined-word" : ""}`}>{active.name}</h3>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
              <div className={`overflow-hidden rounded-2xl border bg-black/35 sm:rounded-3xl ${activeIsProject8 ? "combined-frame" : ""}`} style={{ borderColor: activeIsProject8 ? "rgba(255,255,255,.28)" : `${active.color}55`, boxShadow: activeIsProject8 ? "0 0 45px rgba(239,68,68,.14), 0 0 70px rgba(59,130,246,.12)" : `0 0 45px ${active.color}18` }}>
                <div className="h-[230px] sm:h-[255px]">
                  {showLivePreviewCanvases ? (
                    <OrbConstellation count={active.id} color={active.color} accent={active.accent} active label={active.name} palette={activePalette} />
                  ) : (
                    <MobileOrbPreview count={active.id} color={active.color} accent={active.accent} active label={active.name} palette={activePalette} />
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm leading-7 text-white/62">{active.purpose}</p>
                <div className="mt-4 rounded-3xl border border-white/10 bg-black/25 p-4">
                  <p className="mb-2 font-semibold" style={{ color: active.accent }}>Workflow value</p>
                  <p className="text-sm leading-6 text-white/58">{active.workflowValue}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <a href={active.live} target="_blank" rel="noreferrer" className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm text-white transition hover:scale-[1.02] sm:w-auto ${activeIsProject8 ? "combined-chip" : ""}`} style={{ borderColor: `${active.color}66`, backgroundColor: `${active.color}18`, boxShadow: `0 0 28px ${active.color}18` }}>
                    Open Live Demo <ExternalLink className="h-4 w-4" />
                  </a>

                  {active.github && (
                    <a href={active.github} target="_blank" rel="noreferrer" className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[.06] px-4 py-3 text-sm text-white transition hover:bg-white/[.1] sm:w-auto ${activeIsProject8 ? "combined-chip" : ""}`}>
                      GitHub <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {active.proves.map((item, index) => (
                <div key={item} className="rounded-3xl border border-white/10 bg-black/25 p-4">
                  <p className={`font-semibold ${activeIsProject8 ? "combined-word subtle" : ""}`} style={{ color: active.accent }}>{item}</p>
                  <p className="mt-2 text-sm leading-6 text-white/50">{active.proofDetails[index]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>

      <ProjectModal item={openProject} onClose={() => setOpenProject(null)} />
    </main>
  );
}
