export const isDemoModeEnabled = () =>
   process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
   process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true" ||
   (process.env.NODE_ENV === "development" &&
      process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== "false");

export const isMockAuthEnabled = isDemoModeEnabled;
