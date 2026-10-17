const MIN = -40, MAX = 120;
const nilaiEl = document.getElementById("nilai");
const hasilEl = document.getElementById("hasil");
const pesanEl = document.getElementById("pesan");
const merkuriEl = document.getElementById("merkuri");
const termoEl = document.getElementById("termo");
const segBtns = document.querySelectorAll(".seg button");

const KAMUS = {
  id: {
    judul: "Berapa derajatnya?", sub: "Ketik suhu, dua satuan lainnya menyusul.",
    coba: "Coba:", beku: "Air membeku", tubuh: "Suhu tubuh", didih: "Air mendidih",
    aNilai: "Nilai suhu", aSatuan: "Satuan asal",
    kosong: "Masukkan angka untuk mulai konversi.",
    mutlak: "Tidak ada suhu di bawah nol mutlak (-273,15 °C).",
    C: "Celsius", F: "Fahrenheit", K: "Kelvin", locale: "id-ID"
  },
  en: {
    judul: "How many degrees?", sub: "Type a temperature, the other two units follow.",
    coba: "Try:", beku: "Freezing water", tubuh: "Body temperature", didih: "Boiling water",
    aNilai: "Temperature value", aSatuan: "Starting unit",
    kosong: "Enter a number to start converting.",
    mutlak: "Nothing is colder than absolute zero (-273.15 °C).",
    C: "Celsius", F: "Fahrenheit", K: "Kelvin", locale: "en-US"
  }
};
let bahasa = (navigator.language || "id").toLowerCase().startsWith("id") ? "id" : "en";
const t = k => KAMUS[bahasa][k];
const nama = new Proxy({}, { get: (_, u) => t(u) });
const simbol = { C: " °C", F: " °F", K: " K" };
let satuan = "C";

// Angka pada skala termometer
const skala = document.getElementById("skala");
[-40, 0, 40, 80, 120].forEach(t => {
  const s = document.createElement("span");
  s.textContent = t + "°";
  s.style.bottom = ((t - MIN) / (MAX - MIN) * 100) + "%";
  skala.appendChild(s);
});

const keC = (n, u) => u === "F" ? (n - 32) * 5 / 9 : u === "K" ? n - 273.15 : n;
const dariC = (c, u) => u === "F" ? c * 9 / 5 + 32 : u === "K" ? c + 273.15 : c;
const format = n => Number(n.toFixed(2)).toLocaleString(t("locale"));

function gambarTermometer(c) {
  const pct = Math.min(100, Math.max(3, (c - MIN) / (MAX - MIN) * 100));
  const hue = 210 - (pct / 100) * 202; // biru dingin ke merah panas
  merkuriEl.style.height = pct + "%";
  termoEl.style.setProperty("--warna", `hsl(${hue} 75% 48%)`);
}

function hitung() {
  const n = parseFloat(nilaiEl.value);
  hasilEl.innerHTML = "";
  pesanEl.textContent = "";

  if (Number.isNaN(n)) {
    pesanEl.textContent = t("kosong");
    return;
  }
  const c = keC(n, satuan);
  if (c < -273.15) {
    pesanEl.textContent = t("mutlak");
    return;
  }
  gambarTermometer(c);
  ["C", "F", "K"].forEach(u => {
    const li = document.createElement("li");
    if (u === satuan) li.className = "asal";
    li.innerHTML = `<span class="nama">${nama[u]}</span><strong>${format(dariC(c, u))}${simbol[u]}</strong>`;
    hasilEl.appendChild(li);
  });
}

function setSatuan(u) {
  satuan = u;
  segBtns.forEach(b => b.setAttribute("aria-pressed", b.dataset.u === u));
}

segBtns.forEach(b => b.addEventListener("click", () => {
  // Ubah angka ikut satuan baru supaya suhunya tetap sama
  const n = parseFloat(nilaiEl.value);
  if (!Number.isNaN(n)) nilaiEl.value = Number(dariC(keC(n, satuan), b.dataset.u).toFixed(2));
  setSatuan(b.dataset.u);
  hitung();
}));

document.querySelectorAll(".contoh button").forEach(b => b.addEventListener("click", () => {
  setSatuan("C");
  nilaiEl.value = b.dataset.c;
  hitung();
}));

function terapkanBahasa() {
  document.documentElement.lang = bahasa;
  document.querySelectorAll("[data-t]").forEach(el => el.textContent = t(el.dataset.t));
  document.querySelectorAll("[data-a]").forEach(el => el.setAttribute("aria-label", t(el.dataset.a)));
  document.querySelectorAll(".bahasa button").forEach(b => b.setAttribute("aria-pressed", b.dataset.l === bahasa));
  hitung();
}
document.querySelectorAll(".bahasa button").forEach(b => b.addEventListener("click", () => {
  bahasa = b.dataset.l;
  terapkanBahasa();
}));

nilaiEl.addEventListener("input", hitung);
terapkanBahasa();