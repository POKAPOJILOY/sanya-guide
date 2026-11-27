"use client";

import { createContext, memo, useContext, useEffect, useMemo, type ComponentProps } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Line, RoundedBox } from "@react-three/drei";
import { CanvasTexture, ExtrudeGeometry, Path, RepeatWrapping, Shape, SRGBColorSpace } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { PerspectiveCamera } from "three";

const colors = {
  milk: "#FFFBF3",
  butter: "#EAC778",
  butterSoft: "#FFF0CF",
  gold: "#B78358",
  choco: "#54362F",
  pink: "#EFB3C5",
  pastel: "#FBD6E1",
  sky: "#8FBFD6",
  skySoft: "#E2F0F4",
  pistachio: "#A9C494",
  pistachioSoft: "#EBF3E0",
  white: "#FFF9ED",
  screen: "#52646B",
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const ease = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

// Два bevel-прохода достаточно для игрушечной мягкости и заметно легче восьми по умолчанию.
function SoftBox(props: ComponentProps<typeof RoundedBox>) {
  return <RoundedBox {...props} bevelSegments={2} smoothness={2} />;
}

// У этой геометрии размеры не раздуваются фаской — важно для корпуса и плоских деталей чемодана.
function TrueSoftBox({
  args,
  radius = 0.12,
  children,
  ...props
}: Omit<ComponentProps<"mesh">, "args"> & { args: [number, number, number]; radius?: number }) {
  const [width, height, depth] = args;
  const geometry = useMemo(
    () => new RoundedBoxGeometry(width, height, depth, 3, radius),
    [width, height, depth, radius]
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh {...props}>
      <primitive object={geometry} attach="geometry" />
      {children}
    </mesh>
  );
}

function roundedRectangle(path: Shape | Path, width: number, depth: number, radius: number) {
  const x = -width / 2;
  const y = -depth / 2;
  path.moveTo(x + radius, y);
  path.lineTo(x + width - radius, y);
  path.quadraticCurveTo(x + width, y, x + width, y + radius);
  path.lineTo(x + width, y + depth - radius);
  path.quadraticCurveTo(x + width, y + depth, x + width - radius, y + depth);
  path.lineTo(x + radius, y + depth);
  path.quadraticCurveTo(x, y + depth, x, y + depth - radius);
  path.lineTo(x, y + radius);
  path.quadraticCurveTo(x, y, x + radius, y);
  path.closePath();
}

// Цельные круговые стенки с отверстием: внутри действительно есть полость, а не панель на корпусе.
function HollowTray({
  width,
  depth,
  height,
  cornerRadius,
  wall,
  bevel = 0.03,
  children,
  ...props
}: Omit<ComponentProps<"mesh">, "args"> & {
  width: number;
  depth: number;
  height: number;
  cornerRadius: number;
  wall: number;
  bevel?: number;
}) {
  const geometry = useMemo(() => {
    const shape = new Shape();
    roundedRectangle(shape, width, depth, cornerRadius);
    const hole = new Path();
    roundedRectangle(hole, width - wall * 2, depth - wall * 2, Math.max(0.03, cornerRadius - wall));
    shape.holes.push(hole);
    const result = new ExtrudeGeometry(shape, {
      depth: height - bevel * 2,
      steps: 1,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: bevel,
      bevelThickness: bevel,
      curveSegments: 5,
    });
    result.rotateX(-Math.PI / 2);
    result.translate(0, bevel, 0);
    return result;
  }, [width, depth, height, cornerRadius, wall, bevel]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh {...props}>
      <primitive object={geometry} attach="geometry" />
      {children}
    </mesh>
  );
}

const FabricContext = createContext<CanvasTexture | null>(null);

// Маленькая процедурная фактура: переплетение нитей без внешних картинок и случайного шума.
function makeFabricTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const image = context.createImageData(64, 64);
  for (let y = 0; y < 64; y += 1) {
    for (let x = 0; x < 64; x += 1) {
      const weave = ((x % 4 === 0 ? 20 : 0) + (y % 4 === 0 ? 16 : 0));
      const fiber = ((x * 17 + y * 29 + (x * y) % 23) % 19) - 9;
      const value = Math.max(0, Math.min(255, 128 + weave + fiber));
      const offset = (y * 64 + x) * 4;
      image.data[offset] = value;
      image.data[offset + 1] = value;
      image.data[offset + 2] = value;
      image.data[offset + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.needsUpdate = true;
  return texture;
}

function makeGraphicTexture(width: number, height: number, draw: (context: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (context) draw(context);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function FabricMaterial({ color, roughness = 0.94, bumpScale = 0.022 }: { color: string; roughness?: number; bumpScale?: number }) {
  const fabric = useContext(FabricContext);
  return <meshStandardMaterial color={color} roughness={roughness} bumpMap={fabric ?? undefined} bumpScale={bumpScale} />;
}

type StitchPoint = [number, number, number];

function StitchLine({ points, color = colors.gold, width = 1.25 }: { points: StitchPoint[]; color?: string; width?: number }) {
  return <Line points={points} color={color} lineWidth={width} dashed dashSize={0.065} gapSize={0.05} transparent opacity={0.72} />;
}

function StitchRectangle({
  width,
  height,
  position,
  color,
}: {
  width: number;
  height: number;
  position: StitchPoint;
  color?: string;
}) {
  const x = width / 2;
  const y = height / 2;
  return (
    <group position={position}>
      <StitchLine
        points={[[-x, -y, 0], [x, -y, 0], [x, y, 0], [-x, y, 0], [-x, -y, 0]]}
        color={color}
      />
    </group>
  );
}

function Buckle({ position }: { position: StitchPoint }) {
  return (
    <group position={position}>
      <TrueSoftBox args={[0.22, 0.24, 0.045]} radius={0.022}>
        <FabricMaterial color={colors.choco} bumpScale={0.012} />
      </TrueSoftBox>
      <TrueSoftBox args={[0.1, 0.12, 0.05]} radius={0.02} position={[0, 0, 0.014]}>
        <FabricMaterial color={colors.butter} />
      </TrueSoftBox>
      <TrueSoftBox args={[0.018, 0.15, 0.018]} radius={0.007} position={[0, 0, 0.043]}>
        <meshStandardMaterial color={colors.gold} roughness={0.9} />
      </TrueSoftBox>
    </group>
  );
}

// Контакт нужен неподвижному чемодану и цветам; летящие предметы не требуют пересчёта тени.
const GroundShadows = memo(function GroundShadows() {
  return (
    <ContactShadows
      position={[0, 0.015, 0]}
      opacity={0.2}
      scale={15}
      blur={2.4}
      far={6}
      resolution={256}
      smooth={false}
      frames={1}
    />
  );
});

function CameraRig() {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const compact = size.width < 768;
    const perspective = camera as PerspectiveCamera;
    perspective.position.set(0, compact ? 4.6 : 4.8, compact ? 11.8 : 8.6);
    perspective.fov = compact ? 36 : 35;
    perspective.near = 0.1;
    perspective.far = 60;
    perspective.lookAt(0, 1.45, 0);
    perspective.updateProjectionMatrix();
    // В demand-режиме изменение камеры напрямую само новый кадр не запрашивает.
    invalidate();
  }, [camera, size.width, invalidate]);

  return null;
}

function SceneMetrics() {
  useFrame(({ gl }) => {
    const section = document.getElementById("road-transition");
    if (!section) return;
    section.dataset.sceneRendered = "true";
    section.dataset.drawCalls = String(gl.info.render.calls);
    section.dataset.triangles = String(gl.info.render.triangles);
  });
  return null;
}

function Phone() {
  return (
    <group rotation={[0, 0, -0.035]}>
      <SoftBox args={[0.94, 1.58, 0.2]} radius={0.16} castShadow>
        <FabricMaterial color={colors.white} />
      </SoftBox>
      <SoftBox args={[0.79, 1.28, 0.045]} radius={0.1} position={[0, 0.045, 0.12]}>
        <FabricMaterial color={colors.screen} roughness={0.78} bumpScale={0.008} />
      </SoftBox>
      <StitchRectangle width={0.83} height={1.45} position={[0, 0, 0.115]} color={colors.pastel} />
      <SoftBox args={[0.24, 0.035, 0.025]} radius={0.015} position={[0, 0.665, 0.15]}>
        <meshStandardMaterial color={colors.choco} roughness={0.9} />
      </SoftBox>
      <mesh position={[0, -0.67, 0.15]}>
        <circleGeometry args={[0.065, 20]} />
        <meshStandardMaterial color={colors.gold} roughness={0.9} />
      </mesh>
      {[0, 1, 2].map((index) => (
        <SoftBox
          key={index}
          args={[0.48 - index * 0.07, 0.045, 0.018]}
          radius={0.018}
          position={[-0.04, 0.29 - index * 0.25, 0.153]}
        >
          <meshStandardMaterial color={index === 1 ? colors.pink : colors.skySoft} roughness={0.95} />
        </SoftBox>
      ))}
      <SoftBox args={[0.045, 0.24, 0.09]} radius={0.02} position={[0.49, 0.28, 0]}>
        <FabricMaterial color={colors.pink} />
      </SoftBox>
      <SoftBox args={[0.045, 0.14, 0.09]} radius={0.02} position={[0.49, -0.02, 0]}>
        <FabricMaterial color={colors.gold} />
      </SoftBox>
      {[0, 1, 2].map((dot) => (
        <mesh key={dot} position={[-0.25 + dot * 0.08, 0.54, 0.158]}>
          <circleGeometry args={[0.018, 12]} />
          <meshStandardMaterial color={dot === 1 ? colors.pink : colors.skySoft} roughness={0.9} />
        </mesh>
      ))}
      <SoftBox args={[0.16, 0.1, 0.018]} radius={0.035} position={[0.19, -0.42, 0.155]}>
        <FabricMaterial color={colors.pistachio} bumpScale={0.006} />
      </SoftBox>
    </group>
  );
}

function drawAirplane(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  rotation = 0
) {
  context.save();
  context.translate(x, y);
  context.rotate(rotation);
  context.scale(size, size);
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(0, -1);
  context.lineTo(0.14, -0.28);
  context.lineTo(0.82, 0.12);
  context.lineTo(0.82, 0.3);
  context.lineTo(0.14, 0.1);
  context.lineTo(0.1, 0.6);
  context.lineTo(0.36, 0.82);
  context.lineTo(0.36, 0.95);
  context.lineTo(0, 0.8);
  context.lineTo(-0.36, 0.95);
  context.lineTo(-0.36, 0.82);
  context.lineTo(-0.1, 0.6);
  context.lineTo(-0.14, 0.1);
  context.lineTo(-0.82, 0.3);
  context.lineTo(-0.82, 0.12);
  context.lineTo(-0.14, -0.28);
  context.closePath();
  context.fill();
  context.restore();
}

function Ticket() {
  const texture = useMemo(
    () =>
      makeGraphicTexture(1200, 680, (context) => {
        context.fillStyle = colors.white;
        context.fillRect(0, 0, 1200, 680);

        // Отрывной корешок и крупный авиационный знак считываются даже на маленьком предмете.
        context.fillStyle = "#7399A7";
        context.fillRect(0, 0, 260, 680);
        drawAirplane(context, 130, 205, 82, colors.white, -0.18);
        context.textAlign = "center";
        context.fillStyle = colors.white;
        context.font = "700 66px Arial, sans-serif";
        context.fillText("SYX", 130, 390);
        context.font = "700 28px Arial, sans-serif";
        context.fillText("САНЬЯ", 130, 440);
        context.save();
        context.translate(92, 608);
        context.rotate(-Math.PI / 2);
        context.textAlign = "left";
        context.font = "700 27px Arial, sans-serif";
        context.fillText("BAO AIR · BOARDING PASS", 0, 0);
        context.restore();

        context.strokeStyle = colors.gold;
        context.lineWidth = 4;
        context.setLineDash([14, 14]);
        context.beginPath();
        context.moveTo(260, 24);
        context.lineTo(260, 656);
        context.stroke();
        context.setLineDash([]);

        context.textAlign = "left";
        context.fillStyle = colors.choco;
        context.font = "700 30px Arial, sans-serif";
        context.fillText("BAO AIR", 330, 76);
        context.fillStyle = colors.gold;
        context.font = "700 24px Arial, sans-serif";
        context.fillText("ПОСАДОЧНЫЙ ТАЛОН", 330, 116);

        context.fillStyle = colors.choco;
        context.font = "700 94px Arial, sans-serif";
        context.fillText("САНЬЯ", 326, 258);
        context.fillStyle = "#7399A7";
        context.font = "700 42px Arial, sans-serif";
        context.fillText("ХАЙНАНЬ · КИТАЙ", 332, 320);

        context.textAlign = "right";
        context.fillStyle = colors.pink;
        context.font = "700 112px Arial, sans-serif";
        context.fillText("SYX", 1100, 262);
        drawAirplane(context, 920, 318, 38, colors.choco, Math.PI / 2);

        context.strokeStyle = colors.pastel;
        context.lineWidth = 5;
        context.beginPath();
        context.moveTo(330, 372);
        context.lineTo(1100, 372);
        context.stroke();

        context.textAlign = "left";
        context.fillStyle = colors.gold;
        context.font = "700 20px Arial, sans-serif";
        context.fillText("ПАССАЖИР", 330, 424);
        context.fillText("РЕЙС", 630, 424);
        context.fillStyle = colors.choco;
        context.font = "700 32px Arial, sans-serif";
        context.fillText("SABINA", 330, 468);
        context.fillText("BAO 1990", 630, 468);

        // Детерминированный штрихкод, без случайного рисунка при перерендере.
        let barX = 922;
        for (let index = 0; index < 22; index += 1) {
          const barWidth = index % 3 === 0 ? 7 : index % 2 === 0 ? 4 : 2;
          context.fillStyle = colors.choco;
          context.fillRect(barX, 412, barWidth, 104 + (index % 4) * 9);
          barX += barWidth + (index % 2 === 0 ? 5 : 4);
        }
        context.fillStyle = colors.gold;
        context.font = "700 18px Arial, sans-serif";
        context.fillText("ДОСТУП НАВСЕГДА", 330, 590);
        context.fillStyle = colors.pink;
        context.beginPath();
        context.arc(1080, 584, 25, 0, Math.PI * 2);
        context.fill();
      }),
    []
  );
  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <group rotation={[0, 0, 0.025]}>
      <TrueSoftBox args={[1.82, 1.02, 0.09]} radius={0.04} castShadow>
        <FabricMaterial color={colors.white} bumpScale={0.01} />
      </TrueSoftBox>
      <mesh position={[0, 0, 0.051]}>
        <planeGeometry args={[1.76, 0.96]} />
        <meshStandardMaterial map={texture} roughness={0.96} />
      </mesh>
    </group>
  );
}

function CameraObject() {
  return (
    <group rotation={[0, 0, -0.025]}>
      <SoftBox args={[1.42, 0.94, 0.56]} radius={0.21} castShadow>
        <FabricMaterial color={colors.white} />
      </SoftBox>
      <StitchRectangle width={1.22} height={0.74} position={[0, 0, 0.288]} color={colors.pastel} />
      <SoftBox args={[0.46, 0.2, 0.38]} radius={0.075} position={[-0.28, 0.51, -0.02]}>
        <FabricMaterial color={colors.choco} />
      </SoftBox>
      <mesh position={[0.08, 0, 0.36]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.39, 0.27, 32]} />
        <FabricMaterial color={colors.choco} bumpScale={0.012} />
      </mesh>
      <mesh position={[0.08, 0, 0.5]}>
        <torusGeometry args={[0.23, 0.072, 12, 32]} />
        <FabricMaterial color={colors.butter} bumpScale={0.01} />
      </mesh>
      <mesh position={[0.08, 0, 0.51]}>
        <circleGeometry args={[0.2, 32]} />
        <meshStandardMaterial color="#35454C" roughness={0.72} />
      </mesh>
      <mesh position={[0.02, 0.07, 0.522]}>
        <circleGeometry args={[0.048, 16]} />
        <meshStandardMaterial color="#91AFBB" roughness={0.8} />
      </mesh>
      <mesh position={[-0.46, 0.24, 0.3]}>
        <circleGeometry args={[0.09, 20]} />
        <FabricMaterial color={colors.pink} />
      </mesh>
      <SoftBox args={[0.27, 0.2, 0.08]} radius={0.05} position={[0.43, 0.22, 0.31]}>
        <FabricMaterial color={colors.choco} />
      </SoftBox>
      <SoftBox args={[0.16, 0.1, 0.025]} radius={0.025} position={[0.43, 0.22, 0.36]}>
        <meshStandardMaterial color={colors.sky} roughness={0.72} />
      </SoftBox>
      <SoftBox args={[0.24, 0.13, 0.045]} radius={0.035} position={[-0.45, -0.13, 0.31]}>
        <FabricMaterial color={colors.butterSoft} />
      </SoftBox>
      <mesh position={[0.08, 0, 0.53]}>
        <torusGeometry args={[0.13, 0.018, 8, 28]} />
        <meshStandardMaterial color={colors.skySoft} roughness={0.8} />
      </mesh>
      <mesh position={[-0.31, 0.64, 0]}>
        <cylinderGeometry args={[0.09, 0.1, 0.08, 20]} />
        <FabricMaterial color={colors.gold} />
      </mesh>
      {[-1, 1].map((side) => (
        <SoftBox key={side} args={[0.12, 0.24, 0.16]} radius={0.045} position={[side * 0.7, 0.08, 0]}>
          <FabricMaterial color={colors.gold} />
        </SoftBox>
      ))}
    </group>
  );
}

function Cup() {
  return (
    <group rotation={[0, 0, 0.035]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.33, 0.74, 32]} />
        <FabricMaterial color={colors.white} />
      </mesh>
      <mesh position={[0, 0.36, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.34, 0.055, 10, 32]} />
        <FabricMaterial color={colors.butterSoft} />
      </mesh>
      <mesh position={[0, 0.365, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.025, 32]} />
        <meshStandardMaterial color={colors.choco} roughness={0.96} />
      </mesh>
      <mesh position={[0.44, 0, 0]} rotation={[0, 0, -Math.PI * 0.825]} castShadow>
        <torusGeometry args={[0.25, 0.082, 12, 28, Math.PI * 1.65]} />
        <FabricMaterial color={colors.white} />
      </mesh>
      <mesh position={[0, -0.43, 0]} receiveShadow>
        <cylinderGeometry args={[0.53, 0.5, 0.09, 32]} />
        <FabricMaterial color={colors.pastel} />
      </mesh>
      <mesh position={[0, -0.385, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.43, 0.022, 8, 32]} />
        <FabricMaterial color={colors.pink} />
      </mesh>
      <mesh position={[-0.09, 0.383, 0.04]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.065, 20]} />
        <meshStandardMaterial color={colors.gold} roughness={0.9} />
      </mesh>
      <group position={[0, -0.03, 0.36]}>
        <mesh position={[-0.045, 0.035, 0]} scale={[1, 1, 0.35]}>
          <sphereGeometry args={[0.075, 16, 12]} />
          <FabricMaterial color={colors.pink} />
        </mesh>
        <mesh position={[0.045, 0.035, 0]} scale={[1, 1, 0.35]}>
          <sphereGeometry args={[0.075, 16, 12]} />
          <FabricMaterial color={colors.pink} />
        </mesh>
        <mesh position={[0, -0.055, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.105, 0.16, 3]} />
          <FabricMaterial color={colors.pink} />
        </mesh>
      </group>
    </group>
  );
}

function MapPanel({ panel, texture }: { panel: number; texture: CanvasTexture }) {
  return (
    <group position={[panel * 0.59, 0, panel === 0 ? 0.035 : 0]} rotation={[0, panel * -0.17, 0]}>
      <TrueSoftBox args={[0.62, 1.24, 0.065]} radius={0.03} castShadow>
        <FabricMaterial color={colors.white} bumpScale={0.008} />
      </TrueSoftBox>
      <mesh position={[0, 0, 0.037]}>
        <planeGeometry args={[0.6, 1.2]} />
        <meshStandardMaterial map={texture} roughness={0.97} />
      </mesh>
    </group>
  );
}

function MapObject() {
  const panelTextures = useMemo(() => {
    const master = makeGraphicTexture(1536, 1024, (context) => {
      context.fillStyle = colors.skySoft;
      context.fillRect(0, 0, 1536, 1024);

      // Спокойные морские линии остаются видимыми по краям острова.
      context.strokeStyle = "#B9D8E1";
      context.lineWidth = 7;
      context.lineCap = "round";
      [110, 470, 1310].forEach((x, index) => {
        const y = index === 1 ? 910 : 820 - index * 540;
        context.beginPath();
        context.moveTo(x - 60, y);
        context.quadraticCurveTo(x - 30, y - 18, x, y);
        context.quadraticCurveTo(x + 30, y + 18, x + 60, y);
        context.stroke();
      });

      const island = new Path2D();
      island.moveTo(92, 312);
      island.bezierCurveTo(160, 174, 332, 126, 510, 168);
      island.bezierCurveTo(680, 68, 900, 126, 1000, 250);
      island.bezierCurveTo(1174, 232, 1322, 344, 1278, 484);
      island.bezierCurveTo(1360, 616, 1188, 766, 1030, 730);
      island.bezierCurveTo(878, 900, 650, 852, 556, 742);
      island.bezierCurveTo(350, 790, 162, 680, 192, 540);
      island.bezierCurveTo(54, 486, 22, 388, 92, 312);
      island.closePath();
      context.fillStyle = "#F2DDA6";
      context.fill(island);
      context.lineWidth = 30;
      context.strokeStyle = "#F2DDA6";
      context.stroke(island);
      context.fillStyle = colors.pistachioSoft;
      context.fill(island);
      context.lineWidth = 9;
      context.strokeStyle = colors.pistachio;
      context.stroke(island);

      // Белые дороги и золотые основные трассы объединяют все три панели в одну карту.
      context.lineCap = "round";
      const roads = [
        [210, 390, 520, 300, 910, 380, 1190, 560],
        [310, 650, 510, 530, 760, 560, 1040, 720],
        [530, 210, 580, 410, 580, 590, 660, 770],
      ];
      roads.forEach(([x1, y1, x2, y2, x3, y3, x4, y4]) => {
        context.beginPath();
        context.moveTo(x1, y1);
        context.bezierCurveTo(x2, y2, x3, y3, x4, y4);
        context.strokeStyle = colors.gold;
        context.lineWidth = 21;
        context.stroke();
        context.strokeStyle = colors.white;
        context.lineWidth = 10;
        context.stroke();
      });

      context.fillStyle = colors.choco;
      context.textAlign = "left";
      context.font = "700 64px Arial, sans-serif";
      context.fillText("ХАЙНАНЬ", 260, 280);
      context.fillStyle = colors.gold;
      context.font = "700 25px Arial, sans-serif";
      context.fillText("ОСТРОВ · КИТАЙ", 266, 320);

      // Маршрут — единственный яркий акцент, ведущий к крупному гео-pin.
      context.beginPath();
      context.moveTo(352, 604);
      context.bezierCurveTo(520, 480, 704, 454, 836, 550);
      context.bezierCurveTo(940, 624, 1000, 664, 1110, 632);
      context.strokeStyle = colors.pink;
      context.lineWidth = 16;
      context.setLineDash([30, 24]);
      context.stroke();
      context.setLineDash([]);

      const places = [
        { x: 352, y: 604, label: "ДАДУНХАЙ", dx: -160, dy: 64 },
        { x: 780, y: 520, label: "ЯЛУНЬВАНЬ", dx: -120, dy: -46 },
      ];
      places.forEach((place) => {
        context.fillStyle = colors.white;
        context.beginPath();
        context.arc(place.x, place.y, 18, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = colors.gold;
        context.lineWidth = 7;
        context.stroke();
        context.fillStyle = colors.choco;
        context.font = "700 25px Arial, sans-serif";
        context.fillText(place.label, place.x + place.dx, place.y + place.dy);
      });

      context.fillStyle = colors.choco;
      context.font = "700 78px Arial, sans-serif";
      context.fillText("САНЬЯ", 922, 524);
      context.fillStyle = colors.pink;
      context.beginPath();
      context.arc(1110, 590, 50, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.moveTo(1072, 620);
      context.lineTo(1110, 700);
      context.lineTo(1148, 620);
      context.closePath();
      context.fill();
      context.fillStyle = colors.white;
      context.beginPath();
      context.arc(1110, 590, 20, 0, Math.PI * 2);
      context.fill();

      // Небольшой компас на свободном углу первой панели.
      context.strokeStyle = colors.gold;
      context.lineWidth = 7;
      context.beginPath();
      context.arc(264, 804, 72, 0, Math.PI * 2);
      context.stroke();
      context.fillStyle = colors.pink;
      context.beginPath();
      context.moveTo(264, 730);
      context.lineTo(286, 816);
      context.lineTo(264, 798);
      context.lineTo(242, 816);
      context.closePath();
      context.fill();
      context.fillStyle = colors.choco;
      context.textAlign = "center";
      context.font = "700 30px Arial, sans-serif";
      context.fillText("N", 264, 716);
    });
    const source = master.image as HTMLCanvasElement;
    const textures = [-1, 0, 1].map((panel) =>
      makeGraphicTexture(512, 1024, (context) => {
        context.drawImage(source, (panel + 1) * 512, 0, 512, 1024, 0, 0, 512, 1024);
      })
    );
    master.dispose();
    return textures;
  }, []);
  useEffect(() => () => panelTextures.forEach((texture) => texture.dispose()), [panelTextures]);

  return (
    <group rotation={[0, 0, -0.025]} scale={1.06}>
      {panelTextures.map((texture, index) => (
        <MapPanel key={index} panel={index - 1} texture={texture} />
      ))}
    </group>
  );
}

const objectComponents = [Phone, Ticket, CameraObject, Cup, MapObject];

function arcTarget(index: number, compact: boolean) {
  const angle = Math.PI * (0.84 - index * 0.17);
  return {
    x: Math.cos(angle) * (compact ? 2.35 : 3.25),
    // Низкая широкая дуга оставляет воздух для заголовка и не склеивает соседние предметы.
    y: 1.25 + Math.sin(angle) * 1.25,
    z: -0.35 + (index % 2) * 0.3,
  };
}

function EmergingObject({ index, progress, compact }: { index: number; progress: number; compact: boolean }) {
  // На телефоне предметы следуют друг за другом спокойнее; desktop-тайминги прежние.
  const stagger = compact ? 0.105 : 0.065;
  const duration = compact ? 0.3 : 0.42;
  const local = ease((progress - (0.2 + index * stagger)) / duration);
  const target = arcTarget(index, compact);
  const lift = Math.sin(local * Math.PI) * 0.65;
  const ObjectComponent = objectComponents[index];

  return (
    <group
      visible={local > 0.001}
      position={[target.x * local, 0.86 + (target.y - 0.86) * local + lift, 0.12 + (target.z - 0.12) * local]}
      scale={Math.max(0.001, local)}
      rotation={[-0.06, (1 - local) * (index - 2) * 0.7 - target.x * 0.06, (index - 2) * -0.055 * local]}
    >
      <ObjectComponent />
    </group>
  );
}

function Suitcase({ progress }: { progress: number }) {
  const open = ease(progress / 0.4);

  return (
    <group rotation={[0, -0.28, 0]}>
      {/* Полый корпус: дно и круговые стенки, без сплошной панели поверх чемодана. */}
      <TrueSoftBox args={[2.92, 0.22, 1.68]} radius={0.11} position={[0, 0.31, 0]} castShadow receiveShadow>
        <FabricMaterial color={colors.butter} bumpScale={0.03} />
      </TrueSoftBox>
      <HollowTray
        width={2.92}
        depth={1.68}
        height={0.72}
        cornerRadius={0.22}
        wall={0.15}
        position={[0, 0.28, 0]}
        castShadow
        receiveShadow
      >
        <FabricMaterial color={colors.butter} bumpScale={0.03} />
      </HollowTray>
      <TrueSoftBox args={[2.56, 0.035, 1.32]} radius={0.017} position={[0, 0.46, 0]} receiveShadow>
        <FabricMaterial color={colors.butterSoft} bumpScale={0.022} />
      </TrueSoftBox>
      <StitchRectangle width={2.56} height={0.5} position={[0, 0.6, 0.877]} color={colors.butterSoft} />

      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.86, 1, -0.78]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.32, 16]} />
          <FabricMaterial color={colors.gold} bumpScale={0.012} />
        </mesh>
      ))}

      {/* Крышка — неглубокий лоток с утопленной подкладкой, а не второй брусок. */}
      <group position={[0, 1, -0.78]} rotation={[-open * 1.9, 0, 0]}>
        <group position={[0, 0, 0.78]}>
          <HollowTray width={2.92} depth={1.68} height={0.19} cornerRadius={0.22} wall={0.15} bevel={0.025} castShadow>
            <FabricMaterial color={colors.butter} bumpScale={0.03} />
          </HollowTray>
          <TrueSoftBox args={[2.92, 0.1, 1.68]} radius={0.05} position={[0, 0.2, 0]} castShadow>
            <FabricMaterial color={colors.butter} bumpScale={0.03} />
          </TrueSoftBox>
          <TrueSoftBox args={[2.56, 0.025, 1.32]} radius={0.012} position={[0, 0.14, 0]}>
            <FabricMaterial color={colors.butterSoft} bumpScale={0.022} />
          </TrueSoftBox>
          <group position={[0, 0.119, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <StitchRectangle width={2.38} height={1.14} position={[0, 0, 0]} color={colors.gold} />
          </group>
        </group>
      </group>

      {[-1, 1].map((side) => (
        <group key={side}>
          <TrueSoftBox args={[0.34, 0.52, 0.05]} radius={0.024} position={[side * 1.26, 0.58, 0.88]}>
            <FabricMaterial color={colors.gold} bumpScale={0.018} />
          </TrueSoftBox>
          {[0.4, 0.76].map((height) => (
            <mesh key={height} position={[side * 1.26, height, 0.911]}>
              <circleGeometry args={[0.025, 12]} />
              <meshStandardMaterial color={colors.butterSoft} roughness={0.9} />
            </mesh>
          ))}

          <TrueSoftBox args={[0.13, 0.62, 0.025]} radius={0.01} position={[side * 0.89, 0.61, 0.88]}>
            <FabricMaterial color={colors.gold} bumpScale={0.014} />
          </TrueSoftBox>
          <Buckle position={[side * 0.89, 0.62, 0.916]} />

          {[-1, 1].map((depth) => (
            <mesh key={depth} position={[side * 1.18, 0.14, depth * 0.65]} scale={[1, 0.55, 1]}>
              <sphereGeometry args={[0.14, 16, 10]} />
              <FabricMaterial color={colors.choco} bumpScale={0.018} />
            </mesh>
          ))}
        </group>
      ))}

      {[-1, 1].map((side) => (
        <TrueSoftBox key={side} args={[0.18, 0.2, 0.12]} radius={0.04} position={[side * 0.43, 0.62, 0.94]}>
          <FabricMaterial color={colors.gold} bumpScale={0.014} />
        </TrueSoftBox>
      ))}
      <TrueSoftBox args={[0.74, 0.14, 0.14]} radius={0.065} position={[0, 0.62, 1.04]}>
        <FabricMaterial color={colors.choco} bumpScale={0.016} />
      </TrueSoftBox>
      <StitchLine points={[[-0.27, 0.63, 1.115], [0.27, 0.63, 1.115]]} color={colors.gold} width={0.9} />

      <group position={[1.06, 0.43, 1]} rotation={[0, 0, -0.13]}>
        <mesh position={[0, 0.25, 0]}>
          <torusGeometry args={[0.085, 0.018, 8, 20, Math.PI * 1.65]} />
          <FabricMaterial color={colors.choco} />
        </mesh>
        <TrueSoftBox args={[0.32, 0.42, 0.055]} radius={0.026}>
          <FabricMaterial color={colors.pink} bumpScale={0.016} />
        </TrueSoftBox>
        <StitchRectangle width={0.22} height={0.3} position={[0, 0, 0.032]} color={colors.white} />
        <mesh position={[0, 0.11, 0.036]}>
          <circleGeometry args={[0.026, 12]} />
          <meshStandardMaterial color={colors.choco} roughness={0.9} />
        </mesh>
        <TrueSoftBox args={[0.14, 0.025, 0.012]} radius={0.005} position={[0, -0.07, 0.036]}>
          <meshStandardMaterial color={colors.white} roughness={0.95} />
        </TrueSoftBox>
      </group>

      {/* Небольшой список лежит на дне внутри корпуса, а не на искусственном возвышении. */}
      <group visible={open > 0.18} scale={0.8 + open * 0.2} position={[0, 0.52, -0.16]} rotation={[0, -0.12, 0]}>
        <TrueSoftBox args={[1.3, 0.055, 0.82]} radius={0.026}>
          <FabricMaterial color={colors.white} bumpScale={0.012} />
        </TrueSoftBox>
        {[0, 1, 2].map((line) => (
          <mesh key={line} position={[0.12, 0.048, -0.23 + line * 0.23]}>
            <boxGeometry args={[0.72, 0.025, 0.04]} />
            <meshStandardMaterial color={line === 0 ? colors.choco : line === 1 ? colors.pink : colors.sky} roughness={0.95} />
          </mesh>
        ))}
        <mesh position={[-0.46, 0.048, -0.23]}>
          <cylinderGeometry args={[0.06, 0.06, 0.025, 16]} />
          <FabricMaterial color={colors.pink} />
        </mesh>
      </group>
    </group>
  );
}

function Flower({ index }: { index: number }) {
  const angle = (index / 7) * Math.PI * 2 + 0.3;
  const radius = 3.25 + (index % 2) * 0.45;
  const scale = 0.8 + (index % 3) * 0.12;
  const petalColor = index % 3 === 0 ? colors.pistachio : index % 2 === 0 ? colors.pink : colors.pastel;

  return (
    <group position={[Math.cos(angle) * radius, 0.08, Math.sin(angle) * radius]} scale={scale}>
      {Array.from({ length: 5 }, (_, petal) => {
        const petalAngle = (petal / 5) * Math.PI * 2;
        return (
          <mesh key={petal} position={[Math.cos(petalAngle) * 0.2, 0, Math.sin(petalAngle) * 0.2]} scale={[1, 0.45, 1]}>
            <sphereGeometry args={[0.18, 12, 8]} />
            <FabricMaterial color={petalColor} bumpScale={0.03} />
          </mesh>
        );
      })}
      <mesh scale={[1, 0.5, 1]}>
        <sphereGeometry args={[0.13, 12, 8]} />
        <FabricMaterial color={colors.butter} bumpScale={0.03} />
      </mesh>
    </group>
  );
}

function Scene({ progress }: { progress: number }) {
  const size = useThree((state) => state.size);
  const compact = size.width < 768;
  const fabric = useMemo(makeFabricTexture, []);

  return (
    <FabricContext.Provider value={fabric}>
      <color attach="background" args={[colors.milk]} />
      <fog attach="fog" args={[colors.milk, 13, 28]} />
      <CameraRig />
      <SceneMetrics />
      <hemisphereLight args={["#FFF8EE", "#D7C0B4", 1.35]} />
      <directionalLight position={[-4, 8, 6]} intensity={1.7} color="#FFF4E4" />
      <directionalLight position={[5, 4, -2]} intensity={0.45} color="#DDEEFF" />

      <group position={[0, compact ? 0.25 : -0.2, 0]} scale={compact ? 0.68 : 1}>
        <Suitcase progress={progress} />
        {objectComponents.map((_, index) => (
          <EmergingObject key={index} index={index} progress={progress} compact={compact} />
        ))}
        {Array.from({ length: 7 }, (_, index) => (
          <Flower key={index} index={index} />
        ))}
      </group>

      {/* Отдельный непрозрачный пол сюда не добавляем: ContactShadows снимает всю сцену
          в depth-текстуру, и такой пол превращает всю плоскость тени в серый прямоугольник. */}
      <GroundShadows />
    </FabricContext.Provider>
  );
}

export default function RoadTransitionScene({
  progress,
  onReady,
}: {
  progress: number;
  onReady: () => void;
}) {
  return (
    <Canvas
      aria-hidden="true"
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: [0, 4.8, 8.6], fov: 35, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={onReady}
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <Scene progress={progress} />
    </Canvas>
  );
}
