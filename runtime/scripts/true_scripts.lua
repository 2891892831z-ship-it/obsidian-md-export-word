-- Convert raw HTML <sub>...</sub> and <sup>...</sup> markers in Markdown
-- into Pandoc-native Subscript/Superscript inline nodes.
--
-- Why this filter exists:
-- Pandoc's DOCX writer may discard raw HTML tags while keeping their text,
-- causing CO<sub>2</sub> to become baseline "CO2". Native Pandoc script
-- nodes are written as real Word w:vertAlign formatting.
--
-- v2 (2026-10-30): additionally convert Unicode sub/superscript CHARACTERS
-- (CO₂, 10⁸, m³, μg·g⁻¹ …) into native nodes, matching the character table
-- of 0-辅助/scripts/Unicode上下标转换.bas. These "fake" script characters
-- render full-size in many fonts and were previously left untouched —
-- including inside figure/table captions.

-- ---------------------------------------------------------------------------
-- Unicode 上下标字符表（与 0-辅助/scripts/Unicode上下标转换.bas 对齐）
-- ---------------------------------------------------------------------------
local SUB_MAP = {
  [0x2080]="0",[0x2081]="1",[0x2082]="2",[0x2083]="3",[0x2084]="4",
  [0x2085]="5",[0x2086]="6",[0x2087]="7",[0x2088]="8",[0x2089]="9",
  [0x208A]="+",[0x208B]="-",[0x208C]="=",[0x208D]="(",[0x208E]=")",
  [0x2090]="a",[0x2091]="e",[0x2092]="o",[0x2093]="x",
  [0x2095]="h",[0x2096]="k",[0x2097]="l",[0x2098]="m",[0x2099]="n",
  [0x209A]="p",[0x209B]="s",[0x209C]="t",
}
local SUP_MAP = {
  [0x2070]="0",[0x00B9]="1",[0x00B2]="2",[0x00B3]="3",[0x2074]="4",
  [0x2075]="5",[0x2076]="6",[0x2077]="7",[0x2078]="8",[0x2079]="9",
  [0x207A]="+",[0x207B]="-",[0x207C]="=",[0x207D]="(",[0x207E]=")",
  [0x207F]="n",[0x2071]="i",
  [0x1D43]="a",[0x1D47]="b",[0x1D9C]="c",[0x1D48]="d",[0x1D49]="e",
  [0x1DA0]="f",[0x1D50]="m",[0x1D52]="o",[0x1D57]="t",[0x1D58]="u",
  [0x1D5B]="v",
  [0x1D5D]="β",[0x1D5E]="γ",[0x1D5F]="δ",[0x1D60]="φ",[0x1D61]="χ",
}

-- 把一个 Str 文本按 Unicode 上下标字符拆分为 Inlines；
-- 不含可转换字符时返回 nil（调用方保留原 Str）。
-- 连续同类字符合并进同一个 Subscript/Superscript（⁻¹ → Superscript "-1"）。
local function str_to_scripts(text)
  local has = false
  for _, cp in utf8.codes(text) do
    if SUB_MAP[cp] or SUP_MAP[cp] then has = true break end
  end
  if not has then return nil end
  local out = pandoc.List()
  local plain, run, mode = {}, {}, nil -- mode: "sub" / "sup" / nil
  local function flush_plain()
    if #plain > 0 then
      out:insert(pandoc.Str(table.concat(plain)))
      plain = {}
    end
  end
  local function flush_run()
    if mode then
      local s = table.concat(run)
      if mode == "sub" then
        out:insert(pandoc.Subscript(s))
      else
        out:insert(pandoc.Superscript(s))
      end
      run, mode = {}, nil
    end
  end
  for _, cp in utf8.codes(text) do
    local sub, sup = SUB_MAP[cp], SUP_MAP[cp]
    if sub or sup then
      local want = sub and "sub" or "sup"
      if mode ~= want then
        flush_run()
        flush_plain()
      end
      mode = want
      table.insert(run, sub or sup)
    else
      flush_run()
      table.insert(plain, utf8.char(cp))
    end
  end
  flush_run()
  flush_plain()
  return out
end

-- 对 Inlines 列表应用 Unicode 上下标转换（只处理顶层 Str，
-- 不进入已由 HTML 标签生成的 Subscript/Superscript 内部，避免嵌套）
local function convert_unicode_scripts(inlines)
  local out = pandoc.List()
  for _, el in ipairs(inlines) do
    if el.t == "Str" then
      local pieces = str_to_scripts(el.text)
      if pieces then
        out:extend(pieces)
      else
        out:insert(el)
      end
    else
      out:insert(el)
    end
  end
  return out
end

local function raw_html_text(inline)
  if inline.t ~= "RawInline" then
    return nil
  end
  if tostring(inline.format):lower() ~= "html" then
    return nil
  end
  return inline.text:lower()
end

local function opening_kind(inline)
  local text = raw_html_text(inline)
  if not text then
    return nil
  end
  if text:match("^%s*<%s*sub%s*>%s*$")
      or text:match("^%s*<%s*sub%s+[^>]*>%s*$") then
    return "sub"
  end
  if text:match("^%s*<%s*sup%s*>%s*$")
      or text:match("^%s*<%s*sup%s+[^>]*>%s*$") then
    return "sup"
  end
  return nil
end

local function is_closing(inline, kind)
  local text = raw_html_text(inline)
  if not text then
    return false
  end
  return text:match("^%s*</%s*" .. kind .. "%s*>%s*$") ~= nil
end

local function transform(inlines)
  local output = pandoc.List()
  local index = 1

  while index <= #inlines do
    local kind = opening_kind(inlines[index])

    if not kind then
      output:insert(inlines[index])
      index = index + 1
    else
      local inner = pandoc.List()
      local depth = 1
      local cursor = index + 1

      while cursor <= #inlines do
        local nested_kind = opening_kind(inlines[cursor])
        if nested_kind == kind then
          depth = depth + 1
          inner:insert(inlines[cursor])
        elseif is_closing(inlines[cursor], kind) then
          depth = depth - 1
          if depth == 0 then
            break
          end
          inner:insert(inlines[cursor])
        else
          inner:insert(inlines[cursor])
        end
        cursor = cursor + 1
      end

      if depth ~= 0 then
        -- Preserve malformed/unclosed markup instead of silently deleting it.
        output:insert(inlines[index])
        index = index + 1
      else
        local converted = transform(inner)
        if kind == "sub" then
          output:insert(pandoc.Subscript(converted))
        else
          output:insert(pandoc.Superscript(converted))
        end
        index = cursor + 1
      end
    end
  end

  return output
end

function Inlines(inlines)
  return convert_unicode_scripts(transform(inlines))
end
