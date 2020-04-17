<script
  src="https://code.jquery.com/jquery-3.4.1.min.js"
  integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
  crossorigin="anonymous"></script>

<script>

window.customFilterSettings = {
    'targets': [{
        container: '#block-yui_3_17_2_1_1584905868337_5160',
        items: 'tbody .table-row',
        settings: {
            // position: 'top',
            showItemsCount: false,
            requestAttrWithAjax: false,
          	// customClasses: 'lite-dropdowns cf-ctrls-inline',
          	// align: 'space-between',
          	// mobilePanel: {
           //  	enabled: false
           //  },
            search: {
              text: "Search by instrument, genre, or name"
            },
          	pagination: {
            	enabled: true,
              	pageSize: 15,
              	items: { //styles of pages numbers
                        style: 'square', //square, pillow
                        width: '32px', //navigation item width
                        margin: '20px', //navigatin items margin
                        borderWidth: '2px', //items border width
                        backgroundColor: '#fff', //default background color
                        activeBackgroundColor: '#a8a6a1', //active item backround color
                        color: '#a8a6a1', // default items text color
                        activeColor: '#fff' //active items text color
                    },
            },
          	clearAllButton: { //Button that resets all filter and search control
                    enabled: true, // if true, you will see Clear button, clicking it resets all filters
                    text: 'Clear All', // button value
                    place: 'before' // may be before (all dropdowns) or after or valid css selector to append in
            },
          	simpleFilter: {
                anim: true,
                show: {
                    effect: 'fade',
                    transitionDuration: 60,
                    stagger: 24
                },
                hide: {
                    effect: 'fade',
                    transitionDuration: 40,
                    stagger: 18
                }
            },


            filter: {
                enabled: true,
                category: false,
                tag: false,
                items: [{
                    name: 'Instrument',
                    multiple: true,
                    getAttr: 'instruments'
                }]
            },


            sort: {
                enabled: false,
                items: []
            }
        }
    }]
};

</script>
<script src="https://assets.squarewebsites.org/custom-filter/custom-filter.min.js"></script>