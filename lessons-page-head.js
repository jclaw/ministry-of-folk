<link rel="stylesheet" href="https://assets.squarewebsites.org/custom-tables/style.css">


<script src="https://assets.squarewebsites.org/custom-tables/custom-table.js"></script>

<link rel="stylesheet" href="https://assets.squarewebsites.org/custom-filter/custom-filter.min.css"/>

<script>
var TBODY_LOAD_CLASSES = ['hiding', 'pre-showing', 'showing'];
  
$(window).on('DOMContentLoaded', function () {
  lessonsPagePoller();
});
  
function lessonsPagePoller (_) {
  if (!$('table.lessons-table .element-showed').length) {
    window.requestAnimationFrame(lessonsPagePoller);
  } else {
    lessonsPage();
  }
}

  
// repeatable actions that happen on every filter change and page load
function lessonsPage() {  
  // expando description
  $('table.lessons-table td[data-th="Description"]').each(function () {
    var $description = $(this);
    if ($description.hasClass('mof-loaded')) { return; }
    $description.addClass('mof-loaded');
    
    $description.click(function (e) {
      var el = this;
      var span = $(el).find('span');
      var offsetHeight = span[0].offsetHeight + (el.offsetHeight - span[0].offsetHeight) / 2;
      if (e.offsetY > offsetHeight) {
        $(el).toggleClass('expanded');
      }
    });
  });

  
  // replace links that didn't get correctly interpolated into images  
  $('table.lessons-table td[data-th="Photo"] a').each(function () {
    var $el = $(this);
    if ($el.hasClass('mof-loaded')) { return; }
    $el.addClass('mof-loaded');
    
    var href = $el.attr('href');
    var $newEl = $('<img>');
    $newEl.attr({
      src: href,
      class: 'loaded',
      style: 'opacity: 1'
    });

    $el.replaceWith($newEl);
  });
  
  // create action links
  window.cardData = {};
  $('table.lessons-table .table-row').each(function () {
    var $card = $(this);
    if ($card.hasClass('mof-loaded')) { return; }
    $card.addClass('mof-loaded');
    
    var index = $card.attr('data-index');
    
    function getField(fieldName) { return window.getField($card, fieldName); }
    function getLink(fieldName) {return window.getLink($card, fieldName); }
    
    var d = {
      name: getField('Musician Name').text().trim(),
      email: getLink('Email'),
      instagram: getLink('Instagram Page'),
      facebook: getLink('Facebook Page'),
      patreon: getLink('Patreon Page'),
      website: getLink('Website'),
      donate: getLink('Paypal Link'),
      mailingList: getLink('Mailing List Link'),
    };
    cardData[index] = d;
    
    var email = getLink('Email');
    var instagram = getLink('Instagram Page');
    var facebook = getLink('Facebook Page');
    var patreon = getLink('Patreon Page');
    var website = getLink('Website');
    var donate = getLink('Paypal Link');
    var mailingList = getLink('Mailing List Link');
        
    var contactPreference = getField('Contact Preference').text().trim();
    var fieldName = '';

    if (contactPreference.indexOf('Email') === 0) {
      fieldName = 'Email';
    } else if (contactPreference.indexOf('Instagram') === 0) {
      fieldName = 'Instagram Page';
    } else if (contactPreference.indexOf('Facebook') === 0) {
      fieldName = 'Facebook Page';
    } else if (contactPreference.indexOf('Website') !== -1) {
      fieldName = 'Website';
    }

    var contactLink = fieldName ? $card.find('td[data-th="' + fieldName + '"] a').attr('href') : null;


    var $newContact = contactLink ? $('<a class="contact-link">Contact</a>').attr({
      href: contactLink + '?subject=Message via Ministry of Folk',
      target: '_blank'
    }) : '';

    var $newDonate = donate ? $('<a class="donate-link">Donate</a>').attr({
      href: donate,
      target: '_blank'
    }) : '';
    var $newMailingList = mailingList ? $('<a class="mailing-list-link">Join mailing list</a>').attr({
      href: mailingList,
      target: '_blank'
    }) : '';

    var $newEl = $('<div class="action-links">');

    $newEl.append($newContact)
      .append($newDonate)
      .append($newMailingList);
    $card.append($newEl);

  });
  
  if (!observer) {
    console.log('initing observer');
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(function(mutations, observer) {
      var exit = false;
      for (var i = 0; i < mutations.length; i++) {
        var mutation = mutations[i];
        var $tbody = $(mutation.target);
        var classList = $tbody.prop('classList');
        for (var j = 0; j < classList.length; j++) {
          var c = classList[j];
          if (TBODY_LOAD_CLASSES.indexOf(c) !== -1) {
            exit = true;
            break;
          }
        }
        if (!exit) {
          lessonsPage();
          break;
        }
      }
    });

    observer.observe($('table.lessons-table tbody')[0], { attributes: true });
  }
}
window.getField = function ($card, fieldName) {
  return $card.find('td[data-th="' + fieldName + '"]');
}
window.getLink = function ($card, fieldName) {
  return fieldName ? getField($card, fieldName).find('a').attr('href') : null;
}

</script>