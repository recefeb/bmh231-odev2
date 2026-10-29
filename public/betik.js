const etkinlikler = [
  { id: 1, baslik: "Web Programlama Atölyesi", tur: "atolye", tarih: "2026-11-12", yer: "Mühendislik Fakültesi, Lab 2", kontenjan: 30 },
  { id: 2, baslik: "Git ve GitHub Atölyesi", tur: "atolye", tarih: "2026-11-14", yer: "Mühendislik Fakültesi, Lab 1", kontenjan: 20 },
  { id: 3, baslik: "Oyun Geliştirme Topluluğu Tanışma Buluşması", tur: "topluluk", tarih: "2026-11-21", yer: "Mühendislik Fakültesi, Seminer Salonu", kontenjan: 50 },
  { id: 4, baslik: "Oyun Sektöründe Kariyer Söyleşisi", tur: "soylesi", tarih: "2026-11-24", yer: "Mühendislik Fakültesi, Konferans Salonu", kontenjan: 150 },
  { id: 5, baslik: "Backend Geliştirici Olmak Söyleşisi", tur: "soylesi", tarih: "2026-11-26", yer: "Mühendislik Fakültesi, Konferans Salonu", kontenjan: 100 },
  { id: 6, baslik: "Mini Oyun Yarışması Hazırlık Toplantısı", tur: "topluluk", tarih: "2026-11-27", yer: "Mühendislik Fakültesi, Seminer Salonu", kontenjan: 75 }
];

const turAdlari = {
  atolye: "Atölye",
  soylesi: "Söyleşi",
  topluluk: "Topluluk"
};

const kartlarKabi = document.getElementById("kartlar");

function kartOlustur(etkinlik) {
  const kart = document.createElement("article");
  kart.className = "kart";

  const baslik = document.createElement("h2");
  baslik.textContent = etkinlik.baslik;

  const tarih = document.createElement("p");
  tarih.textContent = new Date(etkinlik.tarih).toLocaleDateString("tr-TR");

  const yer = document.createElement("p");
  yer.textContent = etkinlik.yer;

  const kontenjan = document.createElement("p");
  kontenjan.textContent = "Kontenjan: " + etkinlik.kontenjan;

  const tur = document.createElement("span");
  tur.className = "etiket";
  tur.textContent = turAdlari[etkinlik.tur];

  kart.append(baslik, tarih, yer, kontenjan, tur);
  return kart;
}

function kartlariCiz(liste) {
  kartlarKabi.replaceChildren();
  for (const etkinlik of liste) {
    kartlarKabi.append(kartOlustur(etkinlik));
  }
}

let seciliTur = "hepsi";
let aramaMetni = "";

const filtreDugmeleri = document.querySelectorAll(".filtreler button");
const aramaKutusu = document.getElementById("arama");
const durum = document.getElementById("durum");

function filtreleVeCiz() {
  const sonuc = etkinlikler.filter(function (etkinlik) {
    const turUyuyor = seciliTur === "hepsi" || etkinlik.tur === seciliTur;
    const aramaUyuyor = etkinlik.baslik.toLowerCase().includes(aramaMetni.toLowerCase());
    return turUyuyor && aramaUyuyor;
  });

  durum.textContent = sonuc.length === 0 ? "Aramanıza uygun etkinlik yok." : "";
  kartlariCiz(sonuc);
}

filtreDugmeleri.forEach(function (dugme) {
  dugme.addEventListener("click", function () {
    seciliTur = dugme.dataset.tur;

    filtreDugmeleri.forEach(function (d) {
      d.classList.remove("secili");
    });
    dugme.classList.add("secili");

    filtreleVeCiz();
  });
});

aramaKutusu.addEventListener("input", function () {
  aramaMetni=aramaKutusu.value;
  filtreleVeCiz();
});

filtreleVeCiz();

