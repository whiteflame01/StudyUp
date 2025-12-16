import fs from 'fs';
import path from 'path';

const adjectivesPath = path.join(__dirname, 'english-adjectives.txt');
const nounsPath = path.join(__dirname, 'english-nouns.txt');

function loadLines(filePath: string): string[] {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  } catch (err) {
    console.error(`Failed to load ${filePath}:`, err);
    return [];
  }
}

export const ADJECTIVES: string[] = loadLines(adjectivesPath);
export const NOUNS: string[] = loadLines(nounsPath);
