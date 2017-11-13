'use strict'
document.addEventListener('DOMContentLoaded', function() {
  // Открываем и закрываем меню в мобильной версиии
  let mobileMenuBox = document.querySelector('.mobile-menu-box');
  document.querySelector('.open-menu-btn').onclick = function (e) {
    e.preventDefault();
    mobileMenuBox.classList.remove('close');
    mobileMenuBox.classList.add('open');
    mobileMenuBox.style.opacity = 100;
    document.body.classList.add('mobile-menu-hidden');
  };

  document.querySelector('.close-menu-btn').onclick = function (e) {
    mobileMenuBox.style.opacity = 0;
    mobileMenuBox.classList.remove('open');
    mobileMenuBox.classList.add('close');
    document.body.classList.remove('mobile-menu-hidden');
    e.preventDefault();
  };
});
