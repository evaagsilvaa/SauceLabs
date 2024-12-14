import * as fs from 'fs';
import * as path from 'path';
import { Translations } from '../types/translations'; // Import the interface

export function loadTranslations(locale: string): Translations {  // Type the return value as Translations
  const filePath = path.resolve(__dirname, `../locales/${locale}.json`);
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData) as Translations;  // Cast to Translations type
}
