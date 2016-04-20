Template.afCheckboxGroupInline_tags.helpers({
  atts: function selectedAttsAdjust() {
    var atts = _.clone(this.atts);
    if (this.selected) {
      atts.checked = "";
    }
    // remove data-schema-key attribute because we put it
    // on the entire group
    delete atts["data-schema-key"];
    return atts;
  },
  dsk: function dsk() {
    return {
      "data-schema-key": this.atts["data-schema-key"]
    };
  },
  hasMore: function(){
    return Session.get('showGame')[this.atts.name] != undefined
  }
});

UI.registerHelper('tagsMore', function(context) {
  if(context) {
    var isMore = Session.get('showGame')[context];
    if(isMore > 0) {
      return TAPi18n.__('helper.more');
    } else {
      return TAPi18n.__('helper.less');
    }
  }
});