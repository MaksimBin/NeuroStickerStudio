 /* ===== Модалки ===== */
function showModal(message) {
  const modal = document.getElementById('modal');
  const msg = document.getElementById('modal-message');
  msg.textContent = message;
  modal.style.display = 'flex';
}
document.getElementById('modal-close').onclick = () => {
  document.getElementById('modal').style.display = 'none';
};
document.getElementById('modal-ok').onclick = () => {
  document.getElementById('modal').style.display = 'none';
};

/* ===== Галерея и ZIP ===== */
function renderCard(src, idx) {
  const gallery = document.getElementById('gallery');
  const card = document.createElement('div'); card.className = 'card';
  const preview = document.createElement('div'); preview.className = 'preview';
  const img = document.createElement('img'); img.src = src; img.alt = `Стикер ${idx+1}`;
  preview.appendChild(img);
  const meta = document.createElement('div'); meta.className = 'meta'; meta.textContent = `Стикер ${idx+1}`;
  card.appendChild(preview); card.appendChild(meta);
  gallery.appendChild(card);
}

document.getElementById('downloadAll').addEventListener('click', async () => {
  const imagesJson = document.getElementById('gallery').dataset.images;
  if (!imagesJson) {
    showModal("Нет стикеров для скачивания");
    return;
  }
  const images = JSON.parse(imagesJson);
  const zip = new JSZip();
  images.forEach((src, i) => {
    const b64 = src.split(',')[1];
    zip.file(`sticker_${i+1}.png`, b64, { base64: true });
  });
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'stickers.zip'; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
});

/* ===== Генерация ===== */
document.getElementById('genBtn').addEventListener('click', async () => {
  const prompt = document.getElementById('prompt').value.trim();
  if (!prompt) {
    showModal("Введите описание стикера");
    return;
  }

  const provider = document.getElementById('provider').value;
  const count = Number(document.getElementById('count').value) || 1;
  const sizeVal = Number(document.getElementById('size').value) || 512;
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  gallery.dataset.images = '[]';

  try {
    if (provider === 'openai') {
      await generateWithOpenAI(prompt, count, sizeVal);
    } else {
      await generateWithStability(prompt, count, sizeVal);
    }
  } catch (err) {
    showModal("Ошибка генерации: " + (err.message || err));
  }
});

/* ===== OpenAI Images ===== */
async function generateWithOpenAI(prompt, count, size) {
  // ⚠️ ВСТАВЬ СВОЙ OPENAI API KEY СЮДА:
  const OPENAI_API_KEY = "OPEN_AI_KEY";
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "YOUR_OPENAI_API_KEY") {
    throw new Error('OpenAI API key не установлен');
  }

  const resp = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + OPENAI_API_KEY
    },
    body: JSON.stringify({
      prompt: prompt,
      n: count,
      size: `${size}x${size}`,
      response_format: "b64_json"
    })
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`OpenAI error: ${resp.status} ${txt}`);
  }

  const data = await resp.json();
  const images = [];
  data.data.forEach((item, i) => {
    const src = "data:image/png;base64," + item.b64_json;
    images.push(src);
    renderCard(src, i);
  });
  document.getElementById('gallery').dataset.images = JSON.stringify(images);
}

/* ===== Stability AI ===== */
async function generateWithStability(prompt, count, size) {
  // ⚠️ ВСТАВЬ СВОЙ STABILITY API KEY СЮДА:
  const STABILITY_API_KEY = "YOUR_STABILITY_API_KEY";
  if (!STABILITY_API_KEY || STABILITY_API_KEY === "YOUR_STABILITY_API_KEY") {
    throw new Error('Stability API key не установлен');
  }

  const resp = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + STABILITY_API_KEY
    },
    body: JSON.stringify({
      text_prompts: [{ text: prompt }],
      cfg_scale: 7,
      samples: count,
      width: size,
      height: size
    })
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Stability error: ${resp.status} ${txt}`);
  }

  const data = await resp.json();
  const images = [];
  data.artifacts.forEach((item, i) => {
    const b64 = item.base64 || item.b64 || item.b64_json;
    if (!b64) return;
    const src = "data:image/png;base64," + b64;
    images.push(src);
    renderCard(src, i);
  });
  document.getElementById('gallery').dataset.images = JSON.stringify(images);
}
