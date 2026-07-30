import { en } from "./locales/en";
import { zhCN, type TranslationKey } from "./locales/zh-cn";

export type LocaleMode = "system" | "zh-CN" | "en";
export type Language = Exclude<LocaleMode, "system">;
export type TranslationValue = string | number | boolean | null | undefined;
export type TranslationParams = Record<string, TranslationValue>;
export type Translator = (
  key: TranslationKey,
  params?: TranslationParams
) => string;

export interface LanguageDetectors {
  getLanguage?: () => string | null | undefined;
  getMomentLocale?: () => string | null | undefined;
}

export interface I18n {
  language: Language;
  t: Translator;
}

export const DEFAULT_LANGUAGE: Language = "zh-CN";

const dictionaries: Record<
  Language,
  Readonly<Record<TranslationKey, string>>
> = {
  "zh-CN": zhCN,
  en
};

function callDetector(
  detector: (() => string | null | undefined) | undefined
): string | null {
  if (!detector) {
    return null;
  }
  try {
    const value = detector();
    return typeof value === "string" ? value : null;
  } catch {
    return null;
  }
}

export function normalizeLocaleMode(value: unknown): LocaleMode {
  return value === "system" || value === "zh-CN" || value === "en"
    ? value
    : "system";
}

export function normalizeLanguage(value: unknown): Language | null {
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.trim().replace(/_/g, "-").toLowerCase();
  if (normalized === "en" || normalized.startsWith("en-")) {
    return "en";
  }
  if (normalized === "zh" || normalized.startsWith("zh-")) {
    return "zh-CN";
  }
  return null;
}

export function resolveLanguage(
  mode: LocaleMode = "system",
  detectors: LanguageDetectors = {}
): Language {
  if (mode === "zh-CN" || mode === "en") {
    return mode;
  }
  const publicLanguage = normalizeLanguage(
    callDetector(detectors.getLanguage)
  );
  if (publicLanguage) {
    return publicLanguage;
  }
  const momentLanguage = normalizeLanguage(
    callDetector(detectors.getMomentLocale)
  );
  return momentLanguage || DEFAULT_LANGUAGE;
}

export const getLanguage = resolveLanguage;

export function hasTranslationKey(key: string): key is TranslationKey {
  return Object.prototype.hasOwnProperty.call(zhCN, key);
}

function interpolate(
  template: string,
  params: TranslationParams = {}
): string {
  return template.replace(
    /\{([A-Za-z][A-Za-z0-9_]*)\}/g,
    (match, name) => {
      if (!Object.prototype.hasOwnProperty.call(params, name)) {
        return match;
      }
      const value = params[name];
      return value === null || value === undefined ? "" : String(value);
    }
  );
}

export function translate(
  language: Language,
  key: TranslationKey,
  params?: TranslationParams
): string {
  const template = dictionaries[language][key] || zhCN[key] || key;
  return interpolate(template, params);
}

export function translateDynamic(
  language: Language,
  key: string,
  params?: TranslationParams
): string {
  if (!hasTranslationKey(key)) {
    return key;
  }
  return translate(language, key, params);
}

export function createTranslator(language: Language): Translator {
  return (key, params) => translate(language, key, params);
}

export function createI18n(
  mode: LocaleMode = "system",
  detectors: LanguageDetectors = {}
): I18n {
  const language = resolveLanguage(mode, detectors);
  return {
    language,
    t: createTranslator(language)
  };
}

export type { TranslationKey };
