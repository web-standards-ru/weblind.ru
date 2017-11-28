'use strict';
;document.addEventListener('DOMContentLoaded', function () {
  var $topMenu = $('#vertical-menu');
  var $header = $('header');
  var $sidebar = $('#sidebar > div.js-sidebar-fixed');
  var sidebarWidth = $sidebar.width();
  var $sidebarScroll = $('.sidebar-scroll');
  var sidebarClientWidth = $sidebarScroll.prop('clientWidth');
  var hoveredSidebarClientWidth = null;
  var $stickyBlock = $('.js-sidebar-fixed');
  var $stickyContainer = $('.js-sidebar-fixed-container');
  var $activeMenuItem = $('li.active');
  var throttleAdaptMenu = false;
  var timerToPreventScrollAdaptWhenClickLink;
  var preventScrollAdaptWhenClickLink = false;
  var preventRunningActiveMenuItem = false;
  var timerToHideScrollbar;
  var timerToPreventRunningActiveMenuItem;
  var $window = $(window);
  var $body = $('body');
  var $document = $(document);
  var $htmlBody = $('html, body');
  var $stickyTitle = $('.js-sticky-title');
  var $mobileMenuBox = $('.mobile-menu-box');
  var headerOffsetLeft = $('header .logo-text').offset().left;
  var $verticalMenuItems = $('#vertical-menu ul li');

  $stickyBlock.length !== 0 ? $stickyBlock.css('left', ($stickyContainer.offset().left + 20)) : '';

  // адаптирует уровень прокрутки меню, если активный пункт за пределами видимости
  var adaptMenu = function ($activeMenuItem) {
    if (!$topMenu.offset() || preventScrollAdaptWhenClickLink) return;

    var topMenuScrollTopPosition = $topMenu.offset().top + $topMenu.parent().parent().scrollTop();
    var lowerVisibilityBorder = topMenuScrollTopPosition + $window.height() - $activeMenuItem.height();
    var upperVisibilityBorder = topMenuScrollTopPosition + $activeMenuItem.height();

    if ($activeMenuItem.length === 0) {
      $activeMenuItem = $('.sidebar-scroll a[href="' + window.location.hash + '"]')
    }

    if (lowerVisibilityBorder < $activeMenuItem.offset().top) {
      var howFarIsActiveMenuItem = $activeMenuItem.offset().top - lowerVisibilityBorder;

      $topMenu.parent().parent().stop().animate({
        scrollTop: $topMenu.parent().parent().scrollTop() + howFarIsActiveMenuItem + $window.height() / 2
      });
      clearTimeout(timerToHideScrollbar);
      $sidebar.trigger('mouseenter');
      timerToHideScrollbar = setTimeout(function () {
        $sidebar.trigger('mouseleave');
      }, 1500);
    }

    if (upperVisibilityBorder > $activeMenuItem.offset().top) {
      $topMenu.parent().parent().stop().animate({
        scrollTop: $topMenu.parent().parent().scrollTop() - ($topMenu.parent().parent().scrollTop()
          - ($activeMenuItem.offset().top - $topMenu.offset().top) + ($window.height() / 2) - $activeMenuItem.height())
      });
      clearTimeout(timerToHideScrollbar);
      $sidebar.trigger('mouseenter');
      timerToHideScrollbar = setTimeout(function () {
        $sidebar.trigger('mouseleave');
      }, 1500);
    }
  };

  // Открываем и закрываем меню в мобильной версиии
  $('.open-menu-btn').click(function (event) {
    event.preventDefault();
    $mobileMenuBox.removeClass('close').addClass('open').animate({opacity: 1}, 150);
    $body.addClass('mobile-menu-hidden');
  });

  $('.close-menu-btn').click(function (event) {
    event.preventDefault();
    $mobileMenuBox.animate({
      opacity: 0
    }, 150, function () {
      $(this).removeClass('open').addClass('close');
    });
    $body.removeClass('mobile-menu-hidden');
  });

  $('.mobile-menu a').click(function (event) {
    event.preventDefault();
    var href = $(this).attr('href');
    var offsetTop = href === '#' ? 0 : $(href).offset().top;
    var menuOffsetAttr = $(this).attr('data-id');

    $mobileMenuBox.animate({
      opacity: 0
    }, 150, function () {
      $(this).removeClass('open').addClass('close');
      $window.trigger('scroll');
    });

    $body.removeClass('mobile-menu-hidden');
    offsetTop = menuOffsetAttr === 'offset-60' ? offsetTop - 70 : offsetTop - 30;

    $htmlBody.stop().animate({
      scrollTop: offsetTop
    }, 200);
  });

  if ($window.width() < 768) {
    var block = window.location.hash.split('-');
    var block2 = block[0].slice(1);
    var windowTop = null;
    var href = '#parent-' + block2;
    var stickyTitle = $(href).children('.js-sticky-title');
    var hrefTop;

    // при переходе с главной подстраиваем position sticky. Иначе osition sticky будет наезжать на текст
    setTimeout(function () {
      $('.mobile-menu a[href="' + window.location.hash + '"]').trigger('click')
    }, 300);

    if (block2 === 'parent') {
      block2 = block[1];
    }

    if ($(href).offset()) {
      hrefTop = $(href).offset().top;
    }

    windowTop = $window.scrollTop();

    if (windowTop > hrefTop) {
      $stickyTitle.removeClass('border');
      $(stickyTitle).addClass('border');
    }

    // в мобильной версии добавляем нижний бордер для sticky, когда он прилипает к верху окна
    $window.scroll(function () {
      var mobileH2Top = $stickyTitle.offset().top;
      windowTop = $window.scrollTop();

      if (mobileH2Top > windowTop) {
        $stickyTitle.removeClass('border');
        $(stickyTitle).addClass('border');
      }

      block = window.location.hash.split('-');
      block2 = block[0].slice(1);

      if (block2 === 'parent') {
        block2 = block[1];
      }

      href = '#parent-' + block2;
      stickyTitle = $(href).children('.js-sticky-title');

      if ($(href).offset()) {
        $stickyTitle.each(function () {
          if ($(this).offset() && $window.scrollTop() === $(this).offset().top) {
            $stickyTitle.removeClass('border');
            $(this).addClass('border');
          } else if ($window.scrollTop() < $(this).offset().top) {
            $(this).removeClass('border')
          }
        })
      }
    });
  }

  // Ширина сайдбара
  sidebarWidth = $('.sidebar').width();
  $('div.js-sidebar-fixed').width(sidebarWidth + 5);
  sidebarClientWidth = $sidebarScroll.prop('clientWidth');

  // Закрепляем почту и лого вверху и внизу
  $('.js-logo-fixed').css('right', headerOffsetLeft);
  $('.js-link-fixed').css('right', headerOffsetLeft);

  $window.resize(function () {
    $stickyBlock = $('.js-sidebar-fixed');
    $stickyContainer = $('div.js-sidebar-fixed-container');

    headerOffsetLeft = $('header .logo-text').offset().left;

    $('.js-logo-fixed').css('right', headerOffsetLeft);
    $('.js-link-fixed').css('right', headerOffsetLeft);

    if ($stickyContainer && $stickyContainer.offset()) {
      $stickyBlock.css('left', $stickyContainer.offset().left + 20);
      sidebarWidth = $('.sidebar').width();
      $('div.js-sidebar-fixed').width(sidebarWidth + 5);
    }

    sidebarClientWidth = $sidebarScroll.prop('clientWidth');
  });

  $topMenu.find('li a').click(function (event) {
    event.preventDefault();
    var href = $(this).attr('href');
    var offsetTop = href === '#' ? 0 : $(href).offset().top;

    offsetTop = offsetTop - 30;
    $(this).parent().addClass('active');
    $verticalMenuItems.removeClass('active');
    $htmlBody.stop().animate({
      scrollTop: offsetTop
    }, 300);

    // при клике на пункт меню не запускеам adaptMenu()
    preventScrollAdaptWhenClickLink = true;
    clearTimeout(timerToPreventScrollAdaptWhenClickLink);
    timerToPreventScrollAdaptWhenClickLink = setTimeout(function () {
      preventScrollAdaptWhenClickLink = false;
    }, 400);

    // при клике на пункт меню игнорируем событие scroll
    preventRunningActiveMenuItem = true;
    clearTimeout(timerToPreventRunningActiveMenuItem);
    timerToPreventRunningActiveMenuItem = setTimeout(function () {
      preventRunningActiveMenuItem = false;
    }, 500);
  });

  $window.scroll(function (event) {
    var positionTop = $(this).scrollTop();
    $activeMenuItem = $('.sidebar-scroll li.active');

    // отменяем прокрутку всей страници при прокрутке меню колёсиком
    if (wheelEventHappened) {
      $window.scrollTop(prevWindowScrollTop);
    }

    if (!wheelEventHappened) {
      onScroll(event, positionTop);
    }

    prevWindowScrollTop = window.scrollY;
    verticalMenuAdaptToHeader();

    if (!throttleAdaptMenu) {
      throttleAdaptMenu = true;
      adaptMenu($activeMenuItem);
      setTimeout(function () {
        throttleAdaptMenu = false;
      }, 700);
    }
  });

  var verticalMenuAdaptToHeader = function () {
    if ($window.scrollTop() < $header.outerHeight()) {
      $topMenu.parent().parent().css('top', $header.outerHeight() + 47 - $window.scrollTop());
    } else {
      $topMenu.parent().parent().css('top', 0);
    }
  };

  verticalMenuAdaptToHeader();

  // для отмены скролла страницы при скролле сайдбара
  if ($sidebar.length !== 0) {
    $sidebar[0].addEventListener('wheel', function (event) {
      event.preventDefault();
      $topMenu.parent().parent().scrollTop($topMenu.parent().parent().scrollTop() + event.deltaY);
      wheelEventHappened = true;
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(function () {
        wheelEventHappened = false;
      }, 100);
    });
  }

  var wheelTimer;
  var wheelEventHappened = false;
  var prevWindowScrollTop = $window.scrollTop();
  var currentUrlState;
  var updateUrlAndAdoptMenuCalled = false;
  var updateUrlAndAdoptMenuTimer;

  function onScroll() {
    var scrollPos = $document.scrollTop();

    $('#vertical-menu a').each(function () {
      var currLink = $(this);
      var refElement = $(currLink.attr('href'));
      var refElementId = refElement.attr('id');

      function updateUrlAndAdoptMenu(refElementId) {
        clearTimeout(updateUrlAndAdoptMenuTimer);
        updateUrlAndAdoptMenuCalled = true;

        updateUrlAndAdoptMenuTimer = setTimeout(function () {
          history.pushState({id: refElementId}, '', 'inner.html#' + refElementId);
        }, 250);

      }

      if (refElement.position().top - 40 <= scrollPos && refElement.position().top + refElement.height() >= scrollPos) {
        if (scrollPos / $document.height() * 100 > 95) {
          if (!preventRunningActiveMenuItem) {
            $verticalMenuItems.removeClass('active');
            $('#vertical-menu a[href="#health"]').parent().addClass('active');
          }

          if (currentUrlState !== 'health') {
            currentUrlState = 'health';
            updateUrlAndAdoptMenu(refElementId);
            updateUrlAndAdoptMenu('health');
            adaptMenu(currLink.parent());
          }
        } else {
          if (!preventRunningActiveMenuItem) {
            $verticalMenuItems.removeClass('active');
            currLink.parent().addClass('active');
          }

          if (currentUrlState !== refElementId) {
            currentUrlState = refElementId;
            updateUrlAndAdoptMenu(refElementId);
            updateUrlAndAdoptMenu(refElementId);
            adaptMenu(currLink.parent());
          }
        }
      }
    });
  }

  hoveredSidebarClientWidth = sidebarClientWidth - 17;
  var sidebarHandlerIn = function () {
    var currentPaddingRight = +$sidebarScroll.css('padding-right').slice(0, -2);
    $sidebar.css({
      overflow: 'auto',
      'padding-right': '2rem'
    });
    hoveredSidebarClientWidth = $sidebarScroll.prop('clientWidth');
    $sidebarScroll.css('padding-right', currentPaddingRight - (sidebarClientWidth - hoveredSidebarClientWidth) + 'px');
    clearTimeout(timerToHideScrollbar);

  };

  var sidebarHandlerOut = function () {
    var currentPaddingRight = +$sidebarScroll.css('padding-right').slice(0, -2);
    $sidebar.css({
      overflow: 'hidden',
      'padding-right': 0
    });
    $sidebarScroll.css('padding-right', currentPaddingRight + (sidebarClientWidth - hoveredSidebarClientWidth) + 'px');
  };

  // делает так, чтобы сайдбар не влиял на ширину контента
  $sidebar.hover(sidebarHandlerIn, sidebarHandlerOut).trigger('mouseenter').trigger('mouseleave');

  // Для корректной работы кнопки "назад" в браузере
  var prevHistoryState;
  window.onpopstate = function () {
    if (!window.history.state) {
      window.location.href = '/'
    } else if (prevHistoryState && window.history.state.id === prevHistoryState) {
      window.history.back();
    } else {
      prevHistoryState = window.history.state.id;
      $('#vertical-menu a[href="#' + window.history.state.id + '"]').trigger('click');
    }
  };

  // решает проблему адаптации сайдбара при обновлении или открытии страницы в новом окне
  setTimeout(function () {
    adaptMenu($sidebar.find('#vertical-menu a[href="' + window.location.hash + '"]').parent());
  }, 500);

  // Iframe video lazy loading
  setupVideoPreload();

  function setupVideoPreload() {
    var videoElements = document.querySelectorAll('.video');

    for (var i = 0; i < videoElements.length; i++) {
      preloadVideo(videoElements[i]);
    }
  }

  function preloadVideo(videoElement) {
    var playButton = videoElement.querySelector('.video__button');
    var cover = videoElement.querySelector('.video__media');
    var videoId = parseCoverURL(cover);
    var videoWrapper = videoElement.querySelector('.video__wrapper');

    playButton.addEventListener('click', function () {
      var iframe = makeIframe(videoId);
      videoWrapper.innerHTML = '';
      videoWrapper.appendChild(iframe)
    })
  }

  function parseCoverURL(coverElement) {
    var urlRegExp = /https:\/\/(i\.ytimg\.com\/vi_webp|img\.youtube\.com\/vi)\/([a-zA-Z0-9_-]+)\/(default|hqdefault|mqdefault|sddefault|maxresdefault)\.(jpg|webp)/i;
    var url = coverElement.src;
    var match = url.match(urlRegExp);

    return match[2]
  }

  function makeIframe(videoId) {
    var iframe = document.createElement('iframe');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('src', generateIframeUrl(videoId));
    iframe.classList.add('video__media');

    return iframe
  }

  function generateIframeUrl(videoId) {
    var query = '?rel=0&showinfo=0&autoplay=1';

    return 'https://www.youtube.com/embed/' + videoId + query
  }

});
