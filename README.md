# NeuroStickerStudio
---

💎 NeuroSticker Studio

> Генератор стикеров на базе нейросетей.  
> Проект в минималистичном зелёном стиле: галерея, модалки для ошибок и поддержка OpenAI / Stability AI.

---

🟢 Установка

```bash
git clone https://github.com/yourname/neurosticker-studio.git
cd neurosticker-studio
```

---

🔑 Настройка API‑ключей

В коде есть два блока — выбери один провайдер и вставь свой ключ.

🟩 OpenAI Images
```js
// === ВСТАВЬ СВОЙ OPENAI KEY СЮДА ===
const OPENAIAPIKEY = "YOUROPENAIAPI_KEY";

const resp = await fetch("https://api.openai.com/v1/images/generations", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + OPENAIAPIKEY
  },
  body: JSON.stringify({
    prompt: prompt,
    n: count,
    size: ${size}x${size},
    responseformat: "b64json"
  })
});
```

🟢 Stability AI
```js
// === ВСТАВЬ СВОЙ STABILITY KEY СЮДА ===
const STABILITYAPIKEY = "YOURSTABILITYAPI_KEY";

const resp = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": "Bearer " + STABILITYAPIKEY
  },
  body: JSON.stringify({
    text_prompts: [{ text: prompt }],
    cfg_scale: 7,
    samples: count,
    width: size,
    height: size
  })
});
```

---

🔷 Функционал
- 🟢 Ввод описания стикера (многострочное поле).  
- 💎 Выбор количества и размера.  
- 🟩 Галерея с превью.  
- 🟢 Кнопка «Скачать набор» (ZIP).  
- 💎 Красивые модальные окна для ошибок и уведомлений.  

---

⚠️ Важно
- Не храните ключи в клиентском коде при публикации. Для продакшена используйте сервер‑прокси или переменные окружения.  
- При ошибке billinghardlimit_reached — проверьте баланс в Billing OpenAI.  

---

