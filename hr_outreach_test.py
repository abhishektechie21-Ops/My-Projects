#!/usr/bin/env python3
import csv
import os
import time
import ssl
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from datetime import datetime
from dotenv import load_dotenv


# =========================
# HR Outreach Test Script
# Author: Abhishek Singh
# Purpose: Safe outbound HR emails (TEST MODE)
# =========================

load_dotenv()

# ---------- SMTP CONFIG ----------
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USER)

# ---------- SENDER PROFILE ----------
SENDER_NAME = os.getenv("SENDER_NAME", "")
SENDER_MOBILE = os.getenv("SENDER_MOBILE", "")
SENDER_LINKEDIN = os.getenv("SENDER_LINKEDIN", "")

# ---------- RESUME ----------
RESUME_PATH = os.getenv("RESUME_PATH")  # e.g. resume/Abhishek-Senior-DevopsSRE-7Years.pdf

# ---------- FILES ----------
HR_FILE = "hr_test.csv"
SENT_FILE = "hr_sent_test.csv"

# ---------- SAFETY LIMITS ----------
MAX_DAILY = 2          # Keep LOW for testing
SLEEP_SECONDS = 60     # Delay between emails

# ---------- EMAIL TEMPLATE ----------
EMAIL_TEMPLATE = """
Hi {name},

Hope you’re doing well.

I’m reaching out to express my interest in Senior DevOps / SRE opportunities at {company}.
I have strong hands-on experience with cloud infrastructure, AWS, GCP, Kubernetes, Terraform, CI/CD, Ansible, Monitoring, Observalityand production reliability.

I’d appreciate it if you could let me know if there are any relevant openings or the right person to connect with.

Best regards,
{sender_name}
Senior DevOps / SRE Engineer
📧 {from_email}
📱 {sender_mobile}
🔗 {sender_linkedin}
"""

# ---------- HELPERS ----------
def already_sent(email):
    if not os.path.exists(SENT_FILE):
        return False
    with open(SENT_FILE, newline="", encoding="utf-8") as f:
        return any(email == row[0] for row in csv.reader(f))

def log_sent(email, company):
    with open(SENT_FILE, "a", newline="", encoding="utf-8") as f:
        csv.writer(f).writerow([
            email,
            company,
            datetime.now().isoformat()
        ])

def send_email(to_email, subject, body):
    msg = MIMEMultipart()
    msg["From"] = FROM_EMAIL
    msg["To"] = to_email
    msg["Subject"] = subject

    # Email body
    msg.attach(MIMEText(body, "plain", "utf-8"))

    # ---- Attach Resume (TEST MODE OK) ----
    if RESUME_PATH and os.path.exists(RESUME_PATH):
        with open(RESUME_PATH, "rb") as f:
            resume = MIMEApplication(f.read(), _subtype="pdf")
            resume.add_header(
                "Content-Disposition",
                "attachment",
                filename=os.path.basename(RESUME_PATH)
            )
            msg.attach(resume)

    ctx = ssl.create_default_context()
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls(context=ctx)
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)

# ---------- MAIN ----------
def main():
    if not (SMTP_USER and SMTP_PASS):
        raise RuntimeError("SMTP credentials missing in .env")

    sent_today = 0

    with open(HR_FILE, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for hr in reader:
            if sent_today >= MAX_DAILY:
                break

            email = hr["email"].strip()
            name = hr["name"].strip()
            company = hr["company"].strip()

            if already_sent(email):
                print(f"Skipping (already sent): {email}")
                continue

            body = EMAIL_TEMPLATE.format(
                name=name,
                company=company,
                sender_name=SENDER_NAME,
                from_email=FROM_EMAIL,
                sender_mobile=SENDER_MOBILE,
                sender_linkedin=SENDER_LINKEDIN
            )

            subject = f"Senior DevOps / SRE opportunity inquiry at {company}"

            send_email(email, subject, body)
            log_sent(email, company)

            sent_today += 1
            print(f"Email sent to {email}")

            time.sleep(SLEEP_SECONDS)

    print(f"\nDone. Emails sent today: {sent_today}")

if __name__ == "__main__":
    main()

