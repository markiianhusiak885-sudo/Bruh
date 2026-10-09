(function () {
  var lista = document.getElementById('lista');
  var brak = document.getElementById('brak');
  var info = document.getElementById('info');
  var stopka = document.getElementById('stopka');
  var przyciski = document.querySelectorAll('#filtry button');
  var dane = null, max = 'all';

  function render() {
    lista.innerHTML = '';
    var s = dane.stacje.filter(function (x) { return max === 'all' || x.minuty <= max; });
    s.sort(function (a, b) { return a.minuty - b.minuty; });
    s.forEach(function (x) {
      var li = document.createElement('li');
      var l = document.createElement('div');
      var n = document.createElement('div'); n.className = 'nazwa'; n.textContent = x.nazwa;
      var m = document.createElement('div'); m.className = 'meta';
      m.textContent = 'Odjazd z Krakowa Gł. ' + dane.odjazd_z_krakowa_glownego + ' → na stacji ' + x.godzina_na_stacji + (x.w_krakowie ? ' · w Krakowie' : '');
      l.appendChild(n); l.appendChild(m);
      var r = document.createElement('div'); r.className = 'czas';
      var b = document.createElement('b'); b.textContent = x.minuty + ' min';
      var z = document.createElement('div'); z.className = 'znak' + (x.zweryfikowane ? '' : ' nie');
      z.textContent = x.zweryfikowane ? '✓ zweryfikowane' : '? niezweryfikowane';
      r.appendChild(b); r.appendChild(z);
      li.appendChild(l); li.appendChild(r); lista.appendChild(li);
    });
    brak.hidden = s.length > 0;
    przyciski.forEach(function (p) { p.classList.toggle('aktywny', p.dataset.max === String(max)); });
  }

  przyciski.forEach(function (p) {
    p.addEventListener('click', function () { max = p.dataset.max === 'all' ? 'all' : Number(p.dataset.max); render(); });
  });

  fetch('data/stations.json').then(function (r) { return r.json(); }).then(function (d) {
    dane = d;
    var teraz = new Date().toISOString().slice(0, 10);
    var uwagi = ['Pociąg kursuje tylko: ' + d.kursuje + '.'];
    if (teraz > d.wazny_do) uwagi.push('Uwaga: rozkład wygasł ' + d.wazny_do + ' — sprawdź nowy na stronie przewoźnika.');
    else if (teraz < d.wazny_od) uwagi.push('Rozkład obowiązuje dopiero od ' + d.wazny_od + '.');
    info.textContent = uwagi.join(' ');
    stopka.innerHTML = d.pociag + ', ' + d.przewoznik + '. Rozkład ważny od ' + d.wazny_od + ' do ' + d.wazny_do +
      ' (pobrano ' + d.pobrano + '). Czas jazdy = godzina na stacji − odjazd z Krakowa Głównego. ' +
      '<a href="' + d.strona_zrodlowa + '">Źródło: Koleje Małopolskie</a>';
    render();
  }).catch(function () { info.textContent = 'Nie udało się wczytać danych (data/stations.json). Uruchom stronę przez serwer HTTP.'; });
})();
