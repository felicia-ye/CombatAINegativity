
document.getElementById("getText").onclick = async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => {
        let text = window.getSelection().toString();
        if (!text) {
          const active = document.activeElement;
          if (active && (active.tagName === "TEXTAREA" || active.tagName === "INPUT")) {
            text = active.value.substring(active.selectionStart, active.selectionEnd);
          }
        }
        return text;
      }
    },
    (results) => {
      const text = results?.[0]?.result || "";
      document.getElementById("input").value = text;
      if (!text) {
        document.getElementById("result").innerText = "⚠️ Highlight text on the page first.";
      }
    }
  );
};

document.getElementById("analyze").onclick = () => {

  const rawText = document.getElementById("input").value;
  const text = rawText.toLowerCase().trim();


  let riskScore = 0;
  let triggerWords = [];

  if (!text) {
    document.getElementById("result").innerText = "⚠️ Please enter text first.";
    return;
  }

  if (text.includes("always") || text.includes("never")) {
    riskScore += 0.35;
    triggerWords.push("absolute terms");
  }

  if (text.includes("shocking") || text.includes("urgent") || text.includes("breaking")) {
    riskScore += 0.3;
    triggerWords.push("emotional tone");
  }

  if (text.includes("guaranteed") || text.includes("100%")) {
    riskScore += 0.35;
    triggerWords.push("suspicious certainty");
  }

  riskScore = Math.min(riskScore, 1);
  const percentage = Math.round(riskScore * 100);
  
  let color = "green";
  if (percentage > 70) color = "red";
  else if (percentage > 30) color = "orange";

  document.getElementById("result").innerHTML = `
    <div style="padding:10px; border-radius:8px; background:${color}20; border: 1px solid ${color};">
      <strong style="color:${color};">Risk: ${percentage}%</strong><br>
      <small>Signals: ${triggerWords.length ? triggerWords.join(", ") : "None"}</small>
    </div>
  `;
};

document.getElementById("aiAnalyze").onclick = async () => {
  const text = document.getElementById("input").value;
  if (!text) return;

  document.getElementById("result").innerText = "🧠 Asking AI for second opinion...";

  try {
    const res = await fetch("http://localhost:3000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    
    const data = await res.json();
    document.getElementById("result").innerHTML = `
      <div style="padding:10px; border-radius:8px; background:#f5f5f5;">
        <strong>🧠 AI Analysis</strong><br><div style="white-space:pre-wrap;">${data.result}</div>
      </div>
    `;
  } catch (err) {
    document.getElementById("result").innerText = "❌ Connection failed. Ensure server.js is running.";
  }
};

function openSearch(suffix = "") {
  const text = document.getElementById("input").value;
  if (!text) return;
  const query = encodeURIComponent(text + suffix);
  chrome.tabs.create({ url: `https://www.google.com/search?q=${query}` });
}

document.getElementById("search").onclick = () => openSearch();
document.getElementById("news").onclick = () => openSearch(" news");
document.getElementById("factcheck").onclick = () => openSearch(" fact check");