<template>
  <div class="map-container">
    <div ref="mapElement" class="map"></div>
    <div v-if="loading" class="loading">지도 로딩 중...</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { locationApi } from '../services/api';
import type { Location } from '../types/locations';

const mapElement = ref<HTMLElement | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

let map: any = null;
const markers: any[] = [];

// 마커 상태별 색상 정의
const getMarkerIcon = (status: string) => {
  const colors: Record<string, string> = {
    // 정상 - 초록색
    'Operational': '#00C73C',
    'normal': '#00C73C',

    // 오류 - 빨강
    'Network Error': '#FF3E3E',
    'error': '#FF3E3E',

    // UPS 오류 - 주황
    'Sensor Error (UPS)': '#FF8C00',
    'UPS Error': '#FF8C00',

    // 데이터 타임아웃 - 노랑
    'Data Timeout': '#FFFF00',
    'Warning': '#FFFF00',
    'warning': '#FFFF00',

    // 알 수 없음 - 회색
    'Offline': '#999999',
    'Power Off': '#999999',
    'offline': '#999999',

    // 기타 - 블랙
    'Unknown': '#000000',
  };

  const color = colors[status] || '#999999';

  return {
    content: `<div style="
    background-color: ${color};
    width: 13px;
    height: 13px;
    border-radius: 50%;
    border: 3px solid #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);"></div>`,
    size: new window.naver.maps.Size(24, 24),
    anchor: new window.naver.maps.Point(12, 12),
  };
};

// 정보창 내용 생성
const getInfoWindowContent = (location: Location) => {
  const deviceList = location.devices
    .map(d => `<li>${d.deviceType || 'Unknown'} (${d.vendor || '-'})</li>`)
    .join('');

  return `
    <div style="padding: 15px; min-width: 200px;">
      <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold">
        ${location.streamName || '이름 없음'}  
      </h3>
      <p style="margin: 5px 0; font-size: 13px; color: #666;">
        <strong>위치 :</strong> ${location.regionProvince || '-'} ${location.regionCity || '-'}  
      </p>
      <p style="margin: 5px 0; font-size: 13px; color: #666;">
        <strong>주소 :</strong> ${location.addressText || '-'}  
      </p>
      <p style="margin: 5px 0; font-size: 13px;">
        <strong>상태 :</strong>
        <span style="color: ${location.statusCode === 'Operational' ? '#00C73C' : '#FF3E3E'};">
          ${location.statusCode}
        </span>  
      </p>
      ${location.devices.length > 0 ? `
        <div style="margin-top: 10px;">
          <strong style="font-size: 13px;">장비 목록 :</strong>
          <ul style="margin: 5px 0; padding-left: 20px; font-size: 12px;">
            ${deviceList}
          </ul>
        </div>
        ` : ''}
    </div>
  `;
};

// 지도 초기화
const initMap = () => {
  if (!mapElement.value || !window.naver) {
    error.value = '네이버 지도를 로드할 수 없습니다.';
    return;
  }

  // 기본 위치 (대한민국 중심)
  const defaultCenter = new window.naver.maps.LatLng(36.5, 127.5);

  map = new window.naver.maps.Map(mapElement.value, {
    center: defaultCenter,
    zoom: 7,
    minZoom: 6,
    maxZoom: 18,
  });
};

// 마커 추가하기
const addMarkers = async () => {
  try {
    loading.value = true;
    const locations = await locationApi.getAllLocations();

    if (locations.length === 0) {
      error.value = '표시할 위치 데이터가 없습니다.';
      return;
    }

    // 기존 마커 제거
    markers.forEach(marker => marker.setMap(null));
    markers.length = 0;

    // 새 마커 추가
    locations.forEach((location: Location) => {
      if (!location.latitude || !location.longitude) return;

      const position = new window.naver.maps.LatLng(
        location.latitude,
        location.longitude,
      );

      const marker = new window.naver.maps.Marker({
        position,
        map,
        title: location.streamName || '이름 없음',
        icon: getMarkerIcon(location.statusCode),
      });

      // 정보창 생성
      const infoWindow = new window.naver.maps.InfoWindow({
        content: getInfoWindowContent(location),
      });

      // 마커 클릭 이벤트
      window.naver.maps.Event.addListener(marker, 'click', () => {
        if (infoWindow.getMap()) {
          infoWindow.close();
        } else {
          infoWindow.open(map, marker);
        }
      });

      markers.push(marker);
    });

    // 첫 번째 마커로 지도 중심 이동
    if (locations.length > 0 && locations[0]?.latitude && locations[0]?.longitude && window.naver?.maps) {
      map.setCenter(
        new window.naver.maps.LatLng(
          locations[0].latitude,
          locations[0].longitude,
        )
      );
      map.setZoom(10);
    }
    error.value = null;
  } catch (e) {
    error.value = '위치 데이터를 불러오는데 실패했습니다.';
    console.error('Error loading locations: ', e);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  // 네이버 지도 SDK 로드 대기
  if (window.naver && window.naver.maps) {
    initMap();
    await addMarkers();
  } else {
    error.value = '네이버 지도 SDK가 로드되지 않았습니다.';
    loading.value = false;
  }
});
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.map {
  width: 100%;
  height: 100%;
}

.loading,
.error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-size: 16px;
  z-index: 1000;
}

.error {
  color: #ff3e3e;
}
</style>