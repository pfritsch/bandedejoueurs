String.prototype.truncate = String.prototype.truncate ||
  function( n, useWordBoundary ){
     var isTooLong = this.length > n,
         s_ = isTooLong ? this.substr(0,n-1) : this;
     s_ = (useWordBoundary && isTooLong) ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
     return  isTooLong ? s_ + '…' : s_;
  };
