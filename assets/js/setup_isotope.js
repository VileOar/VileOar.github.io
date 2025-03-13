/**
 * Init isotope layout and filters
 */
//initIsotopes(); // call on ready for any existing manual isotope layouts (DON'T DO THIS)

function initIsotopes(getSortData = {}) {
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
        sortBy: sort,
        getSortData: getSortData
      });
    });

    // setup the filter groups

    // for each group of filters
    isotopeItem.querySelectorAll('.isotope-filters').forEach(function(filterGroup) {
      // for each filter item in that group
      filterGroup.querySelectorAll('li').forEach(function(filterItem) {
        filterItem.addEventListener('click', function() {
          // toggle off all filters
          filterGroup.querySelectorAll('.btn-active').forEach(function(otherFilter) {
            otherFilter.classList.remove('btn-active');
          });
          this.classList.add('btn-active');
          let items = isotopeItem.querySelector(`#tags_btns [taglist-ctg="${filterGroup.getAttribute('taglist-ctg')}"]`).querySelector('.toggle-btn:last-child')
          items.innerHTML = this.innerHTML;

          // collect information about all active filters of this isotope layout
          let filterStr = "";
          isotopeItem.querySelectorAll('.isotope-filters .btn-active').forEach(function(fil) {
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

    // for each sorter
    isotopeItem.querySelectorAll('.isotope-sorter').forEach(function(sorter) {
      sorter.querySelectorAll('li').forEach(function(sortItem) {
        sortItem.addEventListener('click', function() {
          sorter.querySelectorAll('.btn-active').forEach(function(otherSort) {
            otherSort.classList.remove('btn-active');
          });
          this.classList.add('btn-active');
          let items = isotopeItem.querySelector(`#tags_btns [taglist-ctg="${sorter.getAttribute('taglist-ctg')}"]`).querySelector('.toggle-btn:last-child')
          items.innerHTML = this.innerHTML;

          let sortBy = this.getAttribute('data-sorter');
          
          if (sortBy === "original") { // special case
            sortBy = 'original-order';
          }

          initIsotope.arrange({
            sortBy: sortBy,
            sortAscending: !(sortBy === "date")
          });
        }, false);
      });
    });
  });
}