from pathlib import Path
import json
root=Path(__file__).resolve().parent
s=(root/"src_main.html").read_text(encoding="utf-8")
pairs={"/*V4_STYLES*/":root/"assets/styles.css","/*V4_MODEL*/":root/"assets/model.js","/*V4_APP*/":root/"assets/app.js","/*V4_STATS*/":root/"data/official_statistics.json"}
for token,path in pairs:
    value=path.read_text(encoding="utf-8")
    if token=="/*V4_STATS*/":value=json.dumps(json.loads(value),ensure_ascii=False,separators=(",",":")).replace("</","<\\/")
    assert token in s, token
    s=s.replace(token,value)
(root/"site_core.html").write_text(s,encoding="utf-8")
print("Core HTML ready; run build_standalone.py for offline version.")
