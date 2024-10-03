export const preset = "react-native";
export const transform = {
    "^.+\\.[jt]sx?$": "babel-jest",
};
export const transformIgnorePatterns = ["node_modules/?!(react-icons)"];
export const setupFilesAfterEnv = ["<rootDir>/src/setupTests.ts"];
