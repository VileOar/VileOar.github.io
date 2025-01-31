class Header extends HTMLElement {
  connectedCallback() {
    var fileName = location.href.split("/").slice(-1)[0];
    let activeClass = ' class="active"';
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
              <li><a href="index.html"${(fileName == 'index.html')?activeClass:''}>Home</a></li>
              <li><a href="about.html"${(fileName == 'about.html')?activeClass:''}>About</a></li>
              <li><a href="resume.html"${(fileName == 'resume.html')?activeClass:''}>Resume</a></li>
              <li><a href="services.html"${(fileName == 'services.html')?activeClass:''}>Services</a></li>
              <li><a href="portfolio.html"${(fileName == 'portfolio.html')?activeClass:''}>Portfolio</a></li>
              <li><a href="contact.html"${(fileName == 'contact.html')?activeClass:''}>Contact</a></li>
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

let headContent = `
    <!-- Favicons -->
  <link href="assets/img/favicon.png" rel="icon">
  <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon">

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com" rel="preconnect">
  <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">

  <!-- Vendor CSS Files -->
  <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
  <link href="assets/vendor/aos/aos.css" rel="stylesheet">
  <link href="assets/vendor/swiper/swiper-bundle.min.css" rel="stylesheet">
  <link href="assets/vendor/glightbox/css/glightbox.min.css" rel="stylesheet">

  <!-- Main CSS File -->
  <link href="assets/css/main.css" rel="stylesheet">

  <!-- =======================================================
  * Template Name: Personal
  * Template URL: https://bootstrapmade.com/personal-free-resume-bootstrap-template/
  * Updated: Aug 07 2024 with Bootstrap v5.3.3
  * Author: BootstrapMade.com
  * License: https://bootstrapmade.com/license/
  ======================================================== -->
`
// apply common reusable head content
document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend", headContent);

// apply common reusable footer and header
customElements.define('custom-header', Header);
customElements.define('custom-footer', Footer);