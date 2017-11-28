'use strict';
document.addEventListener('DOMContentLoaded', function () {
  // Открываем и закрываем меню в мобильной версиии
  var mobileMenuBox = document.querySelector('.mobile-menu-box');
  var body = document.body;

  document.querySelector('.open-menu-btn').onclick = function (event) {
    event.preventDefault();
    mobileMenuBox.classList.remove('close');
    mobileMenuBox.classList.add('open');
    mobileMenuBox.style.opacity = 100;
    body.classList.add('mobile-menu-hidden');
  };

  document.querySelector('.close-menu-btn').onclick = function (event) {
    event.preventDefault();
    mobileMenuBox.style.opacity = 0;
    mobileMenuBox.classList.remove('open');
    mobileMenuBox.classList.add('close');
    body.classList.remove('mobile-menu-hidden');
  };
});
