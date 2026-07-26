-- Convert raw HTML <sub>...</sub> and <sup>...</sup> markers in Markdown
-- into Pandoc-native Subscript/Superscript inline nodes.
--
-- Why this filter exists:
-- Pandoc's DOCX writer may discard raw HTML tags while keeping their text,
-- causing CO<sub>2</sub> to become baseline "CO2". Native Pandoc script
-- nodes are written as real Word w:vertAlign formatting.

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
  return transform(inlines)
end
