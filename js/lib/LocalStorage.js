/*
 * LocalStorage class under io package of Bracket Javascript Library.
 * This class makes use of browser's localStorage object (where available) and cookies to store key-value pairs.
 *
 * This class provides implicit support to declare methods/fields as public or private.The public methods/fields are to be exported 
 * through the return statement at the end of the file.
 * 
 * @author Sidharth Yadav
 * Email: sidharth_08@yahoo.com, sidharth@bracket.co.in
 * Copyright protected file. All rights reserved.
 *
 * You may use this script in your application/web pages provided you don't modify any part of this file, including the comments. If you wish to use a modified version 
 * of this script then you must first get the approval from the author. Also you use this script purely at your own risk and the author doesn't take any 
 * responsibility whatsoever if you face any issue(s) as a result of using this script.
 */
NS_BKTJSLIB1dot0_IO.LocalStorage = NS_BKTJSLIB1dot0_IO.LocalStorage || (function() {

     function StoreValue(key, value) {
          if (localStorage) {
              localStorage.setItem(key, value);
          } else {
              document.cookie = key + "=" + value + ";";
          }
     };

     function GetValue(key)
     {
          if (localStorage)
               return localStorage.getItem(key);

          var name = key + "=";
          var ca = document.cookie.split(';');
          for(var i=0; i<ca.length; i++) 
          {
               var c = ca[i].replace(/^\s+|\s+$/gm,'');     //trim equivalent
               if (c.indexOf(name) == 0) 
                    return c.substring(name.length,c.length);
          }
          return null;
     };

     function RemoveValue(key)
     {
          if (localStorage)
               localStorage.removeItem(key);
          else if (GetValue(key) != null)
          {
               //there is a cookie set with the key as its name. Let's set expiry to a historical date.
               document.cookie = key + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          }
     };

     return {
          //export any public methods and variables
          StoreValue : StoreValue,
          GetValue : GetValue,
          RemoveValue : RemoveValue
     };

}());