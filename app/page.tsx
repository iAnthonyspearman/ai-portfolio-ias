"use client";

import { useMemo, useRef, useState, type CSSProperties } from "react";
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
    status: "Autonomous Layer",
    live: "https://ai-autonomous-ops-ias.vercel.app/",
    github: "https://github.com/iAnthonyspearman/ai-operations-intel-ias",
  },
];

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
          emissiveIntensity={active ? 0.48 : 0.22}
          metalness={0.84}
          roughness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
        />
      </mesh>

      <mesh scale={1.52}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.13 : 0.06} />
      </mesh>

      <mesh ref={ring} rotation={[1.2 + anchor.tilt, 0.34, 0.6 - anchor.tilt * 0.5]}>
        <torusGeometry args={[0.255, 0.008, 16, 90]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={active ? 1.2 : 0.45} />
      </mesh>

      <mesh position={[-0.07, 0.08, 0.13]} scale={0.34}>
        <sphereGeometry args={[0.08, 20, 20]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.82} transparent opacity={0.82} />
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
}: {
  count: number;
  color: string;
  accent: string;
  active: boolean;
  label: string;
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
    const lateralSpread = Math.min(1.5, 0.66 + count * 0.095);
    const verticalSpread = Math.min(1.12, 0.58 + count * 0.065);
    const depthSpread = Math.min(1.08, 0.34 + count * 0.08);

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
        scale,
        orbit: 0.035 + (index % 4) * 0.011,
        speed: 0.46 + (index % 5) * 0.075,
        phase: index * 0.91 + count * 0.21,
        tilt: Math.sin(index * 1.23) * 0.42,
      };
    });
  }, [count]);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * (active ? 0.24 : 0.1);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, active ? 0.28 : 0.14, delta);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, active ? -0.08 : -0.035, delta);
  });

  return (
    <Float speed={1.2} rotationIntensity={0.18} floatIntensity={0.52}>
      <group ref={group}>
        {anchors.map((anchor, index) => (
          <Orb
            key={index}
            anchor={anchor}
            color={index % 2 === 0 ? color : accent}
            accent={accent}
            active={active}
          />
        ))}

        {anchors.length > 1 &&
          anchors.map((anchor, index) => {
            const next = anchors[(index + 1) % anchors.length];
            const depthPartner = anchors[(index + 2) % anchors.length];

            return (
              <group key={`link-set-${index}`}>
                <ConstellationLink start={anchor} end={next} accent={accent} active={active} />
                {anchors.length > 3 && index % 2 === 0 && (
                  <ConstellationLink
                    start={anchor}
                    end={depthPartner}
                    accent={accent}
                    active={active}
                    secondary
                  />
                )}
              </group>
            );
          })}

        <Text
          position={[0, -1.45, 0]}
          fontSize={0.13}
          color="#cbd5e1"
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
}: {
  count: number;
  color: string;
  accent: string;
  active: boolean;
  label: string;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4.2], fov: 42 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#050711"]} />
      <ambientLight intensity={0.26} />
      <directionalLight position={[-3.5, 4.4, 4.5]} intensity={2.25} />
      <pointLight position={[2.4, 2.2, 2.6]} intensity={2.2} color={color} />
      <pointLight position={[-2.2, -1.6, 2]} intensity={1.1} color={accent} />
      <Environment preset="city" />
      <Stars radius={35} depth={16} count={280} factor={2.4} fade speed={0.2} />
      <DreiSparkles count={count * 5} scale={[2.4, 1.8, 1]} size={1.4} speed={0.14} color={accent} />

      <OrbConstellationCore
        count={count}
        color={color}
        accent={accent}
        active={active}
        label={label}
      />

      <EffectComposer>


        <Bloom intensity={0.55} luminanceThreshold={0.18} luminanceSmoothing={0.35} />


        <Noise opacity={0.018} />


        <Vignette eskil={false} offset={0.18} darkness={0.62} />


      </EffectComposer>


      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={active ? 0.45 : 0.22} />
    </Canvas>
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
          emissiveIntensity={selected ? 2.2 : 0.75}
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
          opacity={selected ? 0.32 : 0.14}
        />
      </mesh>

      <mesh rotation={[1.2, 0.35, 0.6]}>
        <torusGeometry args={[0.18, 0.009, 16, 90]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={selected ? accent : color}
          emissiveIntensity={selected ? 2.2 : 0.85}
          transparent
          opacity={selected ? 0.9 : 0.48}
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
}: {
  curve: THREE.CatmullRomCurve3;
  targetT: number | null;
  accent: string;
  color: string;
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
}: {
  color: string;
  accent: string;
}) {
  const group = useRef<THREE.Group>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const count = 42;

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
        <meshBasicMaterial color={accent} transparent opacity={0.16} />
      </mesh>

      <mesh>
        <tubeGeometry args={[centerPath, 240, 0.018, 16, false]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={accent}
          emissiveIntensity={1.25}
          transparent
          opacity={0.38}
        />
      </mesh>

      {/* Main DNA rails */}
      <mesh>
        <tubeGeometry args={[new THREE.CatmullRomCurve3(left), 240, 0.04, 18, false]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.78}
          metalness={0.92}
          roughness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.06}
        />
      </mesh>

      <mesh>
        <tubeGeometry args={[new THREE.CatmullRomCurve3(right), 240, 0.04, 18, false]} />
        <meshPhysicalMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.72}
          metalness={0.9}
          roughness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.06}
        />
      </mesh>

      <MovingPowerLight curve={centerPath} targetT={selectedT} accent={accent} color={color} />

      {left.map((point, index) => {
        const rightPoint = right[index];
        const node = index % 3 === 0;
        const selected = selectedIndex === index;
        const mid = point.clone().lerp(rightPoint, 0.5);
        const rungCurve = new THREE.CatmullRomCurve3([point, mid, rightPoint]);

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
                color={selected ? "#ffffff" : node ? accent : "#64748b"}
                emissive={selected ? accent : node ? accent : "#64748b"}
                emissiveIntensity={selected ? 2.4 : node ? 0.72 : 0.12}
                metalness={0.55}
                roughness={0.16}
                transparent
                opacity={selected ? 1 : node ? 0.76 : 0.22}
              />
            </mesh>

            {selected && (
              <mesh position={mid.toArray() as [number, number, number]} scale={2.4}>
                <sphereGeometry args={[0.13, 32, 32]} />
                <meshBasicMaterial color={accent} transparent opacity={0.18} />
              </mesh>
            )}

            {node && (
              <>
                <PowerNode
                  position={point.toArray() as [number, number, number]}
                  color={color}
                  accent={accent}
                  index={index}
                  selected={selected}
                  onSelect={() => setSelectedIndex(index)}
                />
                <PowerNode
                  position={rightPoint.toArray() as [number, number, number]}
                  color={accent}
                  accent={color}
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
}: {
  color: string;
  accent: string;
}) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5.1], fov: 39 }}>
      <color attach="background" args={["#050711"]} />
      <ambientLight intensity={0.26} />
      <directionalLight position={[-3.5, 4.4, 4.5]} intensity={2.25} />
      <pointLight position={[2.7, 2.4, 2.7]} intensity={2.65} color={color} />
      <pointLight position={[-2.4, -1.8, 2.2]} intensity={1.75} color={accent} />
      <Environment preset="city" />
      <Stars radius={42} depth={18} count={420} factor={3} fade speed={0.22} />
      <DreiSparkles count={42} scale={[2.8, 3.4, 1.6]} size={1.9} speed={0.18} color={accent} />
      <Float speed={1.25} rotationIntensity={0.24} floatIntensity={0.7}>
        <PortfolioDnaHelix color={color} accent={accent} />
      </Float>
      <EffectComposer>

        <Bloom intensity={0.55} luminanceThreshold={0.18} luminanceSmoothing={0.35} />

        <Noise opacity={0.018} />

        <Vignette eskil={false} offset={0.18} darkness={0.62} />

      </EffectComposer>

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.35} />
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
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 px-5 py-8 backdrop-blur-xl"
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
            className="modal-shell glass-panel w-full max-w-6xl rounded-[2rem] p-6"
            style={{ borderColor: `${item.color}66`, boxShadow: `0 0 90px ${item.color}22, 0 40px 140px rgba(0,0,0,.65)` }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em]" style={{ color: item.accent }}>
                  {item.status}
                </p>
                <h3 id="project-modal-title" className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">{item.name}</h3>
                <p className="mt-3 text-sm text-white/45">{item.folder}</p>
              </div>

              <button
                type="button"
                aria-label="Close project details"
                onClick={onClose}
                className="rounded-2xl border border-white/10 bg-white/[.06] p-3 text-white/65 transition hover:bg-white/[.12] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
              <div className="modal-dna h-[420px] overflow-hidden rounded-[1.7rem] border border-white/10 bg-black/35">
                <PortfolioDnaScene color={item.color} accent={item.accent} />
              </div>

              <div className="space-y-4">
                {[
                  ["What it is", item.purpose],
                  ["Real business use", item.businessUse],
                  ["Workflow value", item.workflowValue],
                ].map(([title, body]) => (
                  <div key={title} className="rounded-3xl border border-white/10 bg-black/25 p-5">
                    <p className="mb-2 font-semibold" style={{ color: item.accent }}>{title}</p>
                    <p className="text-sm leading-7 text-white/62">{body}</p>
                  </div>
                ))}

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
                    <p className="mb-3 font-semibold" style={{ color: item.accent }}>Industries</p>
                    <div className="flex flex-wrap gap-2">
                      {item.industries.map((industry) => (
                        <span key={industry} className="rounded-full border border-white/10 bg-white/[.05] px-3 py-1 text-xs text-white/65">
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
                    <p className="mb-3 font-semibold" style={{ color: item.accent }}>Proves</p>
                    <div className="flex flex-wrap gap-2">
                      {item.proves.map((proof) => (
                        <span key={proof} className="rounded-full border border-white/10 bg-white/[.05] px-3 py-1 text-xs text-white/65">
                          {proof}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a href={item.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[.06] px-4 py-3 text-sm text-white transition hover:bg-white/[.1]">
                    Open Live Demo <ExternalLink className="h-4 w-4" />
                  </a>
                  {item.github && (
                    <a href={item.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[.06] px-4 py-3 text-sm text-white transition hover:bg-white/[.1]">
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
  const active = portfolioItems.find((item) => item.id === activeId) ?? portfolioItems[7];

  return (
    <main className="portfolio-cosmos min-h-screen overflow-hidden bg-[#050711] text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(239,68,68,.16),transparent_28%),radial-gradient(circle_at_40%_8%,rgba(234,179,8,.12),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(139,92,246,.14),transparent_32%),radial-gradient(circle_at_50%_92%,rgba(20,184,166,.12),transparent_32%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />
      </div>

      <section className="relative z-10 mx-auto flex max-w-7xl flex-col gap-7 px-5 py-6 lg:px-8">
        <nav className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-3xl px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <Command className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/50">AI Career Portfolio</p>
              <h1 className="text-lg font-semibold tracking-tight">Intelligence Automation Systems</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] px-4 py-2 text-sm text-white/60">
            <Sparkles className="h-4 w-4 text-pink-200" />
            Projects 1–8 • Enterprise AI Systems
          </div>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
          <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-[2rem] p-6 md:p-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.06] px-4 py-2 text-sm text-white/70">
              <Globe2 className="h-4 w-4 text-emerald-200" />
              Enterprise AI systems portfolio
            </div>

            <h2 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
              Eight AI systems. One evolving intelligence architecture.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/62">
              This portfolio shows a progression from AI deployment and workflow automation to enterprise orchestration
              and autonomous operations. Each system represents a real business use case, technical skill, and step toward
              enterprise-grade AI Solutions Engineering.
            </p>

            <div className="mt-8 grid gap-3 md:grid-cols-4">
              {[
                ["8", "Active systems"],
                ["3D", "Interactive visuals"],
                ["AI", "Operational logic"],
                ["Vercel", "Live deployment"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-black/25 p-4">
                  <p className="text-3xl font-semibold">{value}</p>
                  <p className="mt-1 text-sm text-white/45">{label}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="glass-panel selected-system-panel overflow-hidden rounded-[2rem] p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">Selected System</p>
                <h3 className="text-2xl font-semibold">{active.name}</h3>
              </div>
              <Layers3 className="h-6 w-6" style={{ color: active.accent }} />
            </div>

            <div className="h-[390px] overflow-hidden rounded-3xl border border-white/10 bg-black/35">
              <OrbConstellation count={active.id} color={active.color} accent={active.accent} active label={active.name} />
            </div>
          </motion.section>
        </div>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {portfolioItems.map((item) => {
            const Icon = iconFor(item.id);
            const selected = activeId === item.id;

            return (
              <motion.button
                type="button"
                aria-label={`Open ${item.name} details`}
                key={item.id}
                whileHover={{ y: -6, scale: 1.015 }}
                onClick={() => {
                  setActiveId(item.id);
                  setOpenProject(item);
                }}
                className={`glass-panel project-card group rounded-[2rem] p-5 text-left transition ${selected ? "ring-1 ring-white/30" : ""}`}
                style={
                  {
                    "--project-color": item.color,
                    "--project-accent": item.accent,
                    borderColor: selected ? `${item.color}aa` : `${item.color}44`,
                    boxShadow: selected
                      ? `0 0 38px ${item.color}44, 0 0 90px ${item.color}24, 0 30px 100px rgba(0,0,0,.58)`
                      : `0 0 28px ${item.color}16, 0 24px 80px rgba(0,0,0,.44)`,
                  } as CSSProperties
                }
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: `${item.color}25` }}>
                    <Icon className="h-5 w-5" style={{ color: item.accent }} />
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/50">{item.status}</span>
                </div>

                <div className="h-[180px] overflow-hidden rounded-3xl border border-white/10 bg-black/35">
                  <OrbConstellation count={item.id} color={item.color} accent={item.accent} active={selected} label={`${item.id}`} />
                </div>

                <h3 className="mt-5 text-xl font-semibold" style={{ color: item.accent, textShadow: `0 0 16px ${item.color}77` }}>
                  {item.name}
                </h3>
                <p className="mt-2 text-xs text-white/35">{item.folder}</p>
                <p className="mt-4 text-sm leading-6 text-white/58">{item.purpose}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {item.proves.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-white/[.04] px-3 py-1 text-xs text-white/50">{tag}</span>
                  ))}
                </div>
              </motion.button>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
          <div className="glass-panel rounded-[2rem] p-6">
            <div className="mb-5 flex items-center gap-3">
              <Cpu className="h-6 w-6 text-emerald-200" />
              <div>
                <p className="text-sm text-white/50">Portfolio Maturity Path</p>
                <h3 className="text-2xl font-semibold">From deployment to autonomous operations</h3>
              </div>
            </div>

            <div className="space-y-3">
              {portfolioItems.map((item) => (
                <motion.button
                  type="button"
                  aria-pressed={activeId === item.id}
                  aria-label={`Select ${item.name}`}
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  whileTap={{ scale: 0.985 }}
                  className="maturity-path-button group flex w-full items-center gap-4 rounded-3xl border bg-black/25 p-4 text-left transition"
                  style={{
                    borderColor: `${item.color}55`,
                    boxShadow: activeId === item.id ? `0 0 36px ${item.color}33, inset 0 0 24px ${item.color}11` : `0 0 24px ${item.color}18`,
                  }}
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-2xl font-semibold"
                    style={{ backgroundColor: `${item.color}25`, color: item.accent, boxShadow: `0 0 18px ${item.color}30` }}
                  >
                    {item.id}
                  </span>
                  <div className="flex-1">
                    <p
                      className="font-semibold tracking-tight transition"
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
                    <p className="text-sm text-white/45">{item.status}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" style={{ color: item.accent, filter: `drop-shadow(0 0 8px ${item.color})` }} />
                  <span className="maturity-wave" style={{ background: `linear-gradient(120deg, transparent, ${item.color}55, ${item.accent}44, transparent)` }} />
                </motion.button>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-6">
            <div className="mb-5 flex items-center gap-3">
              <Building2 className="h-6 w-6" style={{ color: active.accent }} />
              <div>
                <p className="text-sm text-white/50">Real-World Value</p>
                <h3 className="text-2xl font-semibold">{active.name}</h3>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
              <div className="overflow-hidden rounded-3xl border bg-black/35" style={{ borderColor: `${active.color}55`, boxShadow: `0 0 45px ${active.color}18` }}>
                <div className="h-[255px]">
                  <OrbConstellation count={active.id} color={active.color} accent={active.accent} active label={active.name} />
                </div>
              </div>

              <div>
                <p className="text-sm leading-7 text-white/62">{active.purpose}</p>
                <div className="mt-4 rounded-3xl border border-white/10 bg-black/25 p-4">
                  <p className="mb-2 font-semibold" style={{ color: active.accent }}>Workflow value</p>
                  <p className="text-sm leading-6 text-white/58">{active.workflowValue}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <a href={active.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm text-white transition hover:scale-[1.02]" style={{ borderColor: `${active.color}66`, backgroundColor: `${active.color}18`, boxShadow: `0 0 28px ${active.color}18` }}>
                    Open Live Demo <ExternalLink className="h-4 w-4" />
                  </a>

                  {active.github && (
                    <a href={active.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[.06] px-4 py-3 text-sm text-white transition hover:bg-white/[.1]">
                      GitHub <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {active.proves.map((item) => (
                <div key={item} className="rounded-3xl border border-white/10 bg-black/25 p-4">
                  <p className="font-semibold" style={{ color: active.accent }}>{item}</p>
                  <p className="mt-2 text-sm leading-6 text-white/50">Demonstrates practical thinking for real enterprise AI work.</p>
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
