Base.prototype._custom_url = function(action, params, options) {
  params = $H(params);
  if(options){
    var controller = opstions.isSingle ? this._singular : this._plural;
    return this._prefix + "/" + controller + "/" + action + (params && params.any() ? "?" + params.toQueryString() : "");
  }else{
    return this._prefix + "/" + this._plural + "/" + action + (params && params.any() ? "?" + params.toQueryString() : "");
  }
}

Base.prototype.find = function(id, params, callback) {
    var findAllWork = function(doc) {
      var collection = this._loadCollection(doc);

      // This is better than requiring the controller to support a "limit" parameter
      if (id == "first")
        return collection[0];

      return collection;
    }.bind(this);

    var findOneWork = function(doc) {
      var base = this._loadSingle(doc);

      // even if the ID didn't come back, we obviously knew the ID to search with, so set it
      if (!base._properties.include("id")) base._setAttribute("id", parseInt(id))

      return base;
    }.bind(this);

    if(this._format=="json" && this._prefix.split("://")[1] != document.domain){
      var url = this._custom_url(id, params);
      return Base.requestJSONP(findAllWork, url, {}, callback);
    }

    if (id == "first" || id == "all") {
      var url = this._plural_url(params);
      return Base.requestAndParse(this._format, findAllWork, url, {}, callback);
    }
    else {
      if (isNaN(parseInt(id))) return null;
      var url = this._singular_url(id, params);
      return Base.requestAndParse(this._format, findOneWork, url, {}, callback);
    }
}

Base.requestJSONP = function(callback, url, options, user_callback){
  if(!Base._temp_functions){
    Base._temp_functions={};
  }
  var random_name = Math.random().toString().split(".")[1];
  var temp_name = "Base_temp_callback_"+random_name;
  var temp_func = function(params){
    var items = [];
    if(params.length>0){
      for(var param in params){
        if(typeof(params[param])=="object"){
          items.push({attributes: params[param]});
        }
      }
    }else{
        items.push({attributes: params});
    }
    var base = callback(items);
    if(user_callback){
        user_callback.onSuccess(base);
    }

    //TODO:Delete temp function when failed JSONP request.
    var timer = new PeriodicalExecuter(function(){
      this.stop();
      eval("delete("+temp_name+");");
    }, 1);
  }
  eval(temp_name + "=temp_func;");
  var s = document.body.appendChild(document.createElement("script"));
  s.type = "text/javascript";
  s.charset = "utf-8";
  s.src = url.indexOf("?")>0 ? url+"&callback="+temp_name : url+"?callback="+temp_name;
}
