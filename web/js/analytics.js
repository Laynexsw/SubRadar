/**
 * SubRadar — Real-Time User Activity & Interaction Telemetry Engine
 * 
 * Sitedeki her hareketi, tıklamayı, kaydırma derinliğini ve aktif saniyeleri
 * gerçek zamanlı olarak izler ve kaydeder.
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'sr-activity-metrics';
  var STREAM_KEY = 'sr-activity-stream';

  var sessionStart = Date.now();
  var activeSeconds = 0;
  var maxScrollDepth = 0;
  var clickCount = 0;
  var mouseMoveCount = 0;
  var currentSection = 'hero';
  var activityStream = [];

  // Canlı Saniye Sayacı
  setInterval(function () {
    activeSeconds++;
    var badge = document.getElementById('sr-active-seconds-badge');
    if (badge) {
      badge.textContent = 'Oturum: ' + activeSeconds + 's · Canlı İzleniyor';
    }

    var badgeText = document.getElementById('sr-active-seconds');
    if (badgeText) {
      badgeText.textContent = 'Oturum: ' + activeSeconds + 's izleniyor';
    }
  }, 1000);

  // Tıklama Takibi (Her tıklanan elemanı koordinat ve etiketiyle kaydeder)
  document.addEventListener('click', function (e) {
    clickCount++;
    var target = e.target;
    var identifier = target.id ? ('#' + target.id) : (target.className ? ('.' + String(target.className).split(' ')[0]) : target.tagName);
    var textSnippet = (target.textContent || '').trim().substring(0, 30);

    var eventItem = {
      type: 'click',
      target: identifier,
      text: textSnippet,
      x: e.clientX,
      y: e.clientY,
      t: Math.round((Date.now() - sessionStart) / 100) / 10
    };

    activityStream.push(eventItem);
    if (activityStream.length > 100) activityStream.shift();

    try {
      sessionStorage.setItem(STREAM_KEY, JSON.stringify(activityStream));
    } catch (err) {}
  }, true);

  // Fare Hareketi Takibi (Etkileşim Yoğunluğu)
  document.addEventListener('mousemove', function () {
    mouseMoveCount++;
  }, { passive: true });

  // Kaydırma Derinliği (Scroll Depth %)
  window.addEventListener('scroll', function () {
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      var depth = Math.round((window.scrollY / docHeight) * 100);
      if (depth > maxScrollDepth) {
        maxScrollDepth = depth;
      }
    }
  }, { passive: true });

  // Görüntülenen Bölüm Tespiti
  var sections = ['hero', 'problem', 'statement-lab', 'hesaplayici', 'karsilastirma', 'ozellikler', 'mimari', 'isletim-sistemleri', 'fiyatlandirma', 'sss'];
  setInterval(function () {
    var middle = window.scrollY + (window.innerHeight / 2);
    for (var i = 0; i < sections.length; i++) {
      var el = document.getElementById(sections[i]);
      if (el) {
        var top = el.offsetTop;
        var bottom = top + el.offsetHeight;
        if (middle >= top && middle <= bottom) {
          currentSection = sections[i];
          break;
        }
      }
    }
  }, 1500);

  // Global Telemetri API
  window.srAnalytics = {
    track: function (name, data) {
      activityStream.push({ type: 'custom', name: name, data: data, t: activeSeconds });
    },
    getSummary: function () {
      return {
        sessionSeconds: activeSeconds,
        clicks: clickCount,
        mouseMoves: mouseMoveCount,
        maxScrollDepth: maxScrollDepth + '%',
        currentSection: currentSection,
        recentEvents: activityStream.slice(-10)
      };
    },
    getStream: function () {
      return activityStream;
    }
  };
})();
