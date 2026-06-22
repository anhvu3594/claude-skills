#!/usr/bin/env python3
"""Generate a clean, recruiter-friendly tech resume PDF with reportlab.

This is a reusable template for the resume-writer skill. It encodes the
design rules that matter for the 10-15 second recruiter scan:

  - single-column, top-down layout (mirrors LinkedIn; never two-column)
  - one muted accent color, used only for section headers
  - bold reserved for name, section headers, job titles, company names, dates
  - dates right-aligned on the same line as the title so years stand out
  - each work entry kept together so a role never splits across pages
  - links rendered in body color with an underline, not bright blue

Usage:
    python build_resume_pdf.py resume_data.json Firstname_Lastname_Resume.pdf

Run with no arguments to produce a sample (sample_resume.json baked in below)
so you can see exactly what good output looks like:
    python build_resume_pdf.py

The JSON schema is documented in build_resume_pdf.py's SAMPLE constant and in
the skill's references. Edit the data, not the layout — the layout is the part
that's hard to get right.
"""

import json
import sys

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

# One muted accent. Swap to taste (e.g. teal "#3A7D7B"); keep it muted, not neon.
ACCENT = HexColor("#2A5C8A")
BODY = HexColor("#1A1A1A")
RULE = HexColor("#B8C4D0")

PAGE_W = LETTER[0]


def styles():
    s = getSampleStyleSheet()
    s.add(ParagraphStyle("Name", fontName="Helvetica-Bold", fontSize=22,
                         leading=26, alignment=TA_CENTER, textColor=BODY,
                         spaceAfter=2))
    s.add(ParagraphStyle("Contact", fontName="Helvetica", fontSize=9.5,
                         leading=13, alignment=TA_CENTER, textColor=BODY,
                         spaceAfter=10))
    s.add(ParagraphStyle("Section", fontName="Helvetica-Bold", fontSize=10.5,
                         leading=13, textColor=ACCENT, spaceBefore=8,
                         spaceAfter=3))
    s.add(ParagraphStyle("Body", fontName="Helvetica", fontSize=9.5,
                         leading=13, textColor=BODY))
    s.add(ParagraphStyle("RBul", fontName="Helvetica", fontSize=9.5,
                         leading=12.5, textColor=BODY, leftIndent=12,
                         bulletIndent=2, spaceAfter=1.5))
    s.add(ParagraphStyle("RoleTitle", fontName="Helvetica-Bold", fontSize=10,
                         leading=13, textColor=BODY))
    s.add(ParagraphStyle("RoleDate", fontName="Helvetica-Bold", fontSize=9.5,
                         leading=13, textColor=BODY, alignment=2))  # right
    s.add(ParagraphStyle("RoleSub", fontName="Helvetica", fontSize=9,
                         leading=12, textColor=BODY))
    return s


def section_header(text, S):
    return [Paragraph(text, S["Section"]),
            HRFlowable(width="100%", thickness=0.7, color=RULE,
                       spaceBefore=1, spaceAfter=4)]


def title_date_row(title, company, date, S):
    """Title + company on the left, date right-aligned — the scannable row."""
    left = title if not company else f"{title} &nbsp;&nbsp;<font color='#555555'>{company}</font>"
    tbl = Table([[Paragraph(left, S["RoleTitle"]),
                  Paragraph(date or "", S["RoleDate"])]],
                colWidths=[4.9 * inch, 1.9 * inch])
    tbl.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return tbl


def work_entry(role, S):
    flow = [title_date_row(role["title"], role.get("company"),
                           role.get("date"), S)]
    if role.get("location"):
        flow.append(Paragraph(role["location"], S["RoleSub"]))
    flow.append(Spacer(1, 1.5))
    for b in role.get("bullets", []):
        flow.append(Paragraph(b, S["RBul"], bulletText="•"))
    flow.append(Spacer(1, 6))
    return KeepTogether(flow)  # keep a role's title+bullets on one page


def build(data, out_path):
    S = styles()
    doc = SimpleDocTemplate(out_path, pagesize=LETTER,
                            topMargin=0.55 * inch, bottomMargin=0.55 * inch,
                            leftMargin=0.7 * inch, rightMargin=0.7 * inch,
                            title=data.get("name", "Resume"))
    flow = [Paragraph(data["name"], S["Name"]),
            Paragraph("  •  ".join(data.get("contact", [])), S["Contact"])]

    if data.get("summary"):
        flow += section_header("SUMMARY", S)
        flow.append(Paragraph(data["summary"], S["Body"]))

    if data.get("technologies"):
        flow += section_header("TECHNOLOGIES AND LANGUAGES", S)
        for line in data["technologies"]:
            flow.append(Paragraph(line, S["RBul"], bulletText="•"))

    if data.get("experience"):
        flow += section_header("WORK EXPERIENCE", S)
        for role in data["experience"]:
            flow.append(work_entry(role, S))

    if data.get("education"):
        flow += section_header("EDUCATION", S)
        for ed in data["education"]:
            flow.append(title_date_row(ed["school"], None, ed.get("date"), S))
            for line in ed.get("lines", []):
                flow.append(Paragraph(line, S["RBul"], bulletText="•"))
            flow.append(Spacer(1, 5))

    if data.get("projects"):
        flow += section_header("PROJECTS", S)
        for p in data["projects"]:
            flow.append(Paragraph(p, S["RBul"], bulletText="•"))

    doc.build(flow)
    print(f"Wrote {out_path}")


# Sample data = the anonymized "Edmond Smith" refactor from the references.
# It doubles as the JSON schema: this is exactly the shape build() expects.
SAMPLE = {
    "name": "Edmond Smith",
    "contact": ["Cape Town, South Africa", "edmondsmith88@example.com",
                "github.com/edmondsmith"],
    "summary": None,
    "technologies": [
        "PHP, JavaScript, Java, Kotlin, Android, Angular, Laravel, Express.js, Ktor",
        "MySQL, MongoDB, AWS, Git",
        "Data structures and algorithms, API design, engineering best practices, unit testing",
    ],
    "experience": [
        {
            "title": "Backend Software Engineer", "company": "Cloudless",
            "date": "Sep 2018 – Present", "location": "Remote",
            "bullets": [
                "Improved customer conversion by 30% on the co-working platform by implementing recurring payments and integrating Zoom rooms.",
                "Re-architected the RESTful API powering the mobile client, using PHP and Laravel.",
            ],
        },
        {
            "title": "Development Team Lead", "company": "MennoMark",
            "date": "Jan 2017 – Aug 2018",
            "bullets": [
                "Led a team of 3 engineers to ship multiple apps and services.",
                "Built an app for educating cocoa farmers in the Farmer Business School programme, using Kotlin and Room database.",
                "Designed and implemented APIs that powered our 10 mobile applications using PHP, Lumen, Laravel, AWS RDS, AWS Elasticbeanstalk and PostMan.",
                "Onboarded and trained 6 new employees on the company's development and product stack.",
            ],
        },
    ],
    "education": [
        {"school": "Cape Town University", "date": "2013 – 2017",
         "lines": ["Bachelor of Science in Computer Science",
                   "MasterCard Foundation Scholar — awarded to 10 of 300 applicants."]},
    ],
    "projects": [
        "<b>BareGo</b> — a minimal, progressive Go framework for efficient, scalable server-side apps. <u>github.com/edmondsmith/barego</u>",
        "<b>Technical blogging</b> on Dev.to; popular articles on <u>Angular Material</u> and <u>Clean Code</u>.",
    ],
}


def main():
    if len(sys.argv) >= 2:
        with open(sys.argv[1]) as f:
            data = json.load(f)
        out = sys.argv[2] if len(sys.argv) >= 3 else "resume.pdf"
    else:
        data, out = SAMPLE, "sample_resume.pdf"
    build(data, out)


if __name__ == "__main__":
    main()
