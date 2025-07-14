"use client"
import React, { useEffect, useState } from 'react';
import { getDay, getYear, addDays, getMonth, format } from "date-fns"
import Link from 'next/link';
function getMoonAge(date: Date) {
    const msPerDay = 1000 * 60 * 60 * 24;

    // NASA が定義する基準新月: 2000年1月6日 18:14 UTC
    const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14, 0); // UTC
    const targetTime = Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

    const daysSince = (targetTime - knownNewMoon) / msPerDay;
    const moonAge = (daysSince % 29.530588853 + 29.530588853) % 29.530588853;

    return moonAge;
}

type MoonPhaseProps = {
    moonAge: number; // 0〜29.53
    size?: number;
};

export function MoonPhase({ moonAge, size = 100 }: MoonPhaseProps) {
    const synodicMonth = 29.530588853;             // 朔望月
    const phaseRatio = (moonAge % synodicMonth) / synodicMonth; // 0–1

    // 影の幅パーセンテージ（0 = 影なし, 50 = 半分影）
    const shadowWidth = Math.abs(2 * Math.abs(1 - 2 * phaseRatio) - 1) * 32; // 0–50
    const center = 16 - (shadowWidth / 2)

    const isDarkPhase = (phaseRatio < 0.25) || (phaseRatio > 0.75)

    return (
        <div
            className="relative rounded-full bg-white"
            style={{ width: size, height: size }}>
            <div style={{
                position: "absolute",
                visibility: (shadowWidth < 4) ? "hidden" : "visible",
                top: 0,
                bottom: 0,
                borderRight: `${shadowWidth / 2}px solid ${isDarkPhase ? 'black' : 'white'}`,
                borderLeft: `${shadowWidth / 2}px solid ${isDarkPhase ? 'black' : 'white'}`,
                borderRadius: "100%",
                right: `${center}px`,
                zIndex: 2
            }}></div>

            <div style={{
                visibility: (phaseRatio < 0.5) ? "visible" : "hidden",
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                backgroundColor: "black",
                width: "16px"
            }}></div>

            <div style={{
                visibility: (phaseRatio > 0.5) ? "visible" : "hidden",
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                backgroundColor: "black",
                width: "15px"
            }}></div>
        </div>
    );
}
export default function Moon() {
    const now = new Date()
    const [year, setYear] = useState(getYear(now))

    const days = Array.from({ length: 365 }).map((_, d) => addDays(new Date(year, 1, 1), d))

    const months = Array.from(new Set(days.map(d => +getMonth(d)))).sort((a, b) => a - b)

    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        window.setTimeout(() => {
            setIsVisible(true)
        }, 1000)
    }, [year])

    return <div className='bg-black h-screen divide-y min-w-fit'>

        <div className='text-white flex p-4 gap-4'>
            <div>/</div>
            <Link href={"/products"}>products</Link>
            <div>/</div>
            <div>002 Moon Calendar</div>
        </div>

        <div className='flex flex-col'>

            <div className='text-white flex flex-col gap-4 p-12'>
                <h1 className='text-2xl'>Moon Calendar @ {year}</h1>
                <div className='flex gap-2'>
                    <div className='px-4 py-2 border' onClick={() => {

                        setIsVisible(false)
                        setYear(year + 1)
                    }}>+</div>
                    <div className='px-4 py-2 border' onClick={() => {
                        setIsVisible(false)
                        setYear(year - 1)
                    }}>-</div>
                </div>
                {
                    months.map(month => {
                        const _days = days.filter(d => month === getMonth(d))
                        const startDay = _days[0]

                        const offset = getDay(startDay)
                        console.log(offset)

                        return <div key={month} className='flex gap-4'>
                            <div className='shrink-0 w-32 flex items-center'>
                                {format(new Date(year, month, 1), "LLLL")}
                            </div>
                            {
                                Array.from({ length: offset }).map((_, i) => {
                                    return <div key={i} style={{ "flexBasis": "32px" }} className='shrink-0'></div>
                                })
                            }
                            {
                                _days.map(day => {
                                    const age = getMoonAge(day)
                                    return <div key={"" + day}
                                        className='transition-all delay-100 delay-200 delay-300'
                                        style={{
                                            width: "32px",
                                            height: "32px"
                                        }}                        >
                                        <div className={(isVisible ? "opacity-100" : "opacity-0") + ` transition-all duration-1000`}

                                            style={{
                                                transitionDelay: `${Math.floor(age / 4 + month * 30)}ms`
                                            }}
                                        >
                                            <MoonPhase moonAge={age} size={32} ></MoonPhase>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    })
                }

            </div>
        </div>


        <div className='text-white p-12 flex flex-col gap-3 '>
            <p>
                青白い光が踊り<br />
                指先が奏でる無言の詩<br />
                滑らかな円を描きながら<br />
                時は影を生み出してゆく<br />
            </p>
            <p>
                白と黒、光と闇<br />
                その境界線を撫でる指<br />
                満ちては欠けゆく月のように<br />
                画面の中をゆらゆらと<br />
            </p>

            <p>
                触れるたび形を変える<br />
                儚い波が生まれ消える<br />
                指はその流れを追い<br />
                静かに世界を操る<br />
            </p>

            <p>
                音もなく響く<br />
                微かな動きの響鳴<br />
                時の流れを閉じ込めた<br />
                ガラスの海のさざ波よ<br />
            </p>

            <p>
                私たちは静かに眺めている<br />
                その指が描く<br />
                光の中の詩を
            </p>
            <i>ChatGPT 2025</i>
        </div>
    </div>


}