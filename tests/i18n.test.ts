import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  DEFAULT_LANGUAGE,
  createI18n,
  createTranslator,
  getLanguage,
  hasTranslationKey,
  normalizeLanguage,
  normalizeLocaleMode,
  translateDynamic
} from "../src/i18n";
import { en } from "../src/locales/en";
import { zhCN } from "../src/locales/zh-cn";

function placeholders(value: string): string[] {
  return Array.from(
    value.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g),
    (match) => match[1]
  ).sort();
}

function extractProgressCalls(source: string): Array<{
  body: string;
  line: number;
}> {
  const calls: Array<{ body: string; line: number }> = [];
  const marker = "emit_progress(";
  let searchFrom = 0;

  while (searchFrom < source.length) {
    const start = source.indexOf(marker, searchFrom);
    if (start < 0) {
      break;
    }
    const lineStart = source.lastIndexOf("\n", start) + 1;
    if (source.slice(lineStart, start).trim() === "def") {
      searchFrom = start + marker.length;
      continue;
    }

    let depth = 1;
    let quote = "";
    let escaped = false;
    let cursor = start + marker.length;
    for (; cursor < source.length; cursor += 1) {
      const character = source[cursor];
      if (quote) {
        if (escaped) {
          escaped = false;
        } else if (character === "\\") {
          escaped = true;
        } else if (character === quote) {
          quote = "";
        }
        continue;
      }
      if (character === '"' || character === "'") {
        quote = character;
      } else if (character === "(") {
        depth += 1;
      } else if (character === ")") {
        depth -= 1;
        if (depth === 0) {
          break;
        }
      }
    }
    assert.equal(depth, 0, `unterminated emit_progress call at ${start}`);
    calls.push({
      body: source.slice(start + marker.length, cursor),
      line: source.slice(0, start).split(/\r?\n/).length
    });
    searchFrom = cursor + 1;
  }
  return calls;
}

function parameterKeys(body: string): Set<string> {
  const parameterBlock = /\bparams\s*=\s*\{([\s\S]*?)\}/.exec(body);
  if (!parameterBlock) {
    return new Set();
  }
  return new Set(
    Array.from(
      parameterBlock[1].matchAll(/"([A-Za-z][A-Za-z0-9_]*)"\s*:/g),
      (match) => match[1]
    )
  );
}

test("locale catalogs expose identical non-empty keys and placeholders", () => {
  const chineseKeys = Object.keys(zhCN).sort();
  assert.deepEqual(Object.keys(en).sort(), chineseKeys);
  assert.ok(chineseKeys.length > 200);
  for (const key of chineseKeys as Array<keyof typeof zhCN>) {
    assert.notEqual(zhCN[key].trim(), "", key);
    assert.notEqual(en[key].trim(), "", key);
    assert.deepEqual(
      placeholders(en[key]),
      placeholders(zhCN[key]),
      `placeholder mismatch for ${key}`
    );
  }
});

test("explicit modes bypass detectors and system mode uses fallbacks", () => {
  let calls = 0;
  const detectors = {
    getLanguage: () => {
      calls += 1;
      return "en-US";
    },
    getMomentLocale: () => {
      calls += 1;
      return "zh-cn";
    }
  };
  assert.equal(getLanguage("zh-CN", detectors), "zh-CN");
  assert.equal(getLanguage("en", detectors), "en");
  assert.equal(calls, 0);
  assert.equal(getLanguage("system", detectors), "en");
  assert.equal(calls, 1);
  assert.equal(
    getLanguage("system", {
      getLanguage: () => "fr",
      getMomentLocale: () => "zh_Hans"
    }),
    "zh-CN"
  );
  assert.equal(getLanguage(), DEFAULT_LANGUAGE);
});

test("locale values normalize without exposing private Obsidian state", () => {
  assert.equal(normalizeLocaleMode("invalid"), "system");
  assert.equal(normalizeLanguage("zh_CN"), "zh-CN");
  assert.equal(normalizeLanguage("zh-Hant"), "zh-CN");
  assert.equal(normalizeLanguage("en-GB"), "en");
  assert.equal(normalizeLanguage("fr"), null);
});

test("translator preserves zero, false, and unresolved placeholders", () => {
  const t = createTranslator("en");
  assert.equal(
    t("progress.export.checkResourcesDetail", {
      images: 0,
      tables: 2,
      equations: false
    }),
    "Images 0; tables 2; equations false"
  );
  assert.equal(
    t("runtime.status.installed", { target: "macOS Intel" }),
    "macOS Intel runtime {version} is installed."
  );
});

test("dynamic progress keys translate and unknown keys remain detectable", () => {
  assert.equal(hasTranslationKey("progress.export.init"), true);
  assert.equal(hasTranslationKey("progress.future.unknown"), false);
  assert.equal(
    translateDynamic("en", "progress.export.init"),
    "Initializing the export environment"
  );
  assert.equal(
    translateDynamic("en", "progress.future.unknown"),
    "progress.future.unknown"
  );
  const i18n = createI18n("system", {
    getLanguage: () => "en-US"
  });
  assert.equal(i18n.language, "en");
  assert.equal(i18n.t("common.cancel"), "Cancel");
});

test("Python progress events use canonical locale keys and parameters", () => {
  const scripts = [
    {
      file: "runtime/scripts/md_export_word_template.py",
      namespace: "progress.export."
    },
    {
      file: "runtime/scripts/recolor_zotero_citations.py",
      namespace: "progress.recolor."
    }
  ];

  for (const { file, namespace } of scripts) {
    const source = fs.readFileSync(path.join(process.cwd(), file), "utf8");
    const calls = extractProgressCalls(source);
    assert.ok(calls.length > 0, `${file} emits no progress events`);

    for (const { body, line } of calls) {
      const location = `${file}:${line}`;
      const stageKey = /\bstage_key\s*=\s*"([^"]+)"/.exec(body)?.[1];
      const detailKey = /\bdetail_key\s*=\s*"([^"]+)"/.exec(body)?.[1];
      assert.ok(stageKey, `${location} has no stage_key`);
      assert.ok(
        stageKey.startsWith(namespace),
        `${location} uses non-canonical stage_key ${stageKey}`
      );

      const params = parameterKeys(body);
      for (const key of [stageKey, detailKey].filter(Boolean) as string[]) {
        assert.equal(
          hasTranslationKey(key),
          true,
          `${location} references missing locale key ${key}`
        );
        for (const placeholder of placeholders(
          zhCN[key as keyof typeof zhCN]
        )) {
          assert.ok(
            params.has(placeholder),
            `${location} does not provide {${placeholder}} for ${key}`
          );
        }
      }
    }
  }
});

test("export cancellation exits with status 130", () => {
  const source = fs.readFileSync(
    path.join(
      process.cwd(),
      "runtime/scripts/md_export_word_template.py"
    ),
    "utf8"
  );
  const interruptBlock =
    /\n    except KeyboardInterrupt:([\s\S]*?)(?=\n    except |\s*$)/.exec(
      source
    )?.[1];
  assert.ok(interruptBlock, "KeyboardInterrupt handler is missing");
  assert.match(interruptBlock, /raise SystemExit\(130\)/);
});
