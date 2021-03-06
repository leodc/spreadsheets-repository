var characters = { 'á':'a', 'ă':'a', 'ắ':'a', 'ặ':'a', 'ằ':'a', 'ẳ':'a', 'ẵ':'a', 'ǎ':'a', 'â':'a', 'ấ':'a', 'ậ':'a', 'ầ':'a', 'ẩ':'a', 'ẫ':'a', 'ä':'a', 'ǟ':'a', 'ȧ':'a', 'ǡ':'a', 'ạ':'a', 'ȁ':'a', 'à':'a', 'ả':'a', 'ȃ':'a', 'ā':'a', 'ą':'a', 'ᶏ':'a', 'ẚ':'a', 'å':'a', 'ǻ':'a', 'ḁ':'a', 'ⱥ':'a', 'ã':'a', 'ꜳ':'aa', 'æ':'ae', 'ǽ':'ae', 'ǣ':'ae', 'ꜵ':'ao', 'ꜷ':'au', 'ꜹ':'av', 'ꜻ':'av', 'ꜽ':'ay', 'ḃ':'b', 'ḅ':'b', 'ɓ':'b', 'ḇ':'b', 'ᵬ':'b', 'ᶀ':'b', 'ƀ':'b', 'ƃ':'b', 'ɵ':'o', 'ć':'c', 'č':'c', 'ç':'c', 'ḉ':'c', 'ĉ':'c', 'ɕ':'c', 'ċ':'c', 'ƈ':'c', 'ȼ':'c', 'ď':'d', 'ḑ':'d', 'ḓ':'d', 'ȡ':'d', 'ḋ':'d', 'ḍ':'d', 'ɗ':'d', 'ᶑ':'d', 'ḏ':'d', 'ᵭ':'d', 'ᶁ':'d', 'đ':'d', 'ɖ':'d', 'ƌ':'d', 'ı':'i', 'ȷ':'j', 'ɟ':'j', 'ʄ':'j', 'ǳ':'dz', 'ǆ':'dz', 'é':'e', 'ĕ':'e', 'ě':'e', 'ȩ':'e', 'ḝ':'e', 'ê':'e', 'ế':'e', 'ệ':'e', 'ề':'e', 'ể':'e', 'ễ':'e', 'ḙ':'e', 'ë':'e', 'ė':'e', 'ẹ':'e', 'ȅ':'e', 'è':'e', 'ẻ':'e', 'ȇ':'e', 'ē':'e', 'ḗ':'e', 'ḕ':'e', 'ⱸ':'e', 'ę':'e', 'ᶒ':'e', 'ɇ':'e', 'ẽ':'e', 'ḛ':'e', 'ꝫ':'et', 'ḟ':'f', 'ƒ':'f', 'ᵮ':'f', 'ᶂ':'f', 'ǵ':'g', 'ğ':'g', 'ǧ':'g', 'ģ':'g', 'ĝ':'g', 'ġ':'g', 'ɠ':'g', 'ḡ':'g', 'ᶃ':'g', 'ǥ':'g', 'ḫ':'h', 'ȟ':'h', 'ḩ':'h', 'ĥ':'h', 'ⱨ':'h', 'ḧ':'h', 'ḣ':'h', 'ḥ':'h', 'ɦ':'h', 'ẖ':'h', 'ħ':'h', 'ƕ':'hv', 'í':'i', 'ĭ':'i', 'ǐ':'i', 'î':'i', 'ï':'i', 'ḯ':'i', 'ị':'i', 'ȉ':'i', 'ì':'i', 'ỉ':'i', 'ȋ':'i', 'ī':'i', 'į':'i', 'ᶖ':'i', 'ɨ':'i', 'ĩ':'i', 'ḭ':'i', 'ꝺ':'d', 'ꝼ':'f', 'ᵹ':'g', 'ꞃ':'r', 'ꞅ':'s', 'ꞇ':'t', 'ꝭ':'is', 'ǰ':'j', 'ĵ':'j', 'ʝ':'j', 'ɉ':'j', 'ḱ':'k', 'ǩ':'k', 'ķ':'k', 'ⱪ':'k', 'ꝃ':'k', 'ḳ':'k', 'ƙ':'k', 'ḵ':'k', 'ᶄ':'k', 'ꝁ':'k', 'ꝅ':'k', 'ĺ':'l', 'ƚ':'l', 'ɬ':'l', 'ľ':'l', 'ļ':'l', 'ḽ':'l', 'ȴ':'l', 'ḷ':'l', 'ḹ':'l', 'ⱡ':'l', 'ꝉ':'l', 'ḻ':'l', 'ŀ':'l', 'ɫ':'l', 'ᶅ':'l', 'ɭ':'l', 'ł':'l', 'ǉ':'lj', 'ſ':'s', 'ẜ':'s', 'ẛ':'s', 'ẝ':'s', 'ḿ':'m', 'ṁ':'m', 'ṃ':'m', 'ɱ':'m', 'ᵯ':'m', 'ᶆ':'m', 'ń':'n', 'ň':'n', 'ņ':'n', 'ṋ':'n', 'ȵ':'n', 'ṅ':'n', 'ṇ':'n', 'ǹ':'n', 'ɲ':'n', 'ṉ':'n', 'ƞ':'n', 'ᵰ':'n', 'ᶇ':'n', 'ɳ':'n', 'ñ':'n', 'ǌ':'nj', 'ó':'o', 'ŏ':'o', 'ǒ':'o', 'ô':'o', 'ố':'o', 'ộ':'o', 'ồ':'o', 'ổ':'o', 'ỗ':'o', 'ö':'o', 'ȫ':'o', 'ȯ':'o', 'ȱ':'o', 'ọ':'o', 'ő':'o', 'ȍ':'o', 'ò':'o', 'ỏ':'o', 'ơ':'o', 'ớ':'o', 'ợ':'o', 'ờ':'o', 'ở':'o', 'ỡ':'o', 'ȏ':'o', 'ꝋ':'o', 'ꝍ':'o', 'ⱺ':'o', 'ō':'o', 'ṓ':'o', 'ṑ':'o', 'ǫ':'o', 'ǭ':'o', 'ø':'o', 'ǿ':'o', 'õ':'o', 'ṍ':'o', 'ṏ':'o', 'ȭ':'o', 'ƣ':'oi', 'ꝏ':'oo', 'ɛ':'e', 'ᶓ':'e', 'ɔ':'o', 'ᶗ':'o', 'ȣ':'ou', 'ṕ':'p', 'ṗ':'p', 'ꝓ':'p', 'ƥ':'p', 'ᵱ':'p', 'ᶈ':'p', 'ꝕ':'p', 'ᵽ':'p', 'ꝑ':'p', 'ꝙ':'q', 'ʠ':'q', 'ɋ':'q', 'ꝗ':'q', 'ŕ':'r', 'ř':'r', 'ŗ':'r', 'ṙ':'r', 'ṛ':'r', 'ṝ':'r', 'ȑ':'r', 'ɾ':'r', 'ᵳ':'r', 'ȓ':'r', 'ṟ':'r', 'ɼ':'r', 'ᵲ':'r', 'ᶉ':'r', 'ɍ':'r', 'ɽ':'r', 'ↄ':'c', 'ꜿ':'c', 'ɘ':'e', 'ɿ':'r', 'ś':'s', 'ṥ':'s', 'š':'s', 'ṧ':'s', 'ş':'s', 'ŝ':'s', 'ș':'s', 'ṡ':'s', 'ṣ':'s', 'ṩ':'s', 'ʂ':'s', 'ᵴ':'s', 'ᶊ':'s', 'ȿ':'s', 'ɡ':'g', 'ᴑ':'o', 'ᴓ':'o', 'ᴝ':'u', 'ť':'t', 'ţ':'t', 'ṱ':'t', 'ț':'t', 'ȶ':'t', 'ẗ':'t', 'ⱦ':'t', 'ṫ':'t', 'ṭ':'t', 'ƭ':'t', 'ṯ':'t', 'ᵵ':'t', 'ƫ':'t', 'ʈ':'t', 'ŧ':'t', 'ᵺ':'th', 'ɐ':'a', 'ᴂ':'ae', 'ǝ':'e', 'ᵷ':'g', 'ɥ':'h', 'ʮ':'h', 'ʯ':'h', 'ᴉ':'i', 'ʞ':'k', 'ꞁ':'l', 'ɯ':'m', 'ɰ':'m', 'ᴔ':'oe', 'ɹ':'r', 'ɻ':'r', 'ɺ':'r', 'ⱹ':'r', 'ʇ':'t', 'ʌ':'v', 'ʍ':'w', 'ʎ':'y', 'ꜩ':'tz', 'ú':'u', 'ŭ':'u', 'ǔ':'u', 'û':'u', 'ṷ':'u', 'ü':'u', 'ǘ':'u', 'ǚ':'u', 'ǜ':'u', 'ǖ':'u', 'ṳ':'u', 'ụ':'u', 'ű':'u', 'ȕ':'u', 'ù':'u', 'ủ':'u', 'ư':'u', 'ứ':'u', 'ự':'u', 'ừ':'u', 'ử':'u', 'ữ':'u', 'ȗ':'u', 'ū':'u', 'ṻ':'u', 'ų':'u', 'ᶙ':'u', 'ů':'u', 'ũ':'u', 'ṹ':'u', 'ṵ':'u', 'ᵫ':'ue', 'ꝸ':'um', 'ⱴ':'v', 'ꝟ':'v', 'ṿ':'v', 'ʋ':'v', 'ᶌ':'v', 'ⱱ':'v', 'ṽ':'v', 'ꝡ':'vy', 'ẃ':'w', 'ŵ':'w', 'ẅ':'w', 'ẇ':'w', 'ẉ':'w', 'ẁ':'w', 'ⱳ':'w', 'ẘ':'w', 'ẍ':'x', 'ẋ':'x', 'ᶍ':'x', 'ý':'y', 'ŷ':'y', 'ÿ':'y', 'ẏ':'y', 'ỵ':'y', 'ỳ':'y', 'ƴ':'y', 'ỷ':'y', 'ỿ':'y', 'ȳ':'y', 'ẙ':'y', 'ɏ':'y', 'ỹ':'y', 'ź':'z', 'ž':'z', 'ẑ':'z', 'ʑ':'z', 'ⱬ':'z', 'ż':'z', 'ẓ':'z', 'ȥ':'z', 'ẕ':'z', 'ᵶ':'z', 'ᶎ':'z', 'ʐ':'z', 'ƶ':'z', 'ɀ':'z', 'ﬀ':'ff', 'ﬃ':'ffi', 'ﬄ':'ffl', 'ﬁ':'fi', 'ﬂ':'fl', 'ĳ':'ij', 'œ':'oe', 'ﬆ':'st', 'ₐ':'a', 'ₑ':'e', 'ᵢ':'i', 'ⱼ':'j', 'ₒ':'o', 'ᵣ':'r', 'ᵤ':'u', 'ᵥ':'v', 'ₓ':'x', 'Ё':'YO', 'Й':'I', 'Ц':'TS', 'У':'U', 'К':'K', 'Е':'E', 'Н':'N', 'Г':'G', 'Ш':'SH', 'Щ':'SCH', 'З':'Z', 'Х':'H', 'Ъ':"'", 'ё':'yo', 'й':'i', 'ц':'ts', 'у':'u', 'к':'k', 'е':'e', 'н':'n', 'г':'g', 'ш':'sh', 'щ':'sch', 'з':'z', 'х':'h', 'ъ':"'", 'Ф':'F', 'Ы':'I', 'В':'V', 'А':'a', 'П':'P', 'Р':'R', 'О':'O', 'Л':'L', 'Д':'D', 'Ж':'ZH', 'Э':'E', 'ф':'f', 'ы':'i', 'в':'v', 'а':'a', 'п':'p', 'р':'r', 'о':'o', 'л':'l', 'д':'d', 'ж':'zh', 'э':'e', 'Я':'Ya', 'Ч':'CH', 'С':'S', 'М':'M', 'И':'I', 'Т':'T', 'Ь':"'", 'Б':'B', 'Ю':'YU', 'я':'ya', 'ч':'ch', 'с':'s', 'м':'m', 'и':'i', 'т':'t', 'ь':"'", 'б':'b', 'ю':'yu'   };

function replaceAccents(str){
  return str.replace(/[^a-z]/g, function(x) {
    return characters[x] || x;
  });
}

(function(exports){

  exports.fullnameColumn = "clean_name";
  exports.matchColumn = "matched_name";
  exports.emptyColumnName = "no_name";
  exports.codeColumn = "codigo";
  exports.codeColumnOptions = ["codigo", "code"];

  exports.linkSuffix = "_link";
  exports.referenceSuffix = "_reference";

  exports.cleanName = function(fullname){
    if(typeof fullname === "string"){
      return replaceAccents( String(fullname).toLocaleLowerCase().trim() ).replace(/[^ \w]|[0-9]/g, "").replace(/  +/g, " ");
    }

    return "";
  }

  exports.cleanHeader = function (header){
    if(typeof header === "number"){
      return String(header);
    }else if(typeof header === "string"){
      return replaceAccents( String(header).toLocaleLowerCase().trim() ).replace(/ /g,"_").replace(/[^\w]/g, "")
    }

    return "";
  }

  exports.cleanValue = function (value){
    if(typeof value === "number"){
      return value;
    }else if(typeof value === "string"){
      return value.trim()
    }

    return "";
  }

  exports.buildFullName = function(persons, config){
    for (var person of persons) {
      // build full name
      var fullname = "";
      for (var i = 0; i < config.nameColumnsValue.length; i++) {
        fullname += person[ config.nameColumnsValue[i] ] + " ";
      }
      person[ exports.fullnameColumn ] = exports.cleanName(fullname);
    }

    return persons;
  }

})(typeof exports === "undefined"? this["utils"]={}: exports);
