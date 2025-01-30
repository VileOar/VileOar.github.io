class Header extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header id="header" class="header d-flex align-items-center sticky-top">            
        <div class="container-fluid container-xl position-relative d-flex flex-column align-items-center justify-content-between">

          <a href="index.html" class="logo d-flex align-items-center">
            <!-- Uncomment the line below if you also wish to use an image logo -->
            <!-- <img src="assets/img/logo.png" alt=""> -->
            <h1 class="sitename">Pedro Valério</h1>
          </a>

          <nav id="navmenu" class="navmenu">
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="about.html">About</a></li>
              <li><a href="resume.html">Resume</a></li>
              <li><a href="services.html">Services</a></li>
              <li><a href="portfolio.html">Portfolio</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
            <i class="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>

        </div>
      </header>
    `;
  }
}

class Footer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `    
      <footer id="footer" class="footer dark-background">
        <div class="container">
          <div class="container">
            <div class="copyright">
              <span>Copyright</span> <strong class="px-1 sitename">Personal</strong> <span>All Rights Reserved</span>
            </div>
            <div class="credits">
              <!-- All the links in the footer should remain intact. -->
              <!-- You can delete the links only if you've purchased the pro version. -->
              <!-- Licensing information: https://bootstrapmade.com/license/ -->
              <!-- Purchase the pro version with working PHP/AJAX contact form: [buy-url] -->
              Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
            </div>
          </div>
        </div>
      </footer>   
    `;
  }
}

customElements.define('custom-header', Header);
customElements.define('custom-footer', Footer);