/**
 * Init isotope layout and filters
 */
(function() {
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
          if (!wasActive) { // if the current one was not active before, make it active now
            this.classList.add('filter-active');
          } // otherwise it was active, so it should be toggled off (which it was already in the block before)

          // collect information about all active filters of this isotope layout
          let filterStr = "";
          isotopeItem.querySelectorAll('.isotope-filters .filter-active').forEach(function(fil, ix, lst) {
            filterStr += fil.getAttribute('data-filter');
            if (ix != lst.length-1) {
              filterStr += ", "; // do not add a comma if last element
            }
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
})();

