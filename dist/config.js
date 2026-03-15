import fs from "fs";
import os from "os";
import path from "path";
function getConfigFilePath() {
    return path.join(os.homedir(), ".gatorconfig.json");
}
function writeConfig(cfg) {
    const filePath = getConfigFilePath();
    const data = {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName
    };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
function validateConfig(rawConfig) {
    if (!rawConfig.db_url) {
        throw new Error("Config missing db_url");
    }
    return {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name
    };
}
export function readConfig() {
    const filePath = getConfigFilePath();
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(fileContent);
    return validateConfig(parsed);
}
export function setUser(userName) {
    const config = readConfig();
    config.currentUserName = userName;
    writeConfig(config);
}
