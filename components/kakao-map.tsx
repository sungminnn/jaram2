"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    kakao?: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (latitude: number, longitude: number) => unknown;
        Map: new (container: HTMLElement, options: { center: unknown; level: number }) => {
          getCenter: () => unknown;
        };
        Marker: new (options: { position: unknown }) => {
          setMap: (map: unknown) => void;
        };
      };
    };
  }
}

type KakaoMapProps = {
  appKey?: string;
  latitude: number;
  longitude: number;
};

export function KakaoMap({ appKey, latitude, longitude }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (window.kakao?.maps) {
      initializeMap();
    }
  }, [latitude, longitude]);

  function initializeMap() {
    if (!mapRef.current || !window.kakao?.maps || initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    window.kakao.maps.load(() => {
      if (!mapRef.current || !window.kakao?.maps) {
        return;
      }

      const center = new window.kakao.maps.LatLng(latitude, longitude);
      const map = new window.kakao.maps.Map(mapRef.current, {
        center,
        level: 3,
      });

      const marker = new window.kakao.maps.Marker({
        position: center,
      });

      marker.setMap(map);
    });
  }

  if (!appKey) {
    return (
      <div className="rounded-lg border border-forest/10 bg-white p-6 text-sm leading-7 text-muted">
        카카오 지도 키가 설정되지 않아 지도를 표시할 수 없습니다. `.env.local`에
        `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`를 추가해 주세요.
      </div>
    );
  }

  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`}
        strategy="afterInteractive"
        onLoad={initializeMap}
      />
      <div
        ref={mapRef}
        className="min-h-[22rem] w-full rounded-lg border border-forest/10 bg-sand/50 shadow-[0_18px_48px_rgba(47,80,61,0.08)] sm:min-h-[31.25rem]"
      />
    </>
  );
}
