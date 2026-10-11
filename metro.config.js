const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const isProd = process.env.NODE_ENV === "production";
const originalResolveRequest = config.resolver.resolveRequest;

// Keep Agentation out of production web bundles entirely (dev-only toolbar).
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    isProd &&
    platform === "web" &&
    (moduleName === "agentation" || moduleName.startsWith("agentation/"))
  ) {
    return {
      type: "empty",
    };
  }

  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
