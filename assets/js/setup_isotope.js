/**
 * Init isotope layout and filters
 */
//initIsotopes(); // call on ready for any existing manual isotope layouts (DON'T DO THIS)

function initIsotopes() {
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    // setup the filter groups

    // for each group of filters
    isotopeItem.querySelectorAll('.isotope-filters').forEach(function(filterGroup) {
      // for each filter item in that group
      filterGroup.querySelectorAll('li').forEach(function(filterItem) {
        filterItem.addEventListener('click', function() {
          let wasActive = this.classList.contains('filter-active');
          // toggle off all filters
          filterGroup.querySelectorAll('.filter-active').forEach(function(otherFilter) {
            otherFilter.classList.remove('filter-active');
          });
          if (wasActive) { // if the current one was active, it means it has been deactivated, so activate the default filter
            filterGroup.querySelector('.default-filter').classList.add('filter-active');
          }
          else { // if the current one was not active before, make it active now
            this.classList.add('filter-active');
          }

          // collect information about all active filters of this isotope layout
          let filterStr = "";
          isotopeItem.querySelectorAll('.isotope-filters .filter-active').forEach(function(fil) {
            filterStr += fil.getAttribute('data-filter');
          });

          // apply filters
          initIsotope.arrange({
            filter: filterStr
          });
          
          if (typeof aosInit === 'function') {
            aosInit();
          }
        }, false);
      });
    });
  });
}