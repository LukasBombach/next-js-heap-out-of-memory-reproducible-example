const withTM = require("next-transpile-modules");
const withCompileToString = require("compile-to-string/next/plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withCompileToString(withTM(["ui-library"])(nextConfig));
