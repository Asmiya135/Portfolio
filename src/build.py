import random, re, html, pathlib
SRC = pathlib.Path(__file__).parent
OUT = SRC.parent / "index.html"
css = (SRC / "style.css").read_text(encoding="utf-8")
body = (SRC / "body.html").read_text(encoding="utf-8")
js = (SRC / "app.js").read_text(encoding="utf-8")
R = random.Random(135)

def rep(a, b):
    global body
    assert body.count(a) == 1, a[:70]
    body = body.replace(a, b)

# ---------- skills board ----------
SK = [("LANGUAGES", ["Python", "Java", "C++", "JavaScript", "SQL"]),
      ("FRAMEWORKS", ["FastAPI", "Flask", "Node.js", "REST APIs", "React.js", "Next.js"]),
      ("DATABASES", ["PostgreSQL", "MySQL", "MongoDB", "Neo4j", "Pinecone", "Chroma"]),
      ("AI / ML", ["TensorFlow", "PyTorch", "LangChain", "LangGraph", "RAG", "FAISS", "MCP", "Prompt Engineering"]),
      ("CLOUD & TOOLS", ["AWS", "GCP", "Docker", "Git", "OAuth 2.0"]),
      ("DATA & ANALYTICS", ["SAP Analytics Cloud", "Data Modeling", "Dashboarding"])]
COL = [("var(--yellow)", "var(--ink)"), ("var(--white)", "var(--ink)"), ("var(--red)", "var(--white)"), ("var(--ink)", "var(--yellow)"), ("var(--peri2)", "var(--ink)")]
out = []
k = 0
for g, items in SK:
    st = []
    for j, it in enumerate(items):
        bg, fc = COL[k % len(COL)]; k += 1
        rot = round(R.uniform(-4, 4), 1)
        st.append(f'<span data-r="slap" style="--rot:{rot}deg;--bgc:{bg};--fc:{fc};--d:{j*0.06:.2f}s">{html.escape(it)}</span>')
    out.append(f'<div class="grp"><h4>{html.escape(g)}</h4><div class="stk">{"".join(st)}</div></div>')
rep('<div class="board" id="board"></div>', '<div class="board" id="board">' + "".join(out) + '</div>')

# ---------- rack covers ----------
ISS = [("i1", "#01", "PROMPT OPTIMIZER", "VS. TOKEN BLOAT", "v-bloat", "#F8DE3F", "#6A2BA6", "MCP · CLOUD RUN", -3, ""),
       ("i2", "#02", "SAARTHI", "VS. RED TAPE", "v-tape", "#FBE9D8", "#EC3B3B", "NEO4J · 23+ LANGUAGES", 2, ""),
       ("i3", "#03", "CREATOR CREW", "VS. THE GRIND", "v-grind", "#8C96F0", "#F8DE3F", "7 AGENTS · 1 DAG", -2, ""),
       ("i4", "#04", "ELDERCARE AI", "VS. THE SILENT HOUR", "v-silent", "#BCC1F8", "#FFFCF4", "OPENCV · TWILIO", 3, ""),
       ("i5", "#05", "HAZARD DETECTION", "VS. THE POTHOLE", "v-pot", "#4a4858", "#F8DE3F", "YOLO · MIDAS · MQTT", -2, ""),
       ("se", "SPECIAL", "IEEE EDITION", "VS. THE POISONERS", "v-poison", "", "#FFFCF4", "ACCEPTED · AI-SIIS 2026", 2, " gold")]
cov = []
for sid, n, t, vs, v, bg, t2, foot, rot, cls in ISS:
    style = f"--ct:{rot}deg;--ct2:{t2};" + (f"--cb:{bg};background-image:var(--halftone);" if bg else "")
    cov.append(f'<a class="cov{cls}" href="#{sid}" data-jump="{sid}" style="{style}" aria-label="Issue {n}: {t.title()}, {vs.title()}">'
               f'<div class="ctop"><b>ASMIYA</b><span>ISSUE {n}</span></div><h3>{t}</h3><span class="vs">{vs}</span>'
               f'<svg class="v" viewBox="0 0 200 200" aria-hidden="true"><use href="#{v}"/></svg>'
               f'<div class="cfoot"><span>{foot}</span><i></i></div></a>')
rep('<div class="track" id="track"></div>', '<div class="track" id="track">' + "".join(cov) + '</div>')

# ---------- crew + pipeline ----------
CREW = [("SCOUT", "#F8DE3F"), ("SCRIPTER", "#EC3B3B"), ("STORYBOARD", "#8C96F0"), ("SYNCER", "#FFFCF4"), ("AUDIO", "#FF9F1C"), ("DUBBER", "#BCC1F8"), ("RISK", "#B81F2B")]
crew = "".join(f'<div><svg viewBox="0 0 60 80" style="color:{c}" aria-hidden="true"><use href="#crew"/></svg><span>{nm}</span></div>' for nm, c in CREW)
rep('<div class="crew" id="crew"></div>', '<div class="crew" id="crew" aria-label="Seven agents: scout, scripter, storyboard, syncer, audio, dubber and risk">' + crew + '</div>')
labels = ["SCRIPT", "2", "3", "4", "RISK", "6", "7", "DUB"]
rep('<div class="pipe" id="pipe"><span class="can" aria-hidden="true"></span></div>',
    '<div class="pipe" id="pipe" aria-label="Eight-stage pipeline from script to dubbing">' + "".join(f"<i>{l}</i>" for l in labels) + '<span class="can" aria-hidden="true"></span></div>')

# ---------- film strip ----------
K = {0, 4, 5, 6, 11, 12, 15}
rep('<div class="film" id="film" aria-hidden="true"></div>', '<div class="film" id="film" aria-hidden="true">' + "".join(f'<i class="{"k" if i in K else ""}"></i>' for i in range(16)) + '</div>')

# ---------- crowd ----------
crowd = "".join(f'<i style="--i:{i}" class="{"y" if R.random()<.12 else ""}"></i>' for i in range(300))
rep('<div class="crowd" id="crowd" aria-hidden="true"></div>', '<div class="crowd" id="crowd" aria-hidden="true">' + crowd + '</div>')

# ---------- flipbook ----------
fb = "".join(f'<div class="pg" style="--i:{i};--h:{30+i*11}%"><b>SAC DASHBOARD · PAGE {i+1} / 6</b><i></i><i></i><i></i></div>' for i in range(6))
rep('<div class="flipbook" aria-label="A six-page SAC dashboard flipping" role="img" id="flipbook"></div>', '<div class="flipbook" aria-label="A six-page SAC dashboard flipping" role="img" id="flipbook">' + fb + '</div>')

# ---------- saarthi graph ----------
cit = (60, 125); attrs = [("Age", 190, 38), ("Income", 190, 98), ("State", 190, 158), ("Occupation", 190, 218)]
rules = (335, 125); sch = [("Scheme", 462, 48), ("Eligible!", 462, 125), ("Scheme", 462, 202)]
g = []
for _, x, y in attrs:
    g.append(f'<path class="e" d="M{cit[0]} {cit[1]}L{x} {y}"/><path class="e" d="M{x} {y}L{rules[0]} {rules[1]}"/>')
for _, x, y in sch:
    g.append(f'<path class="e" d="M{rules[0]} {rules[1]}L{x} {y}"/>')
g.append(f'<path class="hop" pathLength="1" d="M{cit[0]} {cit[1]}L190 98L{rules[0]} {rules[1]}L462 125"/>')
g.append(f'<circle cx="{cit[0]}" cy="{cit[1]}" r="26" fill="#F8DE3F"/><text x="{cit[0]}" y="{cit[1]+44}" text-anchor="middle">Citizen</text>')
for nm, x, y in attrs:
    g.append(f'<circle cx="{x}" cy="{y}" r="15" fill="#BCC1F8"/><text x="{x+22}" y="{y+4}">{nm}</text>')
g.append(f'<circle cx="{rules[0]}" cy="{rules[1]}" r="22" fill="#8C96F0"/><text x="{rules[0]}" y="{rules[1]+40}" text-anchor="middle">Eligibility rules</text>')
for nm, x, y in sch:
    fill = "#EC3B3B" if nm == "Eligible!" else "#FFFCF4"
    g.append(f'<circle cx="{x}" cy="{y}" r="{20 if nm=="Eligible!" else 14}" fill="{fill}"/><text x="{x}" y="{y+(38 if nm=="Eligible!" else 30)}" text-anchor="middle">{nm}</text>')
rep('<svg class="graph" id="graph" viewBox="0 0 520 250" role="img" aria-label="Knowledge graph: a citizen\'s age, income, state and occupation connect through a category to an eligible scheme"></svg>',
    '<svg class="graph" id="graph" viewBox="0 0 520 250" role="img" aria-label="Knowledge graph: a citizen\'s age, income, state and occupation connect through eligibility rules to a matched scheme">' + "".join(g) + '</svg>')

# ---------- KPI tree ----------
t = ['<rect x="180" y="10" width="160" height="34" fill="#F8DE3F" stroke="#17142F" stroke-width="3"/><text x="260" y="32" text-anchor="middle" style="font-size:14px">ROI &amp; ENGAGEMENT</text>']
cats = [50 + i * 84 for i in range(6)]
leaves_per = [5, 4, 4, 5, 4, 4]
lid = 0
for ci, cx in enumerate(cats):
    t.append(f'<path pathLength="1" d="M260 44C260 80 {cx} 80 {cx} 112"/>')
    n = leaves_per[ci]
    for j in range(n):
        lx = cx - (n - 1) * 8 + j * 16
        ly = 200 + (j % 2) * 26
        t.append(f'<path pathLength="1" d="M{cx} 126L{lx} {ly}" style="stroke-width:1.5"/>')
        t.append(f'<circle cx="{lx}" cy="{ly}" r="6" fill="{"#8C96F0" if lid%3 else "#EC3B3B"}" stroke="#17142F" stroke-width="2" style="--o:{0.55+lid*0.015:.3f}"/>')
        lid += 1
    t.append(f'<circle cx="{cx}" cy="126" r="15" fill="#FFFCF4" stroke="#17142F" stroke-width="3" style="--o:{0.35+ci*0.05:.2f}"/><text x="{cx}" y="131" text-anchor="middle">{ci+1}</text>')
t.append(f'<text x="260" y="270" text-anchor="middle">6 CATEGORIES · {lid} KPIS · 4 TEAMS, ONE SET OF DEFINITIONS</text>')
rep('<svg class="tree" id="tree" viewBox="0 0 520 280" role="img" aria-label="KPI tree: ROI and engagement split into six categories and 25 or more KPIs, with four teams\' definitions merged into one"></svg>',
    '<svg class="tree" id="tree" viewBox="0 0 520 280" role="img" aria-label="KPI tree: ROI and engagement split into six categories and 26 KPIs, with four teams aligned on one set of definitions">' + "".join(t) + '</svg>')

# ---------- skylines ----------
def skyline(w=1600, base=320, far="#2b1a63", near="#1a1240", win="#F8DE3F", sea=True, rr=None):
    rr = rr or random.Random(7)
    g = []
    x = 0
    while x < w:
        bw = 30 + rr.random() * 60; bh = 60 + rr.random() * 140
        g.append(f'<rect x="{x:.0f}" y="{base-bh:.0f}" width="{bw:.0f}" height="{bh:.0f}" fill="{far}"/>')
        x += bw + rr.random() * 8
    if sea:
        sx = w * .64; dy = base - 70
        g.append(f'<path d="M{w*.44:.0f} {dy}H{w}" stroke="{near}" stroke-width="8"/>')
        for px in (sx, sx + 190):
            g.append(f'<path d="M{px-14:.0f} {dy}L{px:.0f} {dy-150}L{px+14:.0f} {dy}" fill="none" stroke="{near}" stroke-width="9"/>')
            for i in range(1, 8):
                yy = dy - 150 + i * 8
                g.append(f'<path d="M{px:.0f} {yy}L{px-30-i*15:.0f} {dy}M{px:.0f} {yy}L{px+30+i*15:.0f} {dy}" stroke="{near}" stroke-width="1.6"/>')
    x = 0
    while x < w:
        bw = 40 + rr.random() * 70; bh = 40 + rr.random() * 120
        if sea and w * .5 < x < w * .82:
            x += bw; continue
        g.append(f'<rect x="{x:.0f}" y="{base-bh:.0f}" width="{bw:.0f}" height="{bh:.0f}" fill="{near}"/>')
        wy = base - bh + 10
        while wy < base - 8:
            wx = x + 6
            while wx < x + bw - 8:
                if rr.random() < .2:
                    g.append(f'<rect x="{wx:.0f}" y="{wy:.0f}" width="5" height="7" fill="{win}" opacity="{.5+rr.random()*.5:.2f}"/>')
                wx += 12
            wy += 14
        x += bw + rr.random() * 6
    g.append(f'<path d="M{w*.18:.0f} {base}v-70h64v70z" fill="{near}"/><path d="M{w*.18-4:.0f} {base-70}a36 36 0 0 1 72 0z" fill="{near}"/>')
    g.append(f'<rect x="{w*.3:.0f}" y="{base-210}" width="28" height="210" fill="{near}"/><path d="M{w*.3-4:.0f} {base-210}l18-34 18 34z" fill="{near}"/><circle cx="{w*.3+14:.0f}" cy="{base-178}" r="8" fill="{win}"/>')
    return "".join(g)

rep('<svg class="sky" id="sky" viewBox="0 0 1600 320" preserveAspectRatio="xMidYMax slice" aria-hidden="true"></svg>',
    '<svg class="sky" id="sky" viewBox="0 0 1600 320" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' + skyline(rr=random.Random(11)) + '</svg>')
rep('<svg class="city" id="city1" viewBox="0 0 1600 320" preserveAspectRatio="xMidYMax slice" aria-hidden="true"></svg>',
    '<svg class="city" id="city1" viewBox="0 0 1600 320" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' + skyline(far="#3a2580", near="#130e33", rr=random.Random(21)) + '</svg>')

# ---------- footer scene ----------
sc = ['<circle cx="1260" cy="130" r="54" fill="#FFF08A"/><circle cx="1260" cy="130" r="80" fill="#FFF08A" opacity=".1"/><circle cx="1260" cy="130" r="112" fill="#FFF08A" opacity=".05"/>']
rs = random.Random(5)
for _ in range(60):
    sc.append(f'<circle cx="{rs.random()*1600:.0f}" cy="{rs.random()*330:.0f}" r="{rs.choice([1,1.5,2])}" fill="#FFFCF4" opacity="{.4+rs.random()*.6:.2f}"/>')
sc.append('<g class="city2">' + skyline(base=480, far="#3a2580", near="#24195e", rr=random.Random(33)).replace('M2560', 'M2560') + '</g>')
sc.append('<rect x="0" y="478" width="1600" height="14" fill="#17142F"/>')
for px in range(40, 1600, 160):
    sc.append(f'<rect x="{px}" y="492" width="14" height="140" fill="#17142F"/>')
cars = []
for c in range(7):
    x0 = c * 206
    cars.append(f'<rect x="{x0}" y="426" width="200" height="50" rx="6" fill="#8b1e2d" stroke="#17142F" stroke-width="3"/>'
                f'<rect x="{x0}" y="452" width="200" height="8" fill="#F8DE3F"/>'
                + "".join(f'<rect x="{x0+14+i*30}" y="434" width="18" height="13" rx="2" fill="#FFF08A"/>' for i in range(6))
                + f'<rect x="{x0+90}" y="434" width="20" height="40" fill="#5c1320"/>')
sc.append('<g class="train">' + "".join(cars) + '</g>')
sc.append('<path d="M0 560Q400 610 800 570T1600 560" fill="none" stroke="#17142F" stroke-width="2"/>')
for i in range(0, 33):
    x = i * 50; y = 560 + 22 * __import__("math").sin(i / 32 * 6.283) * .6 + (12 if i % 2 else 6)
    sc.append(f'<circle cx="{x}" cy="{y:.0f}" r="6" fill="{["#F8DE3F","#EC3B3B","#8C96F0"][i%3]}"/>')
sc.append('<g transform="translate(150 470)"><rect x="0" y="40" width="190" height="150" fill="#1d1450" stroke="#17142F" stroke-width="4"/><ellipse cx="95" cy="40" rx="95" ry="22" fill="#2c2070" stroke="#17142F" stroke-width="4"/><path d="M20 190v40M170 190v40" stroke="#17142F" stroke-width="8"/><path d="M20 80h150M20 120h150M20 160h150" stroke="#2c2070" stroke-width="4"/></g>')
sc.append('<path d="M470 600V410M470 430l-30-20M470 430l30-20M470 470l-24-16M470 470l24-16" stroke="#17142F" stroke-width="5" fill="none"/>')
sc.append('<g class="gtr" transform="translate(360 470) rotate(-14)" style="cursor:pointer"><use href="#guitar" width="72" height="156"/></g>')
rep('<svg class="scene" id="scene" viewBox="0 0 1600 720" preserveAspectRatio="xMidYMax slice" aria-hidden="true"></svg>',
    '<svg class="scene" id="scene" viewBox="0 0 1600 720" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' + "".join(sc) + '</svg>')

# ---------- barcode ----------
bars = []; x = 2
rb = random.Random(27)
while x < 106:
    w = rb.choice([1, 1, 2, 3])
    bars.append(f'<rect x="{x}" y="0" width="{w}" height="34" fill="#17142F"/>')
    x += w + rb.choice([1, 2, 2, 3])
rep('<svg id="bars" viewBox="0 0 110 34"></svg>', '<svg id="bars" viewBox="0 0 110 34">' + "".join(bars) + '</svg>')

# ---------- counters show real values without JS ----------
def cnt(m):
    v = float(m.group(2)); dec = int(m.group(3) or 0); suf = m.group(4) or ""
    s = f"{v:.{dec}f}" if dec else f"{int(v):,}"
    return m.group(1) + s + suf + "</b>"
body = re.sub(r'(<b data-count="([\d.]+)"(?: data-dec="(\d)")?(?: data-suf="([^"]*)")?>)0</b>', cnt, body)

head = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Asmiya Sayyad Comics</title>
<meta name="description" content="ASMIYA #01: the comic-book portfolio of Asmiya Sayyad, AI engineer and full-stack builder from Mumbai. Five projects, five villains, one IEEE paper.">
<meta name="theme-color" content="#120E2B">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='10' fill='%23F8DE3F' stroke='%2317142F' stroke-width='6'/%3E%3Ctext x='32' y='45' font-family='Impact' font-size='36' text-anchor='middle' fill='%23EC3B3B'%3EA%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;800&family=Bangers&family=Bowlby+One&family=Comic+Neue:wght@700&display=swap" rel="stylesheet">
<style>
'''
doc = head + css + "\n</style>\n</head>\n<body>\n" + body + "\n<script>\n" + js + "\n</script>\n</body>\n</html>\n"
OUT.write_text(doc, encoding="utf-8")
print("wrote", OUT, len(doc) // 1024, "KB")
