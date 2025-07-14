"use client"

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
export default function Page() {

  const [minutesPerCell, setMinutesPerCell] = useState(2)

  useEffect(() => {
    const COLS = 24;
    const ROWS = 24;
    const GRID = document.getElementById('grid');
    if (!GRID) return;

    // 初期描画
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const clock = document.createElement('div');
        clock.className = 'relative w-[32px] h-[32px] border-gray-400 rounded-full box-border';

        const hHand = document.createElement('div');
        hHand.className = 'hand hour absolute left-1/2 top-1/2 bg-gray-200 w-[3px] h-[8px] rounded-full';
        const mHand = document.createElement('div');
        mHand.className = 'hand min absolute left-1/2 top-1/2 bg-gray-200 w-[2px] h-[16px]';

        clock.appendChild(hHand);
        clock.appendChild(mHand);
        clock.dataset.offsetMin = "" + (r + c) * minutesPerCell;
        GRID.appendChild(clock);
      }
    }

    const start = performance.now();

    function update() {
      const elapsedSec = (performance.now() - start) / 1000;
      const virtualMin = elapsedSec * 60;

      document.querySelectorAll<HTMLElement>('.hand.hour').forEach(h => {
        const parent = h.parentElement as HTMLElement;

        if (parent == null) return
        const offset = Number(parent.dataset.offsetMin);
        const totalMin = virtualMin + offset;
        const deg = ((totalMin / 720) % 1) * 360;
        h.style.transform = `translate(-50%, -100%) rotate(${deg}deg)`;
        h.style.transformOrigin = "50% 100%"
      });

      document.querySelectorAll<HTMLElement>('.hand.min').forEach(m => {
        const parent = m.parentElement;
        const offset = Number(parent?.dataset.offsetMin);
        const totalMin = virtualMin + offset;
        const deg = ((totalMin / 60) % 1) * 360;
        m.style.transform = `translate(-0%, -100%) rotate(${deg}deg)`;
        m.style.transformOrigin = "50% 100%"
      });

      requestAnimationFrame(update);
    }

    update();
  }, []);


  return (
    <>
      <Head>
        <title>12 × 12 Clock Grid</title>
      </Head>
      <div className='min-h-screen bg-black divide-y text-white '>

        <div className='flex p-4 gap-4'>
          <div>/</div>
          <Link href={"/products"}>products</Link>
          <div>/</div>
          <div>001 Tick</div>
        </div>

        <main className="flex flex-col p-12 gap-12">
          <h2 className='text-xl'>たくさんの時計</h2>

          <div className='flex gap-3'>
            <div className='border-2 w-32 flex items-center justify-center' onClick={() => setMinutesPerCell(minutesPerCell + 1)}>+</div>
            <div className='border-2 w-32 flex items-center justify-center' onClick={() => setMinutesPerCell(minutesPerCell - 1)}>-</div>
          </div>
          <div
            id="grid"
            className="grid gap-1"
            style={{
              gridTemplateColumns: 'repeat(24, 32px)',
              gridTemplateRows: 'repeat(24, 32px)',
            }}
          />
        </main>
      </div>
    </>
  );
}