if ('serviceWorker' in navigator) {
  // Killing off all known SW for this site.
  caches.keys().then((cacheKeys) => Promise.all(cacheKeys.map((key) => caches.delete(key))));
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}

const deferLoadIframe = (iframe) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const src = iframe.getAttribute("data-src");
        iframe.setAttribute("src", src);
        observer.unobserve(iframe);
      }
    });
  });
  observer.observe(iframe);
}

window.addEventListener("load", function () {
  var iframes = document.getElementsByTagName("iframe");
  for (var i = 0; i < iframes.length; i++) {
    var ifr = iframes[i];
    if (ifr.hasAttribute("data-src")) {
      if ('IntersectionObserver' in window) {
        deferLoadIframe(ifr);
      }
      else {
        var src = ifr.getAttribute("data-src");
        ifr.setAttribute("src", src);
      }
    }
  }

  var shareButtons = document.querySelectorAll('div.share');

  for (var shareButton of shareButtons) {
    shareButton.addEventListener("click", function (event) {
      event.preventDefault();
      var shareUrl = event.target.getAttribute('url') || '';
      var shareTitle = event.target.getAttribute('title') || '';
      if (navigator.share) {
        navigator.share({
          url: shareUrl,
          title: shareTitle,
          text: shareTitle
        }).then(function () { ga('send', 'event', 'share', 'success'); },
          function (error) { ga('send', 'event', 'share', 'error', error); });
      } else {
        var windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=520,height=420';
        var twitterUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareTitle) + '&url=' + encodeURIComponent(shareUrl);
        window.open(twitterUrl, 'intent', windowOptions);
      }
    });
  }
});

window.onbeforeinstallprompt = function (e) {
  e.preventDefault();
  ga('send', 'event', 'install', 'prompt');
};

/**********************************************************
**     Handles light/dark switcher
***********************************************************/

function t(t) {
    document.documentElement.setAttribute("data-theme", t)
}

function e() {
    var t = null;
    try {
        t = localStorage.getItem("theme")
    } catch (t) {}
    return t
}
var n = window.matchMedia("(prefers-color-scheme: dark)");
n.addListener((function(n) {
    null === e() && t(n.matches ? "dark" : "")
}));
var a = e();
null !== a ? t(a) : n.matches && t("dark")

/**********************************************************
**     Handles tab short codes
***********************************************************/

$(document).ready(function () {

    $('.tab-content').find('.tab-pane').each(function (idx, item) {
        var navTabs = $(this).closest('.code-tabs').find('.nav-tabs'),
            title = $(this).attr('title');
        //navTabs.append('<li><a href="#">' + title + '</a></li');
        navTabs.append('<button class="button button--info">' + title + '</button>');
    });

    updateCurrentTab()


    $('.nav-tabs button').click(function (e) {
        e.preventDefault();
        var tab = $(this),
                  tabIndex = tab.index(),
                  tabPanel = $(this).closest('.code-tabs'),
                  tabPane = tabPanel.find('.tab-pane').eq(tabIndex);
        tabPanel.find('.is-active').removeClass('is-active');
        tab.addClass('is-active');
        tabPane.addClass('is-active');

        // Store the number of config language selected in users' localStorage
         if(window.localStorage) {
            window.localStorage.setItem("configLangPref", tabIndex + 1)
         }

         // After click update here not only selected part of code but others
         updateCurrentTab()

    });

    function updateCurrentTab() {
        var holder = '.nav-tabs button'

        // By default current tab number is 1
        var tabNumber = 1

        // Get saved tab number
        if (window.localStorage.getItem('configLangPref')) {
           tabNumber = window.localStorage.getItem('configLangPref')
        }

        // Remove 'active' code to avoid multiple examples of code
        $('.nav-tabs button').closest('.code-tabs').find('.is-active').removeClass('is-active');

        // Set 'active' state to current li(language) and div(code) by tabNumber
        $('.code-tabs div.nav-tabs').find("button:nth-of-type(" + tabNumber + ")" ).addClass('is-active');
        $('.code-tabs .tab-content').find("div:nth-of-type(" + tabNumber + ")").addClass('is-active');

    }
});
