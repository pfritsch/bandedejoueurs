sitemaps.add('/sitemap.xml', function() {
  var out = [
    { page: '/', changefreq: 'monthly', priority: 0.8 },
    { page: '/players'},
    { page: '/gamesessions', changefreq: 'weekly' }
    // https://support.google.com/webmasters/answer/2620865?hl=en
    // { page: '/', xhtmlLinks: [
    //   { rel: 'alternate', hreflang: 'de', href: '/de' },
    //   { rel: 'alternate', hreflang: 'en', href: '/en' }
    // ]}
  ],
  gamesessions = Gamesessions.find({meetingDate: {
    $gte: moment().unix()
  }}).fetch();

  _.each(gamesessions, function(page) {
    out.push({
      page: '/gamesessions/' + page._id,
      lastmod: page.lastUpdate || new Date()
    });
  });
  return out;
});
