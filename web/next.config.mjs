/** @type {import('next').NextConfig} */
const isStaticBuild = process.env.IS_STATIC_BUILD === "true"; // Use a custom environment variable
const nextConfig = {
  ...(isStaticBuild ? { output: "export", distDir: "out" } : {}),
};

export default nextConfig;
