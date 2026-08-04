#!/usr/bin/env python3
"""
Generate a beautiful, Apple-aesthetic EPUB for "Before We Became Memories"
"""
import zipfile, os, textwrap

OUT = "/Users/jay/Downloads/before-we-became-memories/BeforeWeBecameMemories.epub"

# ── CSS ──────────────────────────────────────────────────────────────────────
STYLE = """
@charset "UTF-8";

/* ── Reset ── */
* { margin: 0; padding: 0; box-sizing: border-box; }

/* ── Page ── */
body {
  font-family: "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif;
  font-size: 1em;
  line-height: 1.75;
  color: #1a1612;
  background: #fffdf8;
  -epub-hyphens: auto;
  hyphens: auto;
}

/* ── Cover ── */
.cover-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  text-align: center;
  padding: 4em 2em;
  background: #fffdf8;
}

.cover-eyebrow {
  font-size: 0.65em;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #b89a5a;
  margin-bottom: 2.5em;
}

.cover-title {
  font-size: 2.4em;
  font-weight: normal;
  font-style: italic;
  line-height: 1.25;
  color: #1a1612;
  margin-bottom: 0.5em;
}

.cover-rule {
  width: 3em;
  height: 1px;
  background: #b89a5a;
  margin: 1.5em auto;
}

.cover-sub {
  font-size: 0.8em;
  color: #6b5c45;
  font-style: italic;
  max-width: 26em;
  margin: 0 auto;
  line-height: 1.6;
}

.cover-emoji {
  font-size: 1.8em;
  margin-top: 3em;
  letter-spacing: 0.3em;
}

/* ── Letter / Intro ── */
.letter-page {
  padding: 4em 3em;
}

.letter-salutation {
  font-size: 1.3em;
  font-style: italic;
  color: #b89a5a;
  margin-bottom: 1.5em;
}

.letter-body p {
  margin-bottom: 1.1em;
  color: #2b241c;
}

.letter-signoff {
  margin-top: 2em;
  font-style: italic;
  font-size: 1.1em;
  color: #b89a5a;
}

/* ── Chapter opener ── */
.chapter-page {
  padding: 5em 3em 3em;
}

.chapter-num {
  display: block;
  font-size: 0.6em;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #b89a5a;
  margin-bottom: 1em;
}

.chapter-title {
  font-size: 1.9em;
  font-weight: normal;
  font-style: italic;
  line-height: 1.2;
  color: #1a1612;
  margin-bottom: 0.6em;
}

.chapter-rule {
  width: 2em;
  height: 1px;
  background: #c9b892;
  margin: 1.4em 0;
}

.chapter-body p {
  margin-bottom: 1em;
  color: #2b241c;
}

/* ── Insert pages (Things I'll Never Forget) ── */
.insert-page {
  padding: 4em 3em;
  text-align: center;
}

.insert-title {
  font-size: 1.4em;
  font-style: italic;
  color: #1a1612;
  margin-bottom: 0.3em;
}

.insert-sub {
  font-size: 0.7em;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #b89a5a;
  margin-bottom: 2.5em;
}

.insert-rule {
  width: 2.5em;
  height: 1px;
  background: #c9b892;
  margin: 0 auto 2em;
}

.insert-list {
  list-style: none;
  text-align: center;
}

.insert-list li {
  font-size: 0.95em;
  color: #2b241c;
  font-style: italic;
  padding: 0.45em 0;
  border-bottom: 1px solid #ece8de;
}

.insert-list li:last-child {
  border-bottom: none;
}

/* ── Ending ── */
.ending-page {
  padding: 4em 3em;
}

.ending-title {
  font-size: 1.7em;
  font-style: italic;
  color: #1a1612;
  margin-bottom: 1.5em;
}

.ending-body p {
  margin-bottom: 1.1em;
  color: #2b241c;
}

.ending-close {
  margin-top: 2.5em;
  text-align: center;
  font-size: 1.5em;
  letter-spacing: 0.3em;
}

.ending-maliye {
  text-align: center;
  margin-top: 1.5em;
  font-size: 1.1em;
  font-style: italic;
  color: #b89a5a;
}

/* ── Ornament divider ── */
.ornament {
  text-align: center;
  font-size: 0.9em;
  color: #c9b892;
  margin: 1.8em 0;
  letter-spacing: 0.2em;
}
"""

# ── Chapters ────────────────────────────────────────────────────────────────
def xhtml(title, body, uid):
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>{title}</title>
  <link rel="stylesheet" type="text/css" href="../styles/book.css"/>
</head>
<body>
{body}
</body>
</html>"""

def chapter(num, title, paragraphs, uid):
    num_str = f"<span class='chapter-num'>{num}</span>" if num else ""
    paras = "\n".join(f"<p>{p}</p>" for p in paragraphs)
    body = f"""<div class="chapter-page">
  {num_str}
  <h1 class="chapter-title">{title}</h1>
  <div class="chapter-rule"></div>
  <div class="chapter-body">
    {paras}
  </div>
</div>"""
    return xhtml(title, body, uid)

def insert_page(title, sub, items, uid):
    lis = "\n".join(f"<li>{i}</li>" for i in items)
    body = f"""<div class="insert-page">
  <h1 class="insert-title">{title}</h1>
  <p class="insert-sub">{sub}</p>
  <div class="insert-rule"></div>
  <ul class="insert-list">
    {lis}
  </ul>
</div>"""
    return xhtml(title + " — " + sub, body, uid)

# Cover
COVER_BODY = """<div class="cover-page">
  <p class="cover-eyebrow">a memory, preserved</p>
  <h1 class="cover-title">Before We<br/>Became Memories</h1>
  <div class="cover-rule"></div>
  <p class="cover-sub">The story of two people who never planned to become each other&#8217;s favourite habit.</p>
  <p class="cover-emoji">&#x1F423; &#x1F33B;</p>
</div>"""

# Letter
LETTER_BODY = """<div class="letter-page">
  <p class="letter-salutation">Hi Honey. &#x2764;&#xFE0F;</p>
  <div class="letter-body">
    <p>If you&#8217;re reading this, you&#8217;ve probably smiled already &#8212; because you know this is exactly something I&#8217;d do.</p>
    <p>This isn&#8217;t a goodbye letter. It isn&#8217;t my way of changing your mind. And it definitely isn&#8217;t meant to make you cry.</p>
    <p>This is simply our little world, pressed between pages before time quietly changes the details.</p>
  </div>
  <p class="letter-signoff">So&#8230; <em>Su kare che?</em></p>
</div>"""

# Ending
ENDING_BODY = """<div class="ending-page">
  <h1 class="ending-title">After The Last Page&#8230;</h1>
  <div class="ending-body">
    <p>If you&#8217;ve reached here&#8230; thank you.</p>
    <p>Not just for reading this book. But for living every page of it with me.</p>
    <p>While making this, I realised that memories aren&#8217;t made from grand gestures. They&#8217;re made from tiny moments that quietly become part of your everyday life. A morning call. A random Snap. A silly joke. A three-hour conversation that felt like thirty minutes. Waiting for your notification without even realising you were waiting.</p>
    <p>You became a habit I never wanted to break.</p>
    <div class="ornament">&#10022; &#10022; &#10022;</div>
    <p>This isn&#8217;t an ending. It&#8217;s just the first time we stopped to notice how beautiful the middle already is.</p>
    <p>I&#8217;ve seen you from closer than most people ever will. I&#8217;ve seen the version that laughs until her stomach hurts, blushes for no reason, says &#8220;Su nathi&#8221; with the cutest smile, spins around on her chair, and somehow makes an ordinary day feel special just by being in it.</p>
    <p>Thank you for trusting me with that version of you.</p>
    <div class="ornament">&#10022; &#10022; &#10022;</div>
    <p>If one day you hear someone say &#8220;Ho ka,&#8221; unwrap a KitKat, lose an earring, see a sunflower, eat terrible pizza, walk on a beach at midnight, or someone casually asks you, &#8220;Su kare che?&#8221;&#8230;</p>
    <p>I hope you smile. Not just because of what this was &#8212; but because of what it still is.</p>
    <p>You&#8217;ll always be my &#x1F423;&#x1F33B;. And no matter how many chapters life writes after this one&#8230; this will always remain one of my favourites.</p>
  </div>
  <p class="ending-close">&#x1F423; &#x1F33B;</p>
  <p class="ending-maliye">Maliye. &#x2764;&#xFE0F;</p>
</div>"""

chapters = [
    ("cover",    "Cover",                     xhtml("Cover", COVER_BODY, "cover")),
    ("letter",   "Before You Read",           xhtml("Before You Read", LETTER_BODY, "letter")),
    ("ch01",     "01 · The Wrong Delivery",   chapter("01", "The Wrong Delivery", [
        "I had jokingly asked you to send me KitKats, never expecting you&#8217;d actually do it. That one small gesture made me feel cared for in a way I didn&#8217;t expect.",
        "The chocolates never reached me though. Instead, the parcel turned into condoms and lotion, and half the office had already opened it before I even got there. I still laugh thinking about how awkward it was trying to explain that it was actually from you.",
        "Looking back now, I honestly couldn&#8217;t have asked for a better beginning. It was messy, embarrassing, and perfectly us.",
    ], "ch01")),
    ("ch02",     "02 · I'm In",               chapter("02", "&#8220;I&#8217;m In.&#8221;", [
        "Such a small conversation. Just three words. Yet somehow, those three words quietly changed my everyday life.",
        "If someone had told me that one reply would become one of my favourite memories, I would&#8217;ve laughed. Today, it still makes me smile.",
    ], "ch02")),
    ("ch03",     "03 · Instagram Wasn't Enough", chapter("03", "Instagram Wasn&#8217;t Enough", [
        "It started with Instagram DMs, random replies, and silly conversations. Somehow, those messages slowly turned into hours of talking without us even realising how late it had become.",
        "I don&#8217;t remember every conversation we had. I just remember never wanting them to end.",
        "Somewhere along the way, talking to you stopped being part of my day and became the best part of it.",
    ], "ch03")),
    ("ch04",     "04 · Favourite Notification", chapter("04", "Favourite Notification", [
        "There was a time when checking my phone was just a habit. Then you came along, and it quietly became checking if you had messaged me.",
        "Every notification makes me hope it&#8217;s you. Every time your name appears, my mood somehow gets better.",
        "I never planned for someone to become my favourite notification, but you did &#8212; and honestly, I never want that to change.",
    ], "ch04")),
    ("ch05",     "05 · Su Kare Che?",          chapter("05", "Su Kare Che?", [
        "&#8220;Su kare che?&#8221;",
        "&#8220;Su nathi :)&#8221;",
        "I don&#8217;t know why, but I love the way you say it. You never say &#8220;Kai nathi.&#8221; It&#8217;s always &#8220;Su nathi,&#8221; and somehow it&#8217;s one of those tiny things I look forward to hearing every day.",
        "Funny how the smallest habits become the biggest memories.",
    ], "ch05")),
    ("ins01",    "Things I'll Never Forget — I", insert_page("Things I&#8217;ll Never Forget", "About You", [
        "The way you said &#8220;Ho ka.&#8221;",
        "The way you laughed holding your stomach.",
        "How your cheeks turned pink when you blushed.",
        "Your spinning chair.",
        "The excitement in your voice when we planned Mumbai.",
        "The way you tried speaking Gujarati.",
        "Your love for mangoes and salads.",
        "The little baby version of you that only I got to know.",
    ], "ins01")),
    ("ch06",     "06 · The Baby Nobody Else Saw", chapter("06", "The Baby Nobody Else Saw", [
        "Your blush. Your stomach-holding laugh. Your spinning chair.",
        "The little version of you that only I got to meet.",
        "You don&#8217;t show that side to anyone else, not even people who&#8217;ve known you for years. On calls you turn the camera away when you blush, like I don&#8217;t notice anyway.",
        "I always notice. I love noticing.",
    ], "ch06")),
    ("ch07",     "07 · One Joke That Became A Flight", chapter("07", "One Joke That Became A Flight", [
        "&#8220;Aaja Mumbai.&#8221;",
        "I don&#8217;t think either of us expected me to actually book the ticket.",
        "You said it like a joke, half expecting me to laugh it off.",
        "Instead I checked flights that same night, and by the next week I was already packing.",
    ], "ch07")),
    ("ch08",     "08 · Versova At Midnight",   chapter("08", "Versova At Midnight", [
        "Feet in the sand. Ocean. Silence. Us.",
        "We didn&#8217;t talk about anything important. We didn&#8217;t need to.",
        "Just walking beside you at midnight felt like enough of a plan.",
    ], "ch08")),
    ("ch09",     "09 · The ₹2,000 Pizza",      chapter("09", "The &#8377;2,000 Pizza", [
        "Probably the worst pizza we&#8217;ll ever eat. Still one of my favourite dinners.",
        "We kept eating it anyway, complaining between every bite.",
        "I don&#8217;t remember what we talked about that night, only that I didn&#8217;t want it to end.",
    ], "ch09")),
    ("ch10",     "10 · Sahara Star",            chapter("10", "Sahara Star", [
        "Movie. Sleep. Holding you. Quiet happiness.",
        "I stayed awake longer than I should have, just watching you sleep.",
        "It&#8217;s still one of the calmest nights I can remember.",
    ], "ch10")),
    ("ch11",     "11 · The Missing Earring",    chapter("11", "The Missing Earring", [
        "We searched everywhere and never found it.",
        "Maybe it decided to stay where one of our favourite memories lived. Somewhere in that room, it&#8217;s probably still there.",
    ], "ch11")),
    ("ch12",     "12 · Our First Hug",          chapter("12", "Our First Hug", [
        "Outside Orchid. The moment attraction quietly became attachment.",
        "Nothing dramatic happened, no music, no big buildup.",
        "I just remember thinking, clearly, that this had already turned into something else.",
    ], "ch12")),
    ("ch13",     "13 · Cold Hai Kya?",          chapter("13", "Cold Hai Kya?", [
        "Our secret language.",
        "It has nothing to do with weather. It means, drop the small talk, let&#8217;s actually talk.",
        "Nobody else knows what it means. That&#8217;s always the point.",
    ], "ch13")),
    ("ch14",     "14 · Camera",                 chapter("14", "Camera", [
        "&#8220;I&#8217;m watching.&#8221;",
        "No. Just checking if my favourite person is okay.",
        "I tell myself it&#8217;s not a big deal, just a quick glance between tasks.",
        "It&#8217;s never really about the camera. It&#8217;s always about you.",
    ], "ch14")),
    ("ch15",     "15 · Morning Started With You", chapter("15", "Morning Started With You", [
        "It is my favourite routine, and I wouldn&#8217;t trade it for anything.",
        "Some mornings you pick up half asleep and still try to talk.",
        "I never mind waiting those extra few minutes for you to properly wake up.",
    ], "ch15")),
    ("ins02",    "Things I'll Never Forget — II", insert_page("Things I&#8217;ll Never Forget", "About You", [
        "The way you said &#8220;cold hai kya&#8221; before anything serious.",
        "Falling asleep mid-sentence on our calls.",
        "The morning you picked up half asleep and still talked to me.",
        "Walking barefoot beside you at midnight.",
        "How you never let bad pizza ruin a good night.",
        "The earring we never found.",
        "Checking the camera just to see you smile.",
        "The version of you nobody else got to meet.",
    ], "ins02")),
    ("ch16",     "16 · Goodnight",              chapter("16", "Goodnight", [
        "Those calls where neither of us wants to hang up.",
        "We both say &#8220;okay bye&#8221; three or four times and still keep talking.",
        "Somehow the goodnight always takes longer than the actual conversation.",
    ], "ch16")),
    ("ch17",     "17 · Ho Ka",                  chapter("17", "Ho Ka", [
        "Marathi for &#8220;is it so,&#8221; and my favourite thing to tease you about.",
        "I still don&#8217;t know whether I love teasing you more, or hearing you laugh after it.",
        "Either way, I never get tired of hearing you say it.",
    ], "ch17")),
    ("ch18",     "18 · Healthy vs Junk",        chapter("18", "Healthy vs Junk", [
        "Salads. Mangoes. My junk food. Your lectures.",
        "We never agreed on a single meal, not once.",
        "Somehow it is one of the most consistent, most familiar arguments we have.",
    ], "ch18")),
    ("ch19",     "19 · Cab, Not Auto",           chapter("19", "Cab, Not Auto", [
        "&#8220;You should wear your pink shirt.&#8221; &#8220;Bring flowers.&#8221; &#8220;You can&#8217;t come like this, take a cab.&#8221;",
        "You never realised you were teaching me how to show up for someone properly.",
        "I still think of that pink shirt every time I get ready &#8212; and I miss your touch, your hands over it.",
    ], "ch19")),
    ("ch20",     "20 · The Sunflower",           chapter("20", "The Sunflower", [
        "&#x1F33B; A flower I never brought. A regret I&#8217;ll always remember.",
        "It is such a small thing to do, and I keep telling myself there&#8217;ll be a next time.",
        "I&#8217;ll keep this in my checkbox until next time.",
    ], "ch20")),
    ("ch21",     "21 · The Anklet",              chapter("21", "The Anklet", [
        "An anklet from Goa. One promise Goa never got to fulfil.",
        "I mean to get it, I really do, I just keep putting it off.",
        "Another small thing I owe you that I never followed through on.",
    ], "ch21")),
    ("ins03",    "Things I'll Never Forget — III", insert_page("Things I&#8217;ll Never Forget", "About You", [
        "Every &#8220;ho ka&#8221; I teased you about.",
        "Your lectures about salads and mangoes.",
        "The pink shirt you loved.",
        "The anklet I still owe you.",
        "The sunflower I never brought.",
        "Goodnights that never actually ended on time.",
        "How normal it felt to fight about small things with you.",
    ], "ins03")),
    ("ch22",     "22 · The Clinic Hug",          chapter("22", "The Clinic Hug", [
        "A bet. A promise.",
        "A hug that life never got around to giving us.",
        "Some plans just don&#8217;t happen, no matter how much you mean them at the time.",
        "This one&#8217;s still unfinished, and I&#8217;m the giddiest guy ever, so I&#8217;ll surely win this bet one day.",
    ], "ch22")),
    ("ch23",     "23 · Watching The Camera",     chapter("23", "Watching The Camera", [
        "I ain&#8217;t spying. I am missing you.",
        "Some days that is the closest I can get to actually being near you.",
        "A few seconds of watching you smile at something is enough to get through the day.",
    ], "ch23")),
    ("ch24",     "24 · Two Weeks of Delulu",      chapter("24", "Two Weeks of Delulu", [
        "For two whole weeks, I was living inside a dream I had built entirely by myself.",
        "A Mumbai halt. Thirty minutes. That&#8217;s all I needed. I spent days convincing myself it was possible &#8212; checked online, read every thread, calculated every minute like a case study.",
        "I wore my black outfit. Your favourite one. Crazy black jeans, black shirt, the whole thing. I made sure I looked like someone worth waiting half a day for.",
        "I remember standing there at that gate, thinking &#8212; any minute now, a princess is going to walk through that door.",
        "My eyes were already looking for you before I even landed.",
    ], "ch24")),
    ("ch25",     "25 · IndiGo Broke Me",          chapter("25", "IndiGo Broke Me", [
        "I landed thirty minutes early. Thirty whole minutes ahead of schedule &#8212; which honestly felt like a sign.",
        "The first thing I did was text you. &#8220;I&#8217;ve landed.&#8221;",
        "I tried everything. Asked every person I could find to just let me step out for ten minutes. That&#8217;s it. Ten minutes.",
        "IndiGo said no.",
        "And just like that, two weeks of hoping dried up in about thirty seconds. I went stunned. Couldn&#8217;t process it. All those plans, that outfit, those eyes &#8212; all of it, waiting for someone who was already waiting on the other side.",
        "You had taken half a day off. You had dressed like an absolute princess on that video call. And I was standing there, on the wrong side of a gate, not sure I even deserved to pick up the phone.",
        "I&#8217;m sorry for that one. I really am.",
    ], "ch25")),
    ("ch26",     "26 · God Was Just Making Us More Curious", chapter("26", "God Was Just Making Us More Curious", [
        "I think I understand it now. Or at least I&#8217;m telling myself I do.",
        "God has a habit of doing the exact opposite of what you&#8217;re hoping for &#8212; especially when it&#8217;s something that actually matters.",
        "Maybe that IndiGo gate existed for a reason. Maybe we weren&#8217;t quite ready for that moment yet. Maybe the universe decided our first real meeting deserved more than a ten-minute window at an airport terminal.",
        "So instead of giving us the hug, it made us wait. Made us more thirsty for it. Added a few more months of longing to the tab.",
        "And honestly? The next time I come, we&#8217;re going to want that one hug more than we&#8217;ve ever wanted anything.",
        "God is just keeping the interest running. &#x1F423;&#x1F33B;",
    ], "ch26")),
    ("ending",   "After The Last Page",          xhtml("After The Last Page", ENDING_BODY, "ending")),
]

# ── OPF ─────────────────────────────────────────────────────────────────────
def make_opf(chapters):
    items = "\n".join(
        f'    <item id="{uid}" href="text/{uid}.xhtml" media-type="application/xhtml+xml"/>'
        for uid, title, _ in chapters
    )
    spine = "\n".join(
        f'    <itemref idref="{uid}"/>'
        for uid, title, _ in chapters
    )
    toc_nav = "\n".join(
        f'      <li><a href="text/{uid}.xhtml">{title}</a></li>'
        for uid, title, _ in chapters
    )
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="uid">urn:uuid:bwbm-2025-001</dc:identifier>
    <dc:title>Before We Became Memories</dc:title>
    <dc:creator>Jay</dc:creator>
    <dc:language>en</dc:language>
    <meta property="dcterms:modified">2025-01-01T00:00:00Z</meta>
  </metadata>
  <manifest>
    <item id="css" href="styles/book.css" media-type="text/css"/>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
{items}
  </manifest>
  <spine>
{spine}
  </spine>
</package>"""

def make_nav(chapters):
    items = "\n".join(
        f'      <li><a href="text/{uid}.xhtml">{title}</a></li>'
        for uid, title, _ in chapters
    )
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head><meta charset="UTF-8"/><title>Table of Contents</title></head>
<body>
  <nav epub:type="toc">
    <h1>Table of Contents</h1>
    <ol>
{items}
    </ol>
  </nav>
</body>
</html>"""

# ── Build ZIP ────────────────────────────────────────────────────────────────
with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
    z.writestr("mimetype", "application/epub+zip", compress_type=zipfile.ZIP_STORED)
    z.writestr("META-INF/container.xml", """<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>""")
    z.writestr("OEBPS/styles/book.css", STYLE)
    z.writestr("OEBPS/content.opf", make_opf(chapters))
    z.writestr("OEBPS/nav.xhtml", make_nav(chapters))
    for uid, title, content in chapters:
        z.writestr(f"OEBPS/text/{uid}.xhtml", content)

print(f"✅  Written → {OUT}")
print(f"    Size: {os.path.getsize(OUT):,} bytes")
print(f"    Chapters: {len(chapters)}")
