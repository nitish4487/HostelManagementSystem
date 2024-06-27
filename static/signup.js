function formvalidation(){

    var usn = document.getElementById('form1').value;
    var name = document.getElementById('form2').value;
    var email = document.getElementById('form3').value;
    var mobileno = document.getElementById('form4').value;
    var year = document.getElementById('form6').value;
    var password = document.getElementById('form7').value;
    var cpassword = document.getElementById('form8').value;
    

    if(usn== ""){
        document.getElementById('usn').innerHTML =" ** Please fill the usn field";
        return false;
    }
    if(name== ""){
        document.getElementById('name').innerHTML =" ** Please fill the name field";
        return false;
    }
    if(email == ""){
        document.getElementById('email').innerHTML =" ** Please fill the email idx` field";
        return false;
    }
    if(email.indexOf('@') <= 0 ){
        document.getElementById('email').innerHTML =" ** @ Invalid Position";
        return false;
    }
    if((email.charAt(email.length-4)!='.') && (email.charAt(email.length-3)!='.')){
        document.getElementById('email').innerHTML =" ** . Invalid Position";
        return false;
    }
    if(mobileno == ""){
        document.getElementById('mobileno').innerHTML =" ** Please fill the mobile NUmber field";
        return false;
    }
    if(isNaN(mobileno)){
        document.getElementById('mobileno').innerHTML =" ** user must write digits only not characters";
        return false;
    }
    if(mobileno.length!=10){
        document.getElementById('mobileno').innerHTML =" ** Mobile Number must be 10 digits only";
        return false;
    }
    
    if(year == ""){
        document.getElementById('year').innerHTML =" ** Please fill the year field";
        return false;
    }
    if(password== ""){
        document.getElementById('password').innerHTML =" ** Please fill the password field";
        return false;
    }
    if((password.length <= 5) || (password.length > 20)) {
        document.getElementById('password').innerHTML =" ** passwordwords lenght must be between  5 and 20";
        return false;	
    }
    if(cpassword == ""){
        document.getElementById('cpassword').innerHTML =" ** Please fill the cpasswordword field";
        return false;
    }
    if(password!=cpassword){
        document.getElementById('cpassword').innerHTML =" ** password does not match the confirm passwordword";
        return false;
    }}