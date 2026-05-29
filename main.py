"""Entry point: run a quick LLM call from the command line."""
from src.llm_caller import call_llm

if __name__ == "__main__":
    reply = call_llm("Hello, who are you?")
    print(reply)
