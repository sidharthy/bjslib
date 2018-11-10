/*
 * KeyValueMap class under collections package of Bracket Javascript Library.
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
NS_BKTJSLIB1dot0_Collections.KeyValueMap = NS_BKTJSLIB1dot0_Collections.KeyValueMap || (function() {

     function KeyValueMap()
     {
          this._map = {};
          this.defaultKey = null;

          this.setDefault = function(key, value)
          {
               this.defaultKey = key;
               this.put(key, value);
          };

          this.getDefault = function()
          {
               if (this.defaultKey)
                    return this.get(this.defaultKey);
               return null;
          };

          this.getDefaultKey = function()
          {
               return this.defaultKey;
          };

          this.put = function(key, value)
          {
               this._map[key] = value;
          };

          this.get = function(key, returnDefaultIfNull)
          {
               var value = this._map[key];
               if ((value == null || typeof(value) == 'undefined') && returnDefaultIfNull === true)
                    value = this.getDefault();
               return value;
          };

          this.remove = function(key)
          {
               if (this._map[key])
               {
                    this._map[key] = null;
                    delete this._map[key];
               }
          }

          this.clear = function()
          {
               this._map = {};
          };

          this.clone = function()
          {
               var _clone = new KeyValueMap();
               if (this.defaultKey)
                    _clone.setDefault(this.defaultKey, this.getDefault());
               for (name in this._map)
               {
                    _clone.put(name, this._map[name]);
               }
               return _clone;
          };
     };

     return {
          //export any public methods and variables
          instance : KeyValueMap     //constructor
     };

}());