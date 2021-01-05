function recordSessionId(id){
  var oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  console.log("LOADIND NEW USER SESSION ID FROM SERVER: "+id)
  document.cookie = "user_id" + "=" + id + ";" + oneYearFromNow + ";path=/;SameSite=Lax;";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
