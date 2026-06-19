import os
import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from openai import AsyncOpenAI

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

SYSTEM_PROMPT = """
You are the Farm Intel AI, an elite agricultural specialist engineered for farmers in Kerala, India.
Your primary goals:
- Give highly precise, actionable, and scientific advice about crop cultivation, diseases, and soil management.
- Keep your answers concise but thorough. Focus on tactical solutions.
- Speak professionally, like an experienced agronomist. 
- You specialize in coconuts, rubber, pepper, cardamom, rice, and banana.

Formatting rules:
- Use bullet points for steps.
- Provide names of specific chemicals, organic alternatives, and exact quantities when possible.
- If diagnosing a disease, ALWAYS give the immediate "Action to Take".
"""

# Simple deterministic fallback engine in case of no API key
def fallback_engine(msg: str) -> str:
    msg = msg.lower()
    if 'coconut' in msg and ('brown' in msg or 'yellow' in msg):
        return "Possible **Bud Rot** or **Root Wilt Disease**.\n\n**Action to Take:**\n- Apply 1% Bordeaux mixture on the crown.\n- Improve drainage.\n- Apply 5kg Neem cake per palm."
    if 'pepper' in msg and 'rot' in msg:
        return "**Quick Wilt (Phytophthora foot rot)** is a major threat in Kerala.\n\n**Action to Take:**\n- Drench the soil with 1% Bordeaux mixture or Copper Oxychloride 0.2%.\n- Prune lower runner shoots."
    if 'banana' in msg and 'fertilizer' in msg:
        return "For Nendran Banana in Kerala, the general NPK recommendation per plant is 190g N, 115g P2O5, and 300g K2O. \n\n**Action to Take:**\n- Base application: 10kg Farm Yard Manure (FYM).\n- Split chemical fertilizers into 6 doses over the 10-month crop cycle."
    return "I am operating in fallback mode because no OpenAI API key is detected. However, my pre-programmed logic handles common Kerala crops. Please ask specifically about diseases in Coconut, Pepper, Rubber, or Banana."

@router.post("")
async def chat_with_ai(request: ChatRequest):
    # Try GROQ first, fallback to OPENAI, then rule engine
    api_key = os.getenv("GROQ_API_KEY", os.getenv("OPENAI_API_KEY", ""))
    
    if not api_key or api_key in ["your_openai_key_here", "your_groq_key_here", ""]:
        return {
            "response": fallback_engine(request.message),
            "source": "rule_engine"
        }
        
    is_groq = api_key.startswith("gsk_")
    base_url = "https://api.groq.com/openai/v1" if is_groq else None
    model_name = "llama-3.3-70b-versatile" if is_groq else "gpt-4o-mini"
    
    try:
        client = AsyncOpenAI(
            base_url=base_url,
            api_key=api_key 
        )
        
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for m in (request.history or []):
            messages.append({"role": m.role, "content": m.content})
            
        messages.append({"role": "user", "content": request.message})
        
        completion = await client.chat.completions.create(
            model=model_name,
            messages=messages,
            temperature=0.7,
            max_tokens=600
        )
        
        return {
            "response": completion.choices[0].message.content,
            "source": "groq" if is_groq else "openai"
        }
        
    except Exception as e:
        print(f"Chat API Cloud Error: {e}")
        # Identify if it's a quota/billing error to explicitly inform the user
        if 'insufficient_quota' in str(e):
            error_details = "ERROR: Your OpenAI API key has insufficient quota (out of credits). Please add funds to your OpenAI billing account."
        else:
            error_details = f"API Error encountered: {str(e)}"
            
        return {
            "response": f"**{error_details}**\n\n*Falling back to local offline diagnostic engine...*\n\n{fallback_engine(request.message)}",
            "source": "rule_engine_fallback"
        }
