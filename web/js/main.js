var activityList = require('./activityList.js');
var mainActivity = require('./mainActivity.js');
var search = require('./search.js');

var i18n = require('./i18n.js');
i18n.setup();

var goBasedOnUrl = function () {
  if ($('body').data('oldPathname') === window.location.pathname) {
    return;
  } else {
    $('body').data('oldPathname', window.location.pathname);
  }

  if (!window.location.pathname || window.location.pathname === '/') {
    document.title = i18n.get('Sugar Activities');
    var container = $('.detail');
    container.addClass('hide');
  }

  if (window.location.pathname && !window.location.changedByProgram) {
    var testString = window.location.pathname;
    var r = /\/view\/([^\/]*)$/;
    match = r.exec(testString);
    if (match) {
      var bundleId = match[1];
      $.ajax({ url: '/data/' + bundleId + '.json' }).done(function (data) {
        mainActivity.load(data, bundleId, false, true);
      });
    }
  }
  window.location.changedByProgram = false;
};

var updateCache = function () {
  $.ajax({ url: '/bundle' }).done(function (d) {
    lens = [parseInt(d.substr(0, 7)), parseInt(d.substr(7, 7)),
            parseInt(d.substr(14, 7)), parseInt(d.substr(21, 7))];
    localStorage.js = d.substr(7*4, lens[0]);
    localStorage.css = d.substr(7*4+lens[0], lens[1]);
    localStorage.html = d.substr(7*4+lens[0]+lens[1], lens[2]);
    localStorage.data = d.substr(7*4+lens[0]+lens[1]+lens[2], lens[3]);
    localStorage.hasCache = 'true';

    var datajson = JSON.parse(localStorage.data);
    $('body').data('activitiesData', datajson.activities);
    $('body').data('featuredData', datajson.featured);
    activityList.setup();

    setTimeout(updateCache, 1000 * 60 * 5);  // 5 min
  });
};

window.replaceCache = updateCache;

var dataUrl = '/data.json';
$(document).ready(function () {
  if (window.location.pathname === '/' || window.location.pathname.substr(0, 5) === '/view') {
    var list = $('.activities');
    var detail = $('.detail');

    var data = JSON.parse(localStorage.data)
    $('body').data('activitiesData', data.activities);
    $('body').data('featuredData', data.featured);
    activityList.setup();

    setTimeout(updateCache, 1000 * 30);  // 30sec

    setInterval(goBasedOnUrl, 750);
    goBasedOnUrl();

    search.setup();
  }
});
