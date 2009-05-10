Base.prototype.find_all = function(page) {
  var models = [];
  var url = typeof page=="number" ? this.plural_url()+"?page="+page : this.plural_url();
  var docs = this._tree.parseHTTP(url, {});
  if(docs[this._plural]){
    docs = docs[this._plural][this._singular];
    for(var i=0; i<docs.size(); i++){
      models.push( this.build(this.attributesFromTree(docs[i])) );
    }
  }else{
      models=false;
  }
  return models;
};
