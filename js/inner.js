'use strict'
document.addEventListener('DOMContentLoaded', function(){
  let topMenu = $('#vertical-menu'),
    header = $('header'),
    sidebar = $('#sidebar > div.js-sidebar-fixed'),
    sidebarWidth = sidebar.width(),
    sidebarClientWidth = $('.sidebar-scroll').prop("clientWidth"),
    hoveredSidebarClientWidth,
    stickyBlock = $('.js-sidebar-fixed'),
    stickyContainer = $('div.js-sidebar-fixed-container'),
    activeMenuItem = $('li.active'),
    throttleAdaptMenu = false,
    timerToPreventScrollAdaptWhenClickLink,
    preventScrollAdaptWhenClickLink = false,
    preventRunningActiveMenuItem = false,
    timerToHideScrollbar,
    timerToPreventRunningActiveMenuItem;
    stickyBlock.length !==0 ? stickyBlock.css('left', (stickyContainer.offset().left + 20)) : '';

  // адаптирует уровень прокрутки меню, если активный пункт за пределами видимости
  let adaptMenu = function (activeMenuItem) {
    if(!topMenu.offset() || preventScrollAdaptWhenClickLink) return;
    if(activeMenuItem.length === 0) {
      activeMenuItem = $('.sidebar-scroll a[href="' + window.location.hash + '"]')
    }
      let lowerVisibilityBorder = topMenu.offset().top + topMenu.parent().parent().scrollTop() + $(window).height() - activeMenuItem.height(),
        upperVisibilityBorder = topMenu.offset().top + topMenu.parent().parent().scrollTop() + activeMenuItem.height();
    if (lowerVisibilityBorder < activeMenuItem.offset().top) {
      let howFarIsActiveMenuItem = activeMenuItem.offset().top - lowerVisibilityBorder;
      topMenu.parent().parent().stop().animate({
        scrollTop: topMenu.parent().parent().scrollTop() + howFarIsActiveMenuItem + $(window).height() / 2
      });
      clearTimeout(timerToHideScrollbar);
      sidebar.trigger('mouseenter');
      timerToHideScrollbar = setTimeout(function () {
        sidebar.trigger('mouseleave');
      }, 1500)
    }
    if (upperVisibilityBorder > activeMenuItem.offset().top) {
      topMenu.parent().parent().stop().animate({
        scrollTop: topMenu.parent().parent().scrollTop() - (topMenu.parent().parent().scrollTop() - (activeMenuItem.offset().top - topMenu.offset().top) + ($(window).height() / 2) - activeMenuItem.height())
      });
      clearTimeout(timerToHideScrollbar);
      sidebar.trigger('mouseenter');
      timerToHideScrollbar = setTimeout(function () {
        sidebar.trigger('mouseleave');
      }, 1500)
    }
  };

  // Открываем и закрываем меню в мобильной версиии
  $('.open-menu-btn').click(function(e) {
    $('.mobile-menu-box').removeClass('close').addClass('open').animate({opacity: 1}, 150);
    $('body').addClass('mobile-menu-hidden');
    e.preventDefault();
  });

  $('.close-menu-btn').click(function(e) {
    $('.mobile-menu-box').animate({
      opacity: 0
    }, 150, function() {
      $(this).removeClass('open').addClass('close');
    });
    $('body').removeClass('mobile-menu-hidden');
    e.preventDefault();
  });

  $('.mobile-menu a').click(function(e){
    $('.mobile-menu-box').animate({
      opacity: 0
    }, 150, function() {
      $(this).removeClass('open').addClass('close');
      $(window).trigger('scroll')
    });

    $('body').removeClass('mobile-menu-hidden');

    let href = $(this).attr('href'),
      offsetTop = href === "#" ? 0 : $(href).offset().top,
      menuOffsetAttr = $(this).attr('data-id'),
      stickyTitle = $(href).parent('.parent-box').children('.js-sticky-title');

    offsetTop = menuOffsetAttr === 'offset-60' ? offsetTop - 70 : offsetTop - 30;

    $('html, body').stop().animate({
      scrollTop: offsetTop
    }, 200);

    e.preventDefault();
  });

  if ($(window).width() < 768) {

    // в мобильной версии добавляем нижний бордер для sticky, когда он прилипает к верху окна
    $(window).scroll(function() {
      let mobileH2Top = $('.js-sticky-title').offset().top,
        windowTop = $(window).scrollTop();

      if (mobileH2Top > windowTop) {
        $('.js-sticky-title').removeClass('border');
        $(stickyTitle).addClass('border');
      }
    });

    // при переходе с главной подстраиваем position sticky. Иначе osition sticky будет наезжать на текст
    setTimeout(function () {
      $('.mobile-menu a[href="' + window.location.hash + '"]').trigger('click')
    }, 300);
    let block = window.location.hash.split('-');
    let block2 = block[0].slice(1);

    if (block2 === 'parent') {
      block2 = block[1];
    }

    let href = '#parent-' + block2,
      stickyTitle = $(href).children('.js-sticky-title'),
      hrefTop;

    if ($(href).offset()) {
      hrefTop = $(href).offset().top;
    }
    let windowTop = $(window).scrollTop();

    if (windowTop > hrefTop) {
      $('.js-sticky-title').removeClass('border');
      $(stickyTitle).addClass('border');
    }

    $(window).scroll(function(event) {
      block = window.location.hash.split('-');
      block2 = block[0].slice(1);

      if (block2 === 'parent') {
        block2 = block[1];
      }

      href = '#parent-' + block2,
        stickyTitle = $(href).children('.js-sticky-title');

      if($(href).offset()) {
        $('.js-sticky-title').each(function () {
          if ($(this).offset() && $(window).scrollTop() === $(this).offset().top) {
            $('.js-sticky-title').removeClass('border');
            $(this).addClass('border');
          } else if ($(window).scrollTop() < $(this).offset().top){
            $(this).removeClass('border')
          }
        })
      }
    });
  }


  // Ширина сайдбара
  sidebarWidth = $('.sidebar').width();
  $('div.js-sidebar-fixed').width(sidebarWidth + 5);
  sidebarClientWidth = $('.sidebar-scroll').prop("clientWidth");

  // Закрепляем почту и лого вверху и внизу
  let headerOffsetLeft = $('header .logo-text').offset().left;

  $('.js-logo-fixed').css('right', headerOffsetLeft);
  $('.js-link-fixed').css('right', headerOffsetLeft);

  $(window).resize(function () {
    headerOffsetLeft = $('header .logo-text').offset().left;
    $('.js-logo-fixed').css('right', headerOffsetLeft);
    $('.js-link-fixed').css('right', headerOffsetLeft);

      let stickyBlock = $('.js-sidebar-fixed'),
        stickyContainer = $('div.js-sidebar-fixed-container');
    if (stickyContainer && stickyContainer.offset()) {
      stickyBlock.css('left', stickyContainer.offset().left + 20);
      sidebarWidth = $('.sidebar').width();
      $('div.js-sidebar-fixed').width(sidebarWidth + 5);
    }
    sidebarClientWidth = $('.sidebar-scroll').prop("clientWidth");
  });

  topMenu.find("li a").click(function(e) {
    let href = $(this).attr("href"),
      offsetTop = href === "#" ? 0 : $(href).offset().top;
      offsetTop = offsetTop - 30;
    $('#vertical-menu ul li').removeClass("active");
    $(this).parent().addClass('active');
    $('html, body').stop().animate({
      scrollTop: offsetTop
    }, 300);
    e.preventDefault();

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

  $(window).scroll(function(event) {
    activeMenuItem = $('.sidebar-scroll li.active');
    let positionTop = $(this).scrollTop();

    // отменяем прокрутку всей страници при прокрутке меню колёсиком
    if (wheelEventHappened) {
      $(window).scrollTop(prevWindowScrollTop);
    }
    if (!wheelEventHappened) {onScroll(event, positionTop);}
    prevWindowScrollTop = window.scrollY;
    verticalMenuAdaptToHeader();
    if (!throttleAdaptMenu) {
      throttleAdaptMenu = true;
      adaptMenu(activeMenuItem);
      setTimeout(function () {
        throttleAdaptMenu = false;
      }, 700)
    }

  });

  let verticalMenuAdaptToHeader = function () {
    if ($(window).scrollTop() < header.outerHeight()) {
      topMenu.parent().parent().css('top', header.outerHeight() + 47 - $(window).scrollTop())
    } else {
      topMenu.parent().parent().css('top', 0)
    }
  };
  verticalMenuAdaptToHeader();

  // для отмены скролла страницы при скролле сайдбара
  if (sidebar.length !== 0) {
    sidebar[0].addEventListener('wheel', function (e) {
      e.preventDefault();
      topMenu.parent().parent().scrollTop(topMenu.parent().parent().scrollTop() + e.deltaY);
      wheelEventHappened = true;
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(function () {
        wheelEventHappened = false;
      }, 100)
    });
  }
  let wheelTimer;
  let wheelEventHappened = false;
  let prevWindowScrollTop = $(window).scrollTop();
  let currentUrlState;
  let updateUrlAndAdoptMenuCalled = false;
  let updateUrlAndAdoptMenuTimer;

  function onScroll(event, positionTop){
    let scrollPos = $(document).scrollTop();
    $('#vertical-menu a').each(function () {
      let currLink = $(this);
      let refElement = $(currLink.attr("href"));
      let refElementId = refElement.attr("id");

      if (refElement.position().top - 40 <= scrollPos && refElement.position().top + refElement.height() >= scrollPos) {
        if (scrollPos / $(document).height() * 100 > 95) {
          if (!preventRunningActiveMenuItem){
            $('#vertical-menu ul li').removeClass("active");
            $('#vertical-menu a[href="#health"]').parent().addClass("active");
          }
          if (currentUrlState !== 'health') {
            currentUrlState = 'health';
            let updateUrlAndAdoptMenu = function (refElementId) {
              clearTimeout(updateUrlAndAdoptMenuTimer);
              updateUrlAndAdoptMenuCalled = true;
              updateUrlAndAdoptMenuTimer = setTimeout(function () {
                history.pushState({id: refElementId}, "", "inner.html#" + refElementId);
              },250);

            };
            updateUrlAndAdoptMenu('health');
            adaptMenu(currLink.parent());
          }
        } else {
          if (!preventRunningActiveMenuItem) {
            $('#vertical-menu ul li').removeClass("active");
            currLink.parent().addClass("active");
          }
          if (currentUrlState !== refElementId) {
            currentUrlState = refElementId;
            let updateUrlAndAdoptMenu = function (refElementId) {
              clearTimeout(updateUrlAndAdoptMenuTimer);
              updateUrlAndAdoptMenuCalled = true;
              updateUrlAndAdoptMenuTimer = setTimeout(function () {
                history.pushState({id: refElementId}, "", "inner.html#" + refElementId);
              },250);
            };
            updateUrlAndAdoptMenu(refElementId);
            adaptMenu(currLink.parent());
          }
        }
      }
      else{
      }
    });
  }

  hoveredSidebarClientWidth = sidebarClientWidth - 17;
  let sidebarHandlerIn = function () {
    sidebar.css('overflow', 'auto');
    sidebar.css('padding-right', '2rem');
    let currentPaddingRight = +$(".sidebar-scroll").css('padding-right').slice(0, -2);
    hoveredSidebarClientWidth = $(".sidebar-scroll").prop("clientWidth");
    $(".sidebar-scroll").css('padding-right', currentPaddingRight - (sidebarClientWidth - hoveredSidebarClientWidth) + 'px');
    clearTimeout(timerToHideScrollbar);

  };

  let sidebarHandlerOut = function () {
    sidebar.css('overflow', 'hidden');
    sidebar.css('padding-right', '0');
    let currentPaddingRight = +$(".sidebar-scroll").css('padding-right').slice(0, -2);
    $(".sidebar-scroll").css('padding-right', currentPaddingRight + (sidebarClientWidth - hoveredSidebarClientWidth) + 'px');
  };

  // делает так, чтобы сайдбар не влиял на ширину контента
  sidebar.hover(sidebarHandlerIn, sidebarHandlerOut);
  sidebar.trigger('mouseenter');
  sidebar.trigger('mouseleave');

  // Для корректной работы кнопки "назад" в браузере
  let prevHistoryState;
  window.onpopstate = function () {
    if (!window.history.state) {
      window.location.href = '/'
  } else if (prevHistoryState && window.history.state.id === prevHistoryState){
      window.history.back();
    } else {
      prevHistoryState = window.history.state.id;
      $('#vertical-menu a[href="#' + window.history.state.id + '"]').trigger('click')
    }
  };
  // решает проблему адаптации сайдбара при обновлении или открытии страницы в новом окне
  setTimeout(function () {
    adaptMenu(sidebar.find('#vertical-menu a[href="' + window.location.hash + '"]').parent())
  }, 500)

});
