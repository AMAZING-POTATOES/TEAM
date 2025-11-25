// src/components/IntroOverlay.tsx
import { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import dashboardBannerVideo from "../assets/banner.mp4";
import bgImage from "../assets/Overlay_bg.png"; 

type IntroOverlayProps = {
  isLoggedIn: boolean;
  onFinishLoggedIn: () => void;
  onFinishLoggedOut: () => void;
};

const SECTION_IDS = ["intro-s1", "intro-s2", "intro-s3"];

export default function IntroOverlay({
  isLoggedIn,
  onFinishLoggedIn,
  onFinishLoggedOut,
}: IntroOverlayProps) {
  const [closing, setClosing] = useState(false);
  const [visibleSections, setVisibleSections] =
    useState<Record<string, boolean>>({});
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const videoSectionRef = useRef<HTMLElement | null>(null);

  // 텍스트 섹션 페이드 인용 Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleSections((prev) => {
          const updated = { ...prev };
          entries.forEach((entry) => {
            const id = (entry.target as HTMLElement).id;
            if (entry.isIntersecting) {
              updated[id] = true;
            }
          });
          return updated;
        });
      },
      { threshold: 0.3 }
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const setSectionRef =
    (index: number) =>
    (el: HTMLElement | null): void => {
      sectionRefs.current[index] = el;
    };

  // 마지막 영상 섹션 보이면 3초 뒤 자동 전환
  const visibleTimerRef = useRef<number | null>(null);
  const finishTimerRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = videoSectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;

            // 3초간 영상 보여주고
            visibleTimerRef.current = window.setTimeout(() => {
              // 페이드 아웃 시작
              setClosing(true);

              // 살짝 딜레이 후 실제 Intro 종료
              finishTimerRef.current = window.setTimeout(() => {
                if (isLoggedIn) {
                  onFinishLoggedIn();
                } else {
                  onFinishLoggedOut();
                }
              }, 600);
            }, 3000);
          }
        });
      },
      { threshold: 0.7 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (visibleTimerRef.current) window.clearTimeout(visibleTimerRef.current);
      if (finishTimerRef.current) window.clearTimeout(finishTimerRef.current);
    };
  }, [isLoggedIn, onFinishLoggedIn, onFinishLoggedOut]);

  const baseSectionCls =
    "snap-start min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center transition-all duration-[1200ms]";
  const hiddenCls = "opacity-0 translate-y-3";
  const showCls = "opacity-100 translate-y-0";

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white flex flex-col transition-opacity duration-700 ${
        closing ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <Navbar />

      {/* 스크롤 영역 */}
      <div
        className="flex-1 overflow-y-auto snap-y snap-proximity"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-16">
          {/* HERO 슬라이드 */}
          <section className="snap-start min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center space-y-6">
            <p className="text-xs md:text-sm font-semibold tracking-[0.12em] uppercase text-emerald-600">
              냉장고 재료 관리 서비스 · 싹난감자
            </p>
            <h1 className="text-[28px] md:text-[40px] font-extrabold leading-tight">
              <span className="block">싹난감자</span>
              <span className="block mt-1">
                <span className="relative inline-block">
                  <span className="relative z-10">
                    당신의 냉장고를 위한{" "}
                    <span className="font-extrabold">똑똑한 파트너</span>
                  </span>
                  {/* 형광펜 하이라이트 느낌 */}
                  <span className="absolute inset-x-0 bottom-0 h-2 bg-emerald-200/70 rounded-md -z-0" />
                </span>
              </span>
            </h1>
            <p className="max-w-xl text-[13px] md:text-[15px] text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-900">
                잊혀져 가던 식재료를 다시 꺼내 쓰게 만드는 서비스.
              </span>
              <br />
              스마트한 식재료 관리와{" "}
              <span className="font-semibold text-emerald-700">
                레시피 추천
              </span>
              을 한 번에 제공합니다.
            </p>
            <p className="text-[11px] md:text-[13px] text-slate-400">
              아래로 스크롤하며 싹난감자가{" "}
              <span className="font-medium text-slate-500">
                어떻게 재료를 정리하고, 레시피와 연결하는지
              </span>{" "}
              확인해 보세요.
            </p>
          </section>

          {/* 슬라이드 1 */}
          <section
            id={SECTION_IDS[0]}
            ref={setSectionRef(0)}
            className={`${baseSectionCls} ${
              visibleSections[SECTION_IDS[0]] ? showCls : hiddenCls
            }`}
          >
            <div className="text-3xl mb-1">🥔</div>
            <h2 className="text-xl md:text-2xl font-bold">
              냉장고 속 잠자는 재료,
              <span className="block md:inline">
                {" "}
                <span className="font-extrabold text-slate-900">
                  버려지기엔 아깝지 않나요?
                </span>
              </span>
            </h2>
            <p className="max-w-md text-sm md:text-base text-slate-600 mt-3 leading-relaxed">
              언제 샀는지 기억도 안 나는 재료들.
              <br />
              <span className="font-semibold text-slate-900">
                싹난감자는 남은 식재료를 한눈에 보여주고
              </span>
              , 사용 우선순위를 제안해
              <br />
              불필요한 음식 낭비를 줄여 줍니다.
            </p>
          </section>

          {/* 슬라이드 2 */}
          <section
            id={SECTION_IDS[1]}
            ref={setSectionRef(1)}
            className={`${baseSectionCls} ${
              visibleSections[SECTION_IDS[1]] ? showCls : hiddenCls
            }`}
          >
            <div className="text-3xl mb-1">📸</div>
            <h2 className="text-xl md:text-2xl font-bold">
              <span className="font-extrabold text-slate-900">
                사진 한 장
              </span>
              으로 간편하게 재료 등록
            </h2>
            <p className="max-w-md text-sm md:text-base text-slate-600 mt-3 leading-relaxed">
              영수증 사진만 찍어 주세요.
              <br />
              <span className="font-semibold text-slate-900">
                하나씩 타이핑하지 않아도
              </span>
              , 필요한 정보만 똑똑하게 추출해
              <br />
              재료명, 수량, 유통기한을 자동으로 정리합니다.
            </p>
          </section>

          {/* 슬라이드 3 */}
          <section
            id={SECTION_IDS[2]}
            ref={setSectionRef(2)}
            className={`${baseSectionCls} ${
              visibleSections[SECTION_IDS[2]] ? showCls : hiddenCls
            }`}
          >
            <div className="text-3xl mb-1">🥗</div>
            <h2 className="text-xl md:text-2xl font-bold">
              가지고 있는 재료로{" "}
              <span className="font-extrabold text-emerald-700">
                오늘 바로 만들 수 있는 레시피
              </span>
            </h2>
            <p className="max-w-md text-sm md:text-base text-slate-600 mt-3 leading-relaxed">
              지금 냉장고에 있는 재료만으로 만들 수 있는 메뉴를 추천해요.
              <br />
              <span className="font-semibold text-slate-900">
                남은 재료까지 알뜰하게 쓸 수 있도록
              </span>
              , 레시피 조합과 활용 방법을
              <br />
              함께 제안하여, 계획적인 소비를 도와드립니다.
            </p>
          </section>
        </div>

        {/* 마지막 슬라이드: 네비바 제외 전체 화면 비디오 + 상단 그라데이션 */}
        <section
          ref={videoSectionRef}
          className="snap-start h-[calc(100vh-80px)] relative"
        >
          {/* 위쪽과 자연스럽게 이어지는 그라데이션 */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 z-10 bg-gradient-to-b from-white via-white/80 to-transparent" />
          <video
            className="w-full h-full object-cover"
            src={dashboardBannerVideo}
            autoPlay
            muted
            loop
            playsInline
          />
        </section>
      </div>
    </div>
  );
}
