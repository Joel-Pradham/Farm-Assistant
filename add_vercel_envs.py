"""
add_vercel_envs.py — Push environment variables to Vercel production
Usage: Set GROQ_API_KEY and OPENAI_API_KEY in your shell or .env, then run this script.
"""
import os
import subprocess

keys = {
    "GROQ_API_KEY": os.environ.get("GROQ_API_KEY", ""),
    "OPENAI_API_KEY": os.environ.get("OPENAI_API_KEY", ""),
    "OPENWEATHERMAP_API_KEY": os.environ.get("OPENWEATHERMAP_API_KEY", ""),
    "DEFAULT_CITY": os.environ.get("DEFAULT_CITY", "Ernakulam"),
    "DEFAULT_COUNTRY": os.environ.get("DEFAULT_COUNTRY", "IN"),
}

for k, v in keys.items():
    if not v:
        print(f"[SKIP] {k} is not set in environment — skipping")
        continue
    print(f"Removing old {k}...")
    subprocess.run(["vercel", "env", "rm", k, "production", "-y"], capture_output=True, shell=True)
    print(f"Adding {k}...")
    subprocess.run(["vercel", "env", "add", k, "production"], input=v.encode("utf-8"), shell=True)

print("\nDeploying to Vercel production...")
subprocess.run(["vercel", "--prod", "--yes"], shell=True)
