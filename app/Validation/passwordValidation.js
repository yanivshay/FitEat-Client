angular.module('personalTrainer').
service('passwordValidation', function($http, consts, toaster) {
    const srv = this;

    var RegexNumber = new RegExp("^(?=.*[0-9])");
    var RegexLC = new RegExp("^(?=.*[A-Z])");
    var RegexSC = new RegExp("^(?=.*[a-z])");
    var RegexAmount = new RegExp("^(?=.{8,})");


    srv.checkValid = function(password ,onDoneFunc) {
      if (!RegexNumber.test(password))
        toaster.pop('warning', "", "Password must contain numbers");
      else if (!RegexSC.test(password))
        toaster.pop('warning', "", "Password must contain a small letter");
      else if (!RegexLC.test(password))
        toaster.pop('warning', "", "Password must contain a capital letter");
      else if (!RegexAmount.test(password))
        toaster.pop('warning', "", "Password must contain at least 8 letters");
      else
        onDoneFunc();
    }

    return srv;
});