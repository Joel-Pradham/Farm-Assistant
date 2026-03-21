import subprocess
import sys

keys = {
    "GROQ_API_KEY": "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",
    "OPENAI_API_KEY": "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"
}

for k, v in keys.items():
    print(f"Removing old {k}...")
    subprocess.run(["vercel", "env", "rm", k, "production", "-y"], capture_output=True, shell=True)
    print(f"Adding new {k}...")
    subprocess.run(["vercel", "env", "add", k, "production"], input=v.encode('utf-8'), shell=True)

print("Deploying to Vercel production...")
subprocess.run(["vercel", "--prod", "--yes"], shell=True)
