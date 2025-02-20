'use client';

import { store } from '@utils/external-state';
import {
  DEFAULT_CENTER,
  INITIAL_ZOOM_LEVEL,
  MAX_ZOOM_LEVEL,
  MIN_ZOOM_LEVEL,
} from '@constants/googleMaps';

export const getGoogleMapStore = (() => {
  let googleMap: google.maps.Map;
  let container: HTMLDivElement;

  if (typeof window !== 'undefined') {
    container = document.createElement('div');

    container.id = 'map';
    container.style.minHeight = '100vh';

    document.body.appendChild(container);
  }
  return () => {
    if (!googleMap) {
      googleMap = new window.google.maps.Map(container, {
        center: DEFAULT_CENTER,
        zoom: INITIAL_ZOOM_LEVEL,
        disableDefaultUI: true,
        clickableIcons: false,
        mapId: '92cb7201b7d43b21',
        minZoom: MIN_ZOOM_LEVEL,
        maxZoom: MAX_ZOOM_LEVEL,
        gestureHandling: 'greedy',
        restriction: {
          latLngBounds: {
            north: 39,
            south: 32,
            east: 132,
            west: 124,
          },
          strictBounds: true,
        },
      });
    }

    return store<google.maps.Map>(googleMap);
  };
})();

export const googleMapActions = {
  zoomUp: () => {
    const googleMap = getGoogleMapStore().getState();
    const prevZoom = googleMap.getZoom();
    googleMap.setZoom(prevZoom + 1);
  },
  zoomDown: () => {
    const googleMap = getGoogleMapStore().getState();
    const prevZoom = googleMap.getZoom();
    googleMap.setZoom(prevZoom - 1);
  },
  moveToCurrentPosition: () => {
    const googleMap = getGoogleMapStore().getState();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        googleMap.panTo({ lat: position.coords.latitude, lng: position.coords.longitude });
        googleMap.setZoom(INITIAL_ZOOM_LEVEL);
      },
      () => {
        alert('위치 권한을 허용해주세요.');
      },
      {
        enableHighAccuracy: true,
      }
    );
  },
  moveTo: (latLng: google.maps.LatLngLiteral, newZoom?: number) => {
    const googleMap = getGoogleMapStore().getState();

    /**
     * 아래 메서드의 순서를 바꾸게 되면 지도 경계면에 있는 도시들의 중심을 제대로 잡을 수 없는 문제가 있습니다.
     */
    googleMap.setZoom(newZoom || INITIAL_ZOOM_LEVEL);
    googleMap.panTo(latLng);
  },
};
