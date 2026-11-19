(function(){
  var form=document.getElementById("contact-form");
  if(form){
    var adviser=concept.param("adviser");var sel=document.getElementById("adviser");
    if(adviser&&sel){Array.prototype.forEach.call(sel.options,function(o){if(o.text===adviser)sel.value=adviser;});}
    form.addEventListener("submit",function(e){e.preventDefault();if(!concept.validate(form))return;
      document.getElementById("done-name").textContent=form.name.value.split(" ")[0];
      form.hidden=true;var done=document.getElementById("contact-done");done.hidden=false;done.focus();});
  }
  var open=document.getElementById("open-now");
  if(open){var now=new Date(new Date().toLocaleString("en-US",{timeZone:"Australia/Melbourne"}));var d=now.getDay(),h=now.getHours()+now.getMinutes()/60;
    var isOpen=(d>=1&&d<=4&&h>=8.5&&h<17.5)||(d===5&&h>=8.5&&h<16);
    open.textContent=isOpen?"● Open now":"● Closed now. Leave a message and we'll call you back.";open.className="open-now "+(isOpen?"is-open":"is-closed");}
})();
