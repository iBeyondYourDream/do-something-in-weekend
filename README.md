# do-something-in-weekend

周末干点啥 —— 用来探索和实验各种有趣想法的周末项目集合。

目前包含一个轻量级 LLM 调用工具，支持 OpenAI 兼容接口。

---

## 目录结构

```
do-something-in-weekend/
├── src/
│   └── llm_caller/        # LLM 调用核心模块
│       ├── __init__.py
│       └── caller.py
├── main.py                # 入口脚本（示例调用）
├── config.yaml            # 本地配置（已加入 .gitignore，请勿提交）
├── config.yaml.example    # 配置模板
├── requirements.txt       # 项目依赖
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 配置 API

复制模板并填入你的 API Key：

```bash
cp config.yaml.example config.yaml
```

编辑 `config.yaml`：

```yaml
llm:
  url: "https://api.openai.com/v1/chat/completions"
  api_key: "sk-xxxxxxxxxxxxxxxx"
  model: "gpt-4o"
```

> ⚠️ `config.yaml` 已被 `.gitignore` 忽略，请勿将真实 API Key 提交到版本库。

### 3. 运行示例

```bash
python main.py
```

## 在代码中使用

```python
from src.llm_caller import call_llm

response = call_llm("给我讲个笑话")
print(response)
```

自定义配置路径：

```python
response = call_llm("你好", config_path="my_config.yaml")
```

## 配置说明

| 字段 | 说明 | 默认值 |
|------|------|--------|
| `llm.url` | API 端点，兼容任何 OpenAI 格式接口 | — |
| `llm.api_key` | API 密钥 | — |
| `llm.model` | 使用的模型名称 | `gpt-4o` |
