# Regenerates public/resume.pdf (a public-safe resume: no phone number, date of birth or marks).
# Usage (from the project root): pip install reportlab && python scripts/make_resume.py
# Edit the text below when your experience changes, then re-run it.
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
from reportlab.lib.enums import TA_LEFT

INK = colors.HexColor("#15151a")
DIM = colors.HexColor("#5b5b66")
GOLD = colors.HexColor("#a9803a")
RULE = colors.HexColor("#d9d2c3")
SIDE = colors.HexColor("#f4f1ea")

W, H = A4
SIDE_W = 66 * mm
MARGIN = 14 * mm

def style(name, **kw):
    base = dict(fontName="Helvetica", fontSize=9, leading=13, textColor=INK, alignment=TA_LEFT)
    base.update(kw)
    return ParagraphStyle(name, **base)

S = {
    "name": style("name", fontName="Helvetica-Bold", fontSize=24, leading=26),
    "role": style("role", fontSize=10.5, leading=14, textColor=GOLD, fontName="Helvetica-Bold"),
    "role2": style("role2", fontSize=9.5, leading=13, textColor=DIM),
    "side_h": style("side_h", fontName="Helvetica-Bold", fontSize=8.5, leading=11, textColor=GOLD, spaceBefore=14, spaceAfter=4),
    "side": style("side", fontSize=8.6, leading=12.4),
    "side_b": style("side_b", fontSize=8.6, leading=12.4, leftIndent=9, bulletIndent=0, spaceAfter=3),
    "cert_when": style("cert_when", fontSize=8, leading=11, textColor=DIM, spaceAfter=6),
    "contact_l": style("contact_l", fontSize=7.4, leading=10, textColor=DIM, fontName="Helvetica-Bold"),
    "contact": style("contact", fontSize=8.6, leading=12),
    "h": style("h", fontName="Helvetica-Bold", fontSize=10.5, leading=13, textColor=INK, spaceBefore=12, spaceAfter=2),
    "job": style("job", fontName="Helvetica-Bold", fontSize=9.8, leading=13),
    "when": style("when", fontSize=8.6, leading=12, textColor=DIM, spaceAfter=3),
    "b": style("b", fontSize=9, leading=12.6, leftIndent=10, bulletIndent=0, spaceAfter=1.6),
    "edu_t": style("edu_t", fontName="Helvetica-Bold", fontSize=9.2, leading=12.4),
    "edu": style("edu", fontSize=8.8, leading=12, textColor=DIM, spaceAfter=5),
    "cell_l": style("cell_l", fontName="Helvetica-Bold", fontSize=8.8, leading=12),
    "cell": style("cell", fontSize=8.8, leading=12),
}

def P(text, st): return Paragraph(text, S[st])
def B(text, st="b"): return Paragraph(text, S[st], bulletText="\u2022")

def draw_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(SIDE)
    canvas.rect(0, 0, SIDE_W, H, stroke=0, fill=1)
    canvas.setFillColor(GOLD)
    canvas.rect(SIDE_W, 0, 1.2, H, stroke=0, fill=1)
    canvas.restoreState()

def rule(): 
    t = Table([[""]], colWidths=[W - SIDE_W - 2 * MARGIN], rowHeights=[1])
    t.setStyle(TableStyle([("LINEABOVE", (0, 0), (-1, 0), 0.6, RULE)]))
    return t

def build(path):
    doc = BaseDocTemplate(path, pagesize=A4, title="Ashish Raj - Resume", author="Ashish Raj",
                          subject="Software Engineer, AEM Developer (Certified)", leftMargin=0, rightMargin=0, topMargin=0, bottomMargin=0)
    side = Frame(0, 0, SIDE_W, H, leftPadding=11 * mm, rightPadding=9 * mm, topPadding=16 * mm, bottomPadding=12 * mm, id="side")
    main = Frame(SIDE_W, 0, W - SIDE_W, H, leftPadding=MARGIN, rightPadding=MARGIN, topPadding=15 * mm, bottomPadding=12 * mm, id="main")
    doc.addPageTemplates([PageTemplate(id="p", frames=[side, main], onPage=draw_page)])

    story = []
    # ---------------- sidebar
    story += [P("ASHISH<br/>RAJ", "name"), Spacer(1, 6),
              P("Software Engineer", "role"), P("AEM Developer (Certified)", "role2")]

    story += [P("PROFILE", "side_h")]
    story += [
        B("Software Engineer with 6+ years of experience in the analysis, design and development of Adobe Experience Manager (AEM / CQ5) solutions.", "side_b"),
        B("Hands-on with generic and custom components, bundles, System Console, OSGi configuration, servlets, services, templates, dialogs, Experience Fragments, Content Fragments, workflows, event handlers and schedulers.", "side_b"),
        B("Also builds full-stack web platforms for clients with Next.js and Supabase.", "side_b"),
        B("Strong written and oral communication, and a habit of getting things done through collaboration.", "side_b"),
    ]

    story += [P("CERTIFICATIONS", "side_h")]
    for title, dates in [
        ("Adobe Certified Expert: AEM Sites Developer", "Jul 2023 \u2013 Jul 2027"),
        ("Adobe Certified Expert: AEM Business Practitioner", "Jan 2024 \u2013 Jul 2027"),
        ("Adobe Certified Professional: AEM Assets Developer", "Sep 2026 \u2013 Sep 2028"),
    ]:
        story += [P(f"<b>{title}</b>", "side"), P(dates, "cert_when")]

    story += [P("CONTACT", "side_h"),
              P("EMAIL", "contact_l"), P("ashishrajbhagat@gmail.com", "contact"), Spacer(1, 4),
              P("LINKEDIN", "contact_l"), P("linkedin.com/in/ashishrajbhagat", "contact"), Spacer(1, 4),
              P("GITHUB", "contact_l"), P("github.com/ashishrajbhagat", "contact"), Spacer(1, 4),
              P("WEBSITE", "contact_l"), P("ashishrajbhagat.dev", "contact")]

    # jump to main frame
    from reportlab.platypus import FrameBreak
    story.append(FrameBreak())

    # ---------------- main
    story += [P("WORK EXPERIENCE", "h"), rule(), Spacer(1, 5)]
    story += [P("Concentrix Catalyst \u2013 Software Engineer", "job"), P("Apr 2022 \u2013 Present", "when"),
              B("Development of AEM solutions from scratch"),
              B("Developed and updated components"),
              B("Created various templates and pages"),
              B("Worked on servlets, services and models"),
              B("Troubleshooting and fixing bugs"),
              B("Wrote JUnit tests"),
              Spacer(1, 8)]
    story += [P("TA Digital \u2013 Associate Software Engineer", "job"), P("Aug 2020 \u2013 Apr 2022", "when"),
              B("Development from scratch; developed and updated components"),
              B("Built email templates sent after a user action"),
              B("Worked on servlets, services and models"),
              B("Worked on workflows, event handlers and schedulers"),
              B("Created various pages and templates"),
              B("Created Experience Fragments and Content Fragments"),
              B("Troubleshooting and fixing bugs"),
              B("Wrote JUnit tests for models and servlets")]

    story += [P("PROJECTS", "h"), rule(), Spacer(1, 5)]
    story += [P("AEM Tutorial \u2013 aem-tutorial.vercel.app", "job"),
              P("Free learning hub for Adobe Experience Manager", "when"),
              B("Practical guides from fundamentals to Dispatcher, workflows, security and headless delivery"),
              B("Covers AEM as a Cloud Service and 6.5; open source on GitHub"),
              Spacer(1, 6),
              P("YantraStack (client work)", "job"),
              P("A toolbox of PDF, image and developer tools in one place", "when"),
              Spacer(1, 2),
              P("Library management platform (client work)", "job"),
              P("Role-based, multi-portal web app on Next.js 14 and Supabase", "when")]

    story += [P("EDUCATION", "h"), rule(), Spacer(1, 5)]
    story += [P("B.Tech in Computer Science and Engineering", "edu_t"),
              P("National Institute of Science &amp; Technology, Berhampur, Odisha &middot; 2016 \u2013 2020", "edu"),
              P("Intermediate in Science", "edu_t"),
              P("M.V. College, Buxar, Bihar &middot; 2013 \u2013 2015", "edu"),
              P("Matriculation", "edu_t"),
              P("S.V.M., Buxar, Bihar &middot; 2011 \u2013 2013", "edu")]

    rows = [
        ("CMS Platform", "AEM (Cloud Service, 6.5, 6.4)"),
        ("Technology", "Java, HTML, CSS, JavaScript, jQuery"),
        ("Server Side", "OSGi, Apache Sling, Servlets"),
        ("Full-stack", "Next.js, Supabase"),
        ("Languages", "C, C++, Python"),
        ("Dev Tools", "IntelliJ IDEA, Eclipse, VS Code"),
        ("Versioning", "Git, Bitbucket"),
        ("Build Tools", "Maven"),
        ("Project Management", "Jira, Confluence"),
    ]
    tbl = Table([[P(a, "cell_l"), P(b, "cell")] for a, b in rows], colWidths=[34 * mm, W - SIDE_W - 2 * MARGIN - 34 * mm])
    tbl.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, -1), 0.4, RULE), ("VALIGN", (0, 0), (-1, -1), "TOP"),
                             ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3), ("LEFTPADDING", (0, 0), (-1, -1), 0)]))
    story += [KeepTogether([P("SKILLS", "h"), rule(), Spacer(1, 4), tbl])]

    doc.build(story)

if __name__ == "__main__":
    build("public/resume.pdf")
    print("built")
