import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const targetPath = path.join(repoRoot, 'node_modules', '@capacitor', 'cli', 'dist', 'util', 'spm.js');

if (!fs.existsSync(targetPath)) {
    console.warn(`[capacitor-spm-fix] Skipping; file not found: ${targetPath}`);
    process.exit(0);
}

const original = fs.readFileSync(targetPath, 'utf8');

if (original.includes('function ensureLocalPackageLinks(config, plugins) {')) {
    console.log('[capacitor-spm-fix] Fix already present.');
    process.exit(0);
}

let updated = original;

updated = updated.replace(
    "        log_1.logger.info('Writing Package.swift');\n        const textToWrite = await generatePackageText(config, plugins);",
    "        log_1.logger.info('Writing Package.swift');\n        ensureLocalPackageLinks(config, plugins);\n        const textToWrite = await generatePackageText(config, plugins);",
);

updated = updated.replace(
    "            const relPath = (0, path_1.relative)(config.ios.nativeXcodeProjDirAbs, plugin.rootPath);\n            packageSwiftText += `,\\n        .package(name: \"${(_a = plugin.ios) === null || _a === void 0 ? void 0 : _a.name}\", path: \"${relPath}\")`;",
    "            packageSwiftText += `,\\n        .package(name: \"${(_a = plugin.ios) === null || _a === void 0 ? void 0 : _a.name}\", path: \"LocalPackages/${(_a = plugin.ios) === null || _a === void 0 ? void 0 : _a.name}\")`;",
);

updated = updated.replace(
    "// Private Functions\nasync function pluginsWithPackageSwift(plugins) {",
    `// Private Functions
function ensureLocalPackageLinks(config, plugins) {
    const packageDirectory = (0, path_1.resolve)(config.ios.nativeProjectDirAbs, 'CapApp-SPM');
    const localPackagesDirectory = (0, path_1.join)(packageDirectory, 'LocalPackages');
    (0, fs_extra_1.ensureDirSync)(localPackagesDirectory);
    for (const plugin of plugins) {
        var _a;
        if ((0, plugin_1.getPluginType)(plugin, config.ios.name) === 1 /* PluginType.Cordova */) {
            continue;
        }
        const packageName = (_a = plugin.ios) === null || _a === void 0 ? void 0 : _a.name;
        if (!packageName) {
            continue;
        }
        const linkPath = (0, path_1.join)(localPackagesDirectory, packageName);
        const linkTarget = (0, path_1.relative)(localPackagesDirectory, plugin.rootPath);
        if ((0, fs_extra_1.existsSync)(linkPath)) {
            const existingStat = (0, fs_extra_1.lstatSync)(linkPath);
            if (existingStat.isSymbolicLink() && (0, fs_extra_1.readlinkSync)(linkPath) === linkTarget) {
                continue;
            }
            (0, fs_extra_1.removeSync)(linkPath);
        }
        (0, fs_extra_1.symlinkSync)(linkTarget, linkPath, 'dir');
    }
}
async function pluginsWithPackageSwift(plugins) {`,
);

if (updated === original) {
    console.error('[capacitor-spm-fix] Failed to apply patch; Capacitor CLI source format changed.');
    process.exit(1);
}

fs.writeFileSync(targetPath, updated);
console.log('[capacitor-spm-fix] Applied fix to @capacitor/cli SPM generator.');
