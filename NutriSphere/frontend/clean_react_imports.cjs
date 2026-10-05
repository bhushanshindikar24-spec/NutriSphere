const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('dist')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('d:/WT_CP/NutriSphere/frontend/src');

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Remove: import React from "react";
    const basicRegex = /^import React from ['"]react['"];?\s*$/gm;
    if (basicRegex.test(content)) {
        content = content.replace(basicRegex, '');
        changed = true;
    }

    // Replace: import React, { useState } from "react"; with import { useState } from "react";
    const destructureRegex = /^import React,\s*\{([^}]+)\}\s*from\s*['"]react['"];?/gm;
    if (destructureRegex.test(content)) {
        content = content.replace(destructureRegex, 'import { $1 } from "react";');
        changed = true;
    }

    if (changed) {
        // Strip out multiple blank lines left behind
        content = content.replace(/^\s*[\r\n]/gm, '\n');
        fs.writeFileSync(file, content);
    }
}
console.log(`Processed ${files.length} files.`);
