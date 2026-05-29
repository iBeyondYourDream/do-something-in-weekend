import yaml
import requests


def load_config(config_path: str = "config.yaml") -> dict:
    with open(config_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def call_llm(prompt: str, config_path: str = "config.yaml") -> str:
    config = load_config(config_path)
    llm_config = config["llm"]

    url = llm_config["url"]
    api_key = llm_config["api_key"]
    model = llm_config.get("model", "gpt-4o")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
    }

    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()

    result = response.json()
    return result["choices"][0]["message"]["content"]


if __name__ == "__main__":
    reply = call_llm("Hello, who are you?")
    print(reply)
