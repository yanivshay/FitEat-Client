angular.module('personalTrainer').controller('registerController', function($scope, $http,$location, consts, passwordValidation, toaster, userService) {
    const ctrl = this;

    ctrl.model = {FirstName:"", LastName:"", Birthday:null, Height:null, Gender:null, Email:"", Password:"", confirmPassword:"",
        Measurement :{Weight:null, BodyFat:null}, Goal:{GoalWeight:null, BodyFat:null, StartingWeight:null}};

    ctrl.section = 1;
    var RegexPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
    var RegexName = new RegExp("^[a-zA-Z]+$");

    ctrl.moveSection = function(sectionName){
        if(sectionName == 1)
        {
            if (ctrl.checkValid(1))
            {
                $http.get(`${consts.isUserExistsApi}?email=${ctrl.model.Email}`, this).then(function({data}) {
                    if(!data)
                        ctrl.section +=1;
                    else
                        toaster.pop('warning', "", "This email already exists in the system");
                });
            }
            else
                userForm.$setSubmitted;
        }
        else if(sectionName == 2)
        {
            if (ctrl.checkValid(2))
            { 
                ctrl.section +=1;
            }
            else
                userForm.$setSubmitted;
        }
        
    }

    ctrl.checkValid =function(sectionName)
    {
        if(sectionName == 1)
        {
            if (userForm.firstName.checkValidity() &&  userForm.lastName.checkValidity() &&
                userForm.email.checkValidity() )
            {
                passwordValidation.checkValid(userForm.password.value ,function() {
                    if (ctrl.model.Password!= ctrl.model.confirmPassword)
                    {
                        toaster.pop('warning', "", "The confirm password dont match to password");
                    }
                });
               
                return userForm.password.checkValidity()  && userForm.confirmPassword.checkValidity() &&
                    ctrl.model.Password == ctrl.model.confirmPassword &&
                    RegexPassword.test(ctrl.model.Password) && RegexPassword.test(ctrl.model.confirmPassword) &&
                    RegexName.test(userForm.firstName.value) && RegexName.test(userForm.lastName.value);
            }
            else{
                if (!RegexName.test(userForm.firstName.value))
                    toaster.pop('warning', "", "First name can contain only letters");
                else if (!RegexName.test(userForm.lastName.value))
                    toaster.pop('warning', "", "Last name can contain only letters");
                return false;
            }
              
        }
        else if(sectionName == 2)
        {
            if (userForm.birthday.checkValidity() && ctrl.model.Gender == null)
                toaster.pop('warning', "", "You must select gender");
            return userForm.height.checkValidity() && ctrl.model.Gender != null &&
            userForm.meWeight.checkValidity() && userForm.meBodyFat.checkValidity()  && userForm.birthday.checkValidity();
        }
        else if(sectionName == 3)
        {
            return userForm.goalWeight.checkValidity() && userForm.goalBodyFat.checkValidity() ;
        }
    }

    ctrl.register = function(){
        if (ctrl.checkValid(3))
        {
            ctrl.model.Goal.StartingWeight = ctrl.model.Measurement.Weight;
            $http.post(`${consts.registerApi}`, ctrl.model).then(function({data}) {
                userService.getUser(data, function(usr){
                    $location.path("/menu");
                });
            });
        }
        else
        {
            userForm.$setSubmitted;
        }
    }

    return ctrl;
});