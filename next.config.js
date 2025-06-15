/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  compiler: {
    // SWC 컴파일러 활성화
    styledComponents: true,
  },
  // Babel 설정을 유지하면서 SWC도 사용
  experimental: {
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig;
