let etkinlikler = [];

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
  aramaMetni = aramaKutusu.value;
  filtreleVeCiz();
});

const oneriFormu = document.getElementById("oneri-formu");
const formMesaj = document.getElementById("form-mesaj");

oneriFormu.addEventListener("submit", function (olay) {
  olay.preventDefault();

  const ad = document.getElementById("ad").value.trim();
  const tarih = document.getElementById("tarih").value;
  const eposta = document.getElementById("eposta").value.trim();

  const hatalar = [];

  if (ad.length < 5) {
    hatalar.push("Etkinlik adı en az 5 karakter olmalı.");
  }

  if (tarih === "") {
    hatalar.push("Tarih boş olamaz.");
  } else {
    const secilen = new Date(tarih + "T00:00:00");
    const bugun = new Date();
    bugun.setHours(0, 0, 0, 0);
    if (secilen < bugun) {
      hatalar.push("Tarih geçmiş bir gün olamaz.");
    }
  }

  const epostaKalibi = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!epostaKalibi.test(eposta)) {
    hatalar.push("Geçerli bir e-posta adresi girin.");
  }

  if (hatalar.length > 0) {
    formMesaj.textContent = hatalar.join(" ");
    formMesaj.className = "hata";
  } else {
    formMesaj.textContent = "Teşekkürler, öneriniz alındı.";
    formMesaj.className = "basari";
    oneriFormu.reset();
  }
});

async function etkinlikleriYukle() {
  durum.classList.remove("hata");
  durum.textContent = "Yükleniyor...";
  try {
    const yanit = await fetch("/api/etkinlikler");
    if (!yanit.ok) {
      throw new Error("Sunucu hatası: " + yanit.status);
    }
    etkinlikler = await yanit.json();
    durum.textContent = "";
    filtreleVeCiz();
  } catch (hata) {
    durum.textContent = "Etkinlikler yüklenemedi. Lütfen daha sonra tekrar deneyin.";
    durum.classList.add("hata");
  }
}

etkinlikleriYukle();