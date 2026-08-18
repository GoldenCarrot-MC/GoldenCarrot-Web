import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import {
  Body,
  Bodies,
  Composite,
  Engine,
  Events,
  Runner,
  Vertices,
} from 'matter-js';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const blocks = [
  { type: 'grass', label: 'Grass block' },
  { type: 'tnt', label: 'TNT block' },
  { type: 'diamond', label: 'Diamond ore' },
  { type: 'gold', label: 'Gold block' },
  { type: 'redstone', label: 'Redstone block' },
  { type: 'crafting', label: 'Crafting table' },
  { type: 'obsidian', label: 'Obsidian block' },
] as const;

export function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const physicsRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = physicsRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      setBounds({
        width: Math.round(entry.contentRect.width),
        height: Math.round(entry.contentRect.height),
      });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = physicsRef.current;
    if (!container || !bounds.width || !bounds.height) return;

    const engine = Engine.create({ gravity: { x: 0, y: 1.05 } });
    const runner = Runner.create();
    const isCompact = bounds.width < 640;
    const baseSize = Math.max(76, Math.min(isCompact ? 98 : 136, bounds.width / (isCompact ? 3.8 : 9)));
    const scales = [1, 0.92, 1.04, 0.9, 0.98, 1.06, 0.94];
    const xPositions = [0.08, 0.23, 0.38, 0.52, 0.67, 0.82, 0.94];
    const yPositions = [0.16, 0.05, 0.3, 0.1, 0.24, 0.03, 0.34];
    const angles = [-0.14, 0.08, -0.2, 0.16, -0.08, 0.13, -0.12];

    const bodies = blocks.map((_, index) => {
      const size = baseSize * scales[index];
      const x = Math.min(
        bounds.width - size / 2 - 6,
        Math.max(size / 2 + 6, bounds.width * xPositions[index]),
      );
      const y = Math.max(size / 2 + 4, bounds.height * yPositions[index]);
      const body = Bodies.rectangle(x, y, size, size, {
        angle: angles[index],
        chamfer: { radius: Math.min(8, size * 0.06) },
        density: 0.0018,
        friction: 0.62,
        frictionAir: 0.012,
        restitution: 0.38,
      });

      const element = blockRefs.current[index];
      if (element) {
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
      }
      return body;
    });

    const wallThickness = 80;
    const walls = [
      Bodies.rectangle(-wallThickness / 2, bounds.height / 2, wallThickness, bounds.height * 2, { isStatic: true }),
      Bodies.rectangle(bounds.width + wallThickness / 2, bounds.height / 2, wallThickness, bounds.height * 2, { isStatic: true }),
      Bodies.rectangle(bounds.width / 2, bounds.height + wallThickness / 2, bounds.width * 2, wallThickness, { isStatic: true }),
      Bodies.rectangle(bounds.width / 2, -wallThickness / 2, bounds.width * 2, wallThickness, { isStatic: true }),
    ];

    let draggedBody: Body | null = null;
    let draggedPointerId = -1;
    let dragOffset = { x: 0, y: 0 };
    let lastDragPoint = { x: 0, y: 0 };

    const getPoint = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const onPointerDown = (event: PointerEvent) => {
      const point = getPoint(event);
      const body = [...bodies].reverse().find((candidate) => Vertices.contains(candidate.vertices, point));
      if (!body) return;

      draggedBody = body;
      draggedPointerId = event.pointerId;
      dragOffset = { x: body.position.x - point.x, y: body.position.y - point.y };
      lastDragPoint = { x: body.position.x, y: body.position.y };
      body.isSleeping = false;
      container.setPointerCapture(event.pointerId);
      event.preventDefault();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!draggedBody || event.pointerId !== draggedPointerId) return;
      const point = getPoint(event);
      const next = {
        x: Math.min(bounds.width - 8, Math.max(8, point.x + dragOffset.x)),
        y: Math.min(bounds.height - 8, Math.max(8, point.y + dragOffset.y)),
      };
      Body.setVelocity(draggedBody, {
        x: (next.x - lastDragPoint.x) * 0.55,
        y: (next.y - lastDragPoint.y) * 0.55,
      });
      Body.setPosition(draggedBody, next);
      lastDragPoint = next;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId !== draggedPointerId) return;
      draggedBody = null;
      draggedPointerId = -1;
      if (container.hasPointerCapture(event.pointerId)) {
        container.releasePointerCapture(event.pointerId);
      }
    };

    const syncElements = () => {
      bodies.forEach((body, index) => {
        const element = blockRefs.current[index];
        if (!element) return;
        element.style.transform = `translate3d(${body.position.x}px, ${body.position.y}px, 0) translate(-50%, -50%) rotate(${body.angle}rad)`;
        element.style.opacity = '1';
      });
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);
    Composite.add(engine.world, [...bodies, ...walls]);
    Events.on(engine, 'afterUpdate', syncElements);
    syncElements();
    Runner.run(runner, engine);

    return () => {
      Events.off(engine, 'afterUpdate', syncElements);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
      Runner.stop(runner);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [bounds]);

  return (
    <main className="relative h-[100svh] min-h-[680px] overflow-hidden bg-[#050708] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(217,255,114,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(217,255,114,0.025)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-golden-500/70 to-transparent" />

      <section className="relative z-20 mx-auto flex h-[48%] max-w-5xl flex-col items-center justify-center px-5 pb-2 pt-8 text-center sm:h-[50%] sm:px-8">
        <p className="text-[clamp(5.5rem,15vw,11rem)] font-black leading-[0.72] tracking-[0] text-golden-500">404</p>
        <h1 className="mt-6 max-w-4xl text-[clamp(2rem,5vw,4.5rem)] font-medium leading-[1.02] tracking-[0] text-white">
          {t('errors.404.title')}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">{t('errors.404.desc')}</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-golden-500"
          >
            <Home className="h-4 w-4" />
            {t('errors.backHome')}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="liquid-glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('errors.backPrev')}
          </button>
        </div>
      </section>

      <div
        ref={physicsRef}
        className="absolute inset-x-0 bottom-0 z-10 h-[52%] cursor-grab touch-none overflow-hidden active:cursor-grabbing sm:h-[50%]"
      >
        {blocks.map((block, index) => (
          <div
            key={block.type}
            ref={(element) => {
              blockRefs.current[index] = element;
            }}
            className={`mc-physics-block mc-physics-block--${block.type}`}
            aria-label={block.label}
          >
            <span className="mc-physics-block__texture" aria-hidden="true" />
            {block.type === 'tnt' && <span className="mc-physics-block__tnt">TNT</span>}
          </div>
        ))}
      </div>
    </main>
  );
}
