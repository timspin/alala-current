(function() {
  'use strict';

  let embedSoundCloud = {
    replaceLink: function(url) {
      /**
       * Build the HTML for embedded SoundCloud and insert into DOM.
       * @param  {string} url URL derived from getURL() helper function or as literal parameter.
       */

      const extLinkContainer = document.createElement('div');
        extLinkContainer.id = 'soundcloud-embedded-window';
        // create containing div to hold iframe
      const extLinkIframe = document.createElement('iframe');
        extLinkIframe.src = url;
        extLinkIframe.setAttribute('scrolling', 'no');
        extLinkIframe.setAttribute('frameborder', 'no');
        extLinkIframe.setAttribute('height', '166');
        extLinkIframe.setAttribute('width', '100%');
        // create iframe and populate with embeddable URL
      extLinkContainer.append(extLinkIframe);

      const previewContainer = document.querySelector('div.ItemPreview-container>div.preview');
        previewContainer.childNodes[0].style.display = 'none';
        //hide existing contents
        previewContainer.appendChild(extLinkContainer);
        previewContainer.style.display = 'block';

  },
    removeEmbed: function() {
      //remove inserted SoundCloud iframe if it exists in the DOM
      const embeddedSoundCloud = document.getElementById('soundcloud-embedded-window');
      if (embeddedSoundCloud) {
        embeddedSoundCloud && embeddedSoundCloud.parentNode.removeChild(embeddedSoundCloud);
        document.querySelector('div.ItemPreview-container>div.preview').childNodes[0].style.display = 'flex';
        //make sure previously hidden content divs are unhidden
      }
    },
    getUrl: function(nick,url) {
      /**
       * Helper function to build the embeddable URL.
       * @param  {string} nick Metadata field that contains the track id, specify field nickname.
       * @param  {string} url URL extracted from item on page load.
       * @return {string}      The complete embeddable URL as text or null if no URL is found.
       */

      let embedUrl;
      const selectors = 'tr.field-' + nick + '>td.field-value>span';
      if ( document.querySelector(selectors) ) {
        const trackId = document.querySelector(selectors).textContent;
        //console.log('metadata field contents:',trackId);
        const frag1 = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/';
        const frag2 = '&color=%239c9c9c&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true';
        embedUrl = frag1 + trackId + frag2;
      }
      return embedUrl;
    }
  };

  let globalScope = true;
  let collectionScope = [
    'example_alias'
  ];

  console.log('aasdf');
  ['cdm-item-page:ready','cdm-item-page:update'].forEach(function(e) {
    document.addEventListener(e, function(e){
      console.log('aasdf1');

      const collection = e.detail.collectionId;
      if (globalScope || collectionScope.includes(collection)) {
        const currentUrlLink = document.querySelector('div.ItemUrl-itemUrlLink>a');
        embedSoundCloud.removeEmbed();
        if ( currentUrlLink && currentUrlLink.href.includes('soundcloud') ) {
          const url = embedSoundCloud.getUrl('identi',currentUrlLink);
          console.log({url});
          if (url) {
            embedSoundCloud.replaceLink(url);
          }
        }
      }
    });
  });

  document.addEventListener('cdm-item-page:leave', function(e) {
    const collection = e.detail.collectionId;
    if (globalScope || collectionScope.includes(collection)) {
      embedSoundCloud.removeEmbed();
    }
  });
})();

/* version history

1.1 - 2021 Jan 24 - fix failing logic when removing embed
1.0 - 2021 Jan 15 - initial implementation

*/
