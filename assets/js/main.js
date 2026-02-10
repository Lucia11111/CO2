/* ============================================
   CO2AIR — Main JavaScript
   ============================================ */

(function () {
  'use strict';

  /* --- Scroll Animations (IntersectionObserver) --- */
  function initScrollAnimations() {
    var elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* --- Mobile Navbar Toggle --- */
  function initMobileNav() {
    var hamburger = document.getElementById('nav-hamburger');
    var navLinks = document.getElementById('nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  /* --- Smooth Scroll for Anchor Links --- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        var navHeight = document.querySelector('.navbar').offsetHeight;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  /* --- Navbar Background on Scroll --- */
  function initNavbarScroll() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    });
  }

  /* --- Stripe Checkout --- */
  function initStripeCheckout() {
    var btn = document.getElementById('checkout-btn');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var config = window.CO2AIR_CONFIG;
      if (!config || !config.stripeKey || config.stripeKey.indexOf('XXXX') !== -1) {
        alert('Stripe is not configured yet. Replace the placeholder keys in hugo.toml with your real Stripe keys.');
        return;
      }

      var stripe = Stripe(config.stripeKey);
      stripe.redirectToCheckout({
        lineItems: [{ price: config.priceId, quantity: 1 }],
        mode: 'payment',
        successUrl: config.successURL,
        cancelUrl: config.cancelURL
      }).then(function (result) {
        if (result.error) {
          alert(result.error.message);
        }
      });
    });
  }

  /* --- Init Everything --- */
  document.addEventListener('DOMContentLoaded', function () {
    initScrollAnimations();
    initMobileNav();
    initSmoothScroll();
    initNavbarScroll();
    initStripeCheckout();
  });
})();
