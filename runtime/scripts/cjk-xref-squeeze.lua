-- cjk-xref-squeeze.lua  (v5)
-- 去除 pandoc-crossref 生成的中文交叉引用前缀与编号之间的空格，
-- 并把图注/表注题名前的冒号换成一个空格：
--   图注/表注："图 1: 题名" -> "图1 题名"    正文引用："（图 1）" -> "（图1）"
-- 注意：Lua pattern 按字节匹配，多字节中文不能放进 [字符类]，本文件全部
--       使用完整字符串比较/字面量拼接，避免 UTF-8 被截断。
-- 用法（必须在 pandoc-crossref 之后运行）：
--   pandoc input.md --filter pandoc-crossref.exe --lua-filter cjk-xref-squeeze.lua -o out.docx

-- 前缀标签表：用于形态 1 的精确查找
local labels = { ["图"] = true, ["表"] = true, ["式"] = true, ["章"] = true, ["附录"] = true }
-- 前缀列表：用于字面量 gsub 与后缀比较
local label_list = { "图", "表", "式", "章", "附录" }
local NBSP = "\u{00A0}"

local function is_numbered(s)
  return s:match("^%d[%w%.%-]*") ~= nil
end

-- 字符串是否以某个标签（图/表/式/章/附录）结尾
local function is_label_ended(s)
  for _, lab in ipairs(label_list) do
    if #s >= #lab and s:sub(-#lab) == lab then
      return true
    end
  end
  return false
end

-- 字符串是否为纯空格串（普通空格或 nbsp 组成，长度 > 0）
local function is_space_str(s)
  if s == "" then return false end
  return s:gsub(" ", ""):gsub(NBSP, "") == ""
end

-- 去掉尾部的一个空格或 nbsp；返回 (剩余串, 是否去掉了)
local function strip_tail_space(s)
  if s:sub(-#NBSP) == NBSP then
    return s:sub(1, -#NBSP - 1), true
  elseif s:sub(-1) == " " then
    return s:sub(1, -2), true
  end
  return s, false
end

-- 串内清理："图\xa01" / "图 1" -> "图1"；"图1:" -> "图1 "（冒号换空格）
local function clean_text(t)
  for _, lab in ipairs(label_list) do
    t = t:gsub(lab .. NBSP .. "(%d)", lab .. "%1")
    t = t:gsub(lab .. " +(%d)", lab .. "%1")
    t = t:gsub("(" .. lab .. "%d[%w%.%-]*):(%S)", "%1 %2")
    t = t:gsub("(" .. lab .. "%d[%w%.%-]*):$", "%1")
  end
  return t
end

local function squeeze(inlines)
  -- 防御：传入的必须是 inline 列表（table）；单个 Inline（userdata）直接放行
  if type(inlines) ~= "table" then
    return inlines
  end
  local out = {}
  local i = 1
  local n = #inlines
  while i <= n do
    local cur = inlines[i]
    local nxt = inlines[i + 1]
    local nxt2 = inlines[i + 2]

    if cur.t == "Str" then
      -- 形态 1：Str"图" + Space元素 + Str"1:..." —— 图注/表注
      if labels[cur.text]
        and nxt and nxt.t == "Space"
        and nxt2 and nxt2.t == "Str" and is_numbered(nxt2.text)
      then
        local merged = cur.text .. nxt2.text
        merged = merged:gsub(":%s*", " ")
        merged = merged:gsub("%s+$", "")
        table.insert(out, pandoc.Str(merged))
        i = i + 3
        -- 题名与编号同串（"图1: 题名首词"）时吸收其后的空格元素避免双空格；
        -- 编号后即结束（"图1"）时保留其后的空格元素作编号与题名的分隔
        if merged:find(" ", 1, true) and inlines[i] then
          local after = inlines[i]
          if after.t == "Space"
            or (after.t == "Str" and is_space_str(after.text))
          then
            i = i + 1
          end
        end
      -- 形态 4：Str 以空格/nbsp 结尾（"图\xa0"），下一 Str 数字开头（"1"）—— 正文引用
      elseif nxt and nxt.t == "Str" and is_numbered(nxt.text) then
        local body, stripped = strip_tail_space(cur.text)
        if stripped and is_label_ended(body) then
          table.insert(out, pandoc.Str(body))
          i = i + 1
        else
          table.insert(out, pandoc.Str(clean_text(cur.text)))
          i = i + 1
        end
      -- 形态 4b：Str 以空格/nbsp 结尾，下一个是 Link（pandoc-crossref 把编号
      -- 包成指向图/表锚点的超链接），Link 内容首个 Str 为数字 —— 同样去尾空格
      -- 注意：lua 里访问 Link 内容要用语义属性 .content（.c[2] 不可靠）
      elseif nxt and nxt.t == "Link" and nxt.content and #nxt.content > 0
        and nxt.content[1].t == "Str" and is_numbered(nxt.content[1].text)
      then
        local body, stripped = strip_tail_space(cur.text)
        if stripped and is_label_ended(body) then
          table.insert(out, pandoc.Str(body))
        else
          table.insert(out, pandoc.Str(clean_text(cur.text)))
        end
        i = i + 1
      else
        table.insert(out, pandoc.Str(clean_text(cur.text)))
        i = i + 1
      end
    -- 形态 2：独立空格 Str 夹在"…图"与"数字…"之间
    elseif cur.t == "Str" and is_space_str(cur.text)
      and #out > 0 and out[#out].t == "Str" and is_label_ended(out[#out].text)
      and nxt and nxt.t == "Str" and is_numbered(nxt.text)
    then
      i = i + 1
    -- 形态 3：Space 元素夹在"…图"与"数字…"之间
    elseif cur.t == "Space"
      and #out > 0 and out[#out].t == "Str" and is_label_ended(out[#out].text)
      and nxt and nxt.t == "Str" and is_numbered(nxt.text)
    then
      i = i + 1
    else
      table.insert(out, cur)
      i = i + 1
    end
  end
  return out
end

-- 遍历文档中所有 inline 容器（正文段落、图题、表题、引用等）
function Inlines(inlines)
  return squeeze(inlines)
end

-- 关键：pandoc-crossref 渲染的正文引用文本藏在 Cite 元素的第二字段
-- （citation rendering inlines）里，Inlines 回调不会深入 Cite 内部，
-- 必须单独处理，否则 "（图\xa01）" 的 nbsp 永远漏网。
function Cite(el)
  if el.c and type(el.c) == "table" and el.c[2] then
    el.c[2] = squeeze(el.c[2])
  end
  return el
end

-- pandoc 3.x 的 Figure 长图题
function Figure(fig)
  if type(fig.caption) == "table" and #fig.caption > 0 then
    fig.caption = squeeze(fig.caption)
  elseif type(fig.caption) == "userdata" then
    -- 单 Inline 形态的 caption，跳过（罕见）
  end
  return fig
end
