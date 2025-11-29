async function postJSON(url, body) {
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return resp.json();
}
// CODM
document.getElementById("btn-codm").addEventListener("click", async () => {
  const out = document.getElementById("codm-output");
  out.textContent = "Generating... please wait.";
  try {
    const body = {
      weapon_type: document.getElementById("codm-weapon").value,
      playstyle: document.getElementById("codm-playstyle").value,
      map: document.getElementById("codm-map").value,
      device: document.getElementById("codm-device").value,
      skill_level: document.getElementById("codm-skill").value
    };
    const r = await postJSON("/api/codm", body);
    if (r.success && r.result) {
      out.textContent = JSON.stringify(r.result, null, 2);
    } else {
      out.textContent = "Error: " + (r.error || JSON.stringify(r));
    }
  } catch (err) {
    out.textContent = "Network error: " + err.message;
  }
});
// Local Reply
document.getElementById("btn-lr").addEventListener("click", async () => {
  const out = document.getElementById("lr-output");
  out.textContent = "Generating... please wait.";
  try {
    const body = {
      business_type: document.getElementById("lr-business").value,
      customer_message: document.getElementById("lr-message").value,
      preferred_tone: document.getElementById("lr-tone").value,
      extra_info: document.getElementById("lr-extra").value
    };
    const r = await postJSON("/api/localreply", body);
    if (r.success && r.result) {
      out.textContent = JSON.stringify(r.result, null, 2);
    } else {
      out.textContent = "Error: " + (r.error || JSON.stringify(r));
    }
  } catch (err) {
    out.textContent = "Network error: " + err.message;
  }
});
