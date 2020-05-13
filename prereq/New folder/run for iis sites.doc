C:\windows\system32\inetsrv\appcmd.exe add apppool /name:PersonalTrainer /PipelineMode:intergrated /ManagedRuntimeVersion:v4.0 /enable32BitAppOnWin64:true

C:\windows\system32\inetsrv\appcmd.exe add app /site.name:"default web site" /app.name:PersonalTrainer /applicationpool:PersonalTrainer /physicalpath:"%~dp0builds\development" /path:"/PersonalTrainer" /enabledprotocols:http,https

C:\windows\system32\inetsrv\appcmd.exe unlock config -section:annonymousAuthentication
C:\windows\system32\inetsrv\appcmd.exe unlock config -section:WindowsAuthentication

C:\windows\system32\inetsrv\appcmd.exe set config "default web site/PersonalTrainer" -section:annonymousAuthentication /enabled:false
C:\windows\system32\inetsrv\appcmd.exe set config "default web site/PersonalTrainer" -section:WindowsAuthentication /enabled:true