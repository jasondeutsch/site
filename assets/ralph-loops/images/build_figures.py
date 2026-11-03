"""Generate original, editable architecture figures. Standard library only."""
from pathlib import Path
from html import escape
ROOT = Path(__file__).resolve().parent
BG = '#101827'
INK = '#e8eef8'
MUTED = '#a7b8ce'
TEAL = '#55dbc1'
BLUE = '#86b5ff'
ORANGE = '#ffbd7a'


def figure(name, title, subtitle, height, body):
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="{height}" viewBox="0 0 1200 {height}" role="img" aria-labelledby="title desc">
<title id="title">{escape(title)}</title><desc id="desc">{escape(subtitle)}</desc>
<defs><marker id="arrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9" fill="{MUTED}"/></marker></defs>
<rect width="1200" height="{height}" rx="18" fill="{BG}"/>
<g font-family="Arial, Helvetica, sans-serif"><text x="44" y="55" fill="{INK}" font-size="29" font-weight="700">{escape(title)}</text><text x="44" y="88" fill="{MUTED}" font-size="17">{escape(subtitle)}</text>{body}</g></svg>'''
    (ROOT / name).write_text(svg)


def box(x,y,w,h,title,lines,color=TEAL):
    text = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="#19263a" stroke="{color}" stroke-width="2"/><text x="{x+18}" y="{y+32}" fill="{color}" font-size="21" font-weight="700">{escape(title)}</text>'
    for i,line in enumerate(lines):
        text += f'<text x="{x+18}" y="{y+64+i*25}" fill="{INK}" font-size="17">{escape(line)}</text>'
    return text


def arrow(path, color=MUTED):
    return f'<path d="{path}" fill="none" stroke="{color}" stroke-width="2.3" marker-end="url(#arrow)"/>'


figure('01-two-loops.svg','Two loops, two different lifetimes','The outer controller resets the conversation. The repository and evidence survive.',600,
    box(45,135,290,150,'Outer controller',['Select one task','Set budgets and assemble input','Start a fresh agent session']) +
    box(415,135,355,150,'Inner agent loop',['Model → tools → observations','Repeat within this conversation','Return when this attempt ends'],BLUE) +
    box(850,135,300,150,'Independent verifier',['Run required acceptance checks','Bind results to artifact identity','Accept, retry, or stop'],ORANGE) +
    arrow('M335 210 H415') + arrow('M770 210 H850') +
    box(330,390,540,135,'Durable state',['Source, specifications, task plan, failure evidence','Reconstructed into the next conversation']) +
    arrow('M1000 285 V345 H190 V285') + arrow('M590 285 V390') +
    '<text x="330" y="560" fill="#a7b8ce" font-size="17">Continue only while work and budget remain</text>')

figure('02-memory.svg','What survives a fresh context','Conversation reset removes transient history; it does not undo work.',575,
    box(45,140,340,165,'Iteration n',['Prompt + selected evidence','Investigation and tool calls','Working hypotheses'],BLUE) +
    box(430,140,340,165,'Repository / state',['Code and specifications','Acceptance failures and logs','Task and attempt records']) +
    box(815,140,340,165,'Iteration n + 1',['New conversation','Read current artifacts','Reconstruct next action'],BLUE) +
    arrow('M385 225 H430') + arrow('M770 225 H815') +
    box(45,385,1110,125,'Carry forward evidence, not the entire transcript',['Retain: exact failing assertion, relevant paths, decisions and constraints.','Discard from active input: repeated logs, abandoned speculation, unrelated tool output.'],ORANGE))

figure('03-state-machine.svg','The controller owns the exit decision','An assistant report is a proposal. Passing required checks is acceptance evidence.',650,
    box(45,150,290,140,'Verify current files',['First failing task selected','All pass → complete'],ORANGE) +
    box(450,150,290,140,'Check admission',['Attempts and time remain?','Writer lock held?']) +
    box(855,150,290,140,'Run fresh attempt',['One task; bounded runtime','Save logs and revalidate'],BLUE) +
    arrow('M335 220 H450') + arrow('M740 220 H855') +
    arrow('M1000 150 V120 H190 V150') +
    '<text x="450" y="115" fill="#a7b8ce" font-size="14">Attempt returns successfully → reverify</text>' +
    box(45,440,290,125,'Complete',['Record content fingerprint','Reverify after a restart']) +
    box(450,440,290,125,'Stop for inspection',['Budget / no progress / error','Keep artifacts and evidence'],ORANGE) +
    arrow('M190 290 V440') + arrow('M595 290 V440') +
    arrow('M1000 290 V390 H790 V505 H740') +
    '<text x="205" y="385" fill="#a7b8ce" font-size="15">All pass</text>' +
    '<text x="610" y="385" fill="#a7b8ce" font-size="15">No budget</text>' +
    '<text x="875" y="380" fill="#a7b8ce" font-size="15">Error / timeout</text>')

figure('04-trust-boundaries.svg','Prompts describe policy; isolation enforces it','The included example separates responsibilities. Production isolation needs an execution boundary.',610,
    box(45,145,475,180,'Agent execution environment',['Writable: candidate source and local tests','Readable: selected requirements and feedback','No deployment credentials or host access'],BLUE) +
    box(680,145,475,180,'Controller / verifier environment',['Owns: checks, budgets, task definitions','Reads: candidate snapshot and tool outcomes','Records: evidence for that snapshot'],ORANGE) +
    arrow('M520 210 H680') + arrow('M680 275 H520') +
    '<text x="548" y="195" fill="#a7b8ce" font-size="15">snapshot</text><text x="548" y="305" fill="#a7b8ce" font-size="15">feedback</text>' +
    box(180,420,840,125,'Review / integration boundary',['Passing an implementation loop produces a reviewable candidate.','Merging or deploying uses separate credentials and release rules.']))
print('Generated four SVG figures')
