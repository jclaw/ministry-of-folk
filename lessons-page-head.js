<link rel="stylesheet" href="https://assets.squarewebsites.org/custom-tables/style.css">


<script src="https://assets.squarewebsites.org/custom-tables/custom-table.js"></script>

<link rel="stylesheet" href="https://assets.squarewebsites.org/custom-filter/custom-filter.min.css"/>

<script>
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
  
function lessonsPage() {
  $('table.lessons-table td[data-th="Description"]').click(function (e) {
    var el = this;
    var span = $(el).find('span');
    var offsetHeight = span[0].offsetHeight + (el.offsetHeight - span[0].offsetHeight) / 2;
    if (e.offsetY > offsetHeight) {
      $(el).toggleClass('expanded');
    }
  });
  
  // replace links that didn't get correctly interpolated into images  
  $('table.lessons-table td[data-th="Photo"] a').each(function () {
    var $el = $(this);
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
  $('table.lessons-table .table-row').each(function () {
    var $card = $(this);
    var contactPreference = $card.find('td[data-th="Contact Preference"]').text().trim();
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
    var donateLink = $card.find('td[data-th="Paypal Link"] a').attr('href');
    var mailingListLink = $card.find('td[data-th="Mailing List Link"] a').attr('href');


    var $newContact = contactLink ? $('<a class="contact-link">Contact</a>').attr({
      href: contactLink + '?subject=Message via Ministry of Folk',
      target: '_blank'
    }) : '';

    var $newDonate = donateLink ? $('<a class="donate-link">Donate</a>').attr({
      href: donateLink,
      target: '_blank'
    }) : '';
    var $newMailingList = mailingListLink ? $('<a class="mailing-list-link">Join mailing list</a>').attr({
      href: mailingListLink,
      target: '_blank'
    }) : '';

    var $newEl = $('<div class="action-links">');

    $newEl.append($newContact)
      .append($newDonate)
      .append($newMailingList);
    $card.append($newEl);

  });
}
</script>