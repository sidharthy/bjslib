/*
 * AnimationEffects class under util package of Bracket Javascript Library. It can be used to animate html elements and images.
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
NS_BKTJSLIB1dot0_Util.AnimationEffects = NS_BKTJSLIB1dot0_Util.AnimationEffects || (function() {

     //shorthand names of the external classes used inside this class.
     var KeyValueMap = NS_BKTJSLIB1dot0_Collections.KeyValueMap.instance;
     var Animator = NS_BKTJSLIB1dot0_Util.Animator.instance;
     var State = NS_BKTJSLIB1dot0_Util.Animator.State;
     var SourceWrapper = NS_BKTJSLIB1dot0_Util.Animator.SourceWrapper;
     var GetBorderWidth = NS_BKTJSLIB1dot0_Util.DomUtilities.GetBorderWidth;

     function AnimatorWrapper(elementObj, animator, deltaKVMap, speedKVMap, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing)
     {
          this.elementObj = elementObj;
          this.animator = animator;
          this.deltaKVMap = deltaKVMap;
          this.speedKVMap = speedKVMap;
          this.onCompleteCallback = onCompleteCallback;
          this.onStopCallback = onStopCallback;
          this.onApplyStateToSourceCallback_PostProcessing = onApplyStateToSourceCallback_PostProcessing;
          this.start = function()
          {
               this.animator.start(this.deltaKVMap, this.speedKVMap);
          };
          this.stop = function()
          {
               this.animator.stop();
          };
          var onComplete = function(animator)
          {
               _onComplete.call(this, this);
          };
          var onStop = function(animator, stateAtStop)
          {
               _onStop.call(this, this, stateAtStop);
          };
          var applyStateToSource = function(typeOfAnimationBeingPlayed, source, state, attribute, isAttributeTransitionComplete)
          {
               _applyStateToSource(typeOfAnimationBeingPlayed, source, state, attribute, isAttributeTransitionComplete, this);
          };
          this.animator.setOnCompleteCallback(onComplete, this);
          this.animator.setOnStopCallback(onStop, this);
          this.animator.setApplyStateToSourceCallback(applyStateToSource, this);
     }

     var getUnitValue = function(unit, forAttrib)
     {
          if (!isNaN(unit))
               return unit;
          if (unit instanceof KeyValueMap)
          {
               return unit.get(forAttrib, true);
          }
          if (unit[forAttrib])
               return unit[forAttrib];
          return unit;     //the caller doesn't seem to have passed a valid numeric value and we will return it as is. If the script runs into errors then so be it.
     };

     var getAnimatableElement = function(elemObj)
     {
          if (elemObj instanceof SourceWrapper)
               return elemObj.getAnimatableElement();
          return elemObj;
     };

     function FadeTransition(elementObj, fromOpacity, toOpacity, deltaUnit, transitionDelay, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing)
     {
          var element = getAnimatableElement(elementObj);
          element.style.opacity=fromOpacity;

          var start = new State();
          start.setAttribute('opacity', fromOpacity);

          var end = start.clone();
          end.setAttribute('opacity', toOpacity);

          var a = new Animator(elementObj, start, end);
          a.setTypeOfAnimation('Fade');
          var deltaKVMap = new KeyValueMap();
          deltaKVMap.put('opacity', getUnitValue(deltaUnit, 'opacity'));
          var speedKVMap = new KeyValueMap();
          speedKVMap.setDefault('default', getUnitValue(transitionDelay, 'opacity'));

          return new AnimatorWrapper(elementObj, a, deltaKVMap, speedKVMap, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing);
     };

     function SlideTo(direction, elementObj, deltaUnit, transitionDelay, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing)
     {
          var element = getAnimatableElement(elementObj);

          var attribute = direction == 'left'? 'left': 
                          direction == 'right'? 'left': 
                          direction == 'top'? 'top': 
                          direction == 'bottom'? 'top': 'left';

          var startValue = 0;
          if (attribute == 'left')
               startValue = element.offsetLeft;
          else if (attribute == 'top')
               startValue = element.offsetTop;

          var endValue = direction == 'left'? startValue - _getWidth(element): 
                           direction == 'right'? startValue + _getWidth(element): 
                           direction == 'top'? startValue - _getHeight(element): 
                           direction == 'bottom'? startValue + _getHeight(element): 0;

          var start = new State();
          start.setAttribute(attribute, startValue);

          var end = start.clone();
          end.setAttribute(attribute, endValue);

          var a = new Animator(elementObj, start, end);
          a.setTypeOfAnimation('Slide');
          var deltaKVMap = new KeyValueMap();
          deltaKVMap.put(attribute, getUnitValue(deltaUnit, attribute));
          var speedKVMap = new KeyValueMap();
          speedKVMap.setDefault('default', getUnitValue(transitionDelay, attribute));

          return new AnimatorWrapper(elementObj, a, deltaKVMap, speedKVMap, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing);
     };

     function CollapseToMiddleVerticalLine(elementObj, deltaUnit, transitionDelay, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing)
     {
          var element = getAnimatableElement(elementObj);

          var start = new State();
          start.setAttribute('left', 0);
          start.setAttribute('width', _getWidth(element));

          var end = start.clone();
          end.setAttribute('left', _getWidth(element)/2);
          //end.setAttribute('width', 0);

          var a = new Animator(elementObj, start, end);
          //a.setAnimateAttributesAsGroup(true);
          a.setTypeOfAnimation('CollapseToMiddleVerticalLine');
          var deltaKVMap = new KeyValueMap();
          deltaKVMap.put('left', getUnitValue(deltaUnit, 'left'));
          //deltaKVMap.put('width', deltaKVMap.get('left') * 2);
          var speedKVMap = new KeyValueMap();
          /* speedKVMap.setDefault('left', 0);
          speedKVMap.setDefault('width', getUnitValue(transitionDelay, 'width')); */
          speedKVMap.setDefault('default', getUnitValue(transitionDelay, 'left'));

          return new AnimatorWrapper(elementObj, a, deltaKVMap, speedKVMap, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing);
     };

     function CollapseToMiddleHorizontalLine(elementObj, deltaUnit, transitionDelay, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing)
     {
          var element = getAnimatableElement(elementObj);

          var start = new State();
          start.setAttribute('top', 0);
          start.setAttribute('height', _getHeight(element));

          var end = start.clone();
          end.setAttribute('top', _getHeight(element)/2);
          //end.setAttribute('height', 0);

          var a = new Animator(elementObj, start, end);
          a.setTypeOfAnimation('CollapseToMiddleHorizontalLine');
          var deltaKVMap = new KeyValueMap();
          deltaKVMap.put('top', getUnitValue(deltaUnit, 'top'));
          //deltaKVMap.put('height', 6);
          var speedKVMap = new KeyValueMap();
          speedKVMap.setDefault('default', getUnitValue(transitionDelay, 'top'));

          return new AnimatorWrapper(elementObj, a, deltaKVMap, speedKVMap, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing);
     };

     function CollapseToCenter(elementObj, deltaUnit, transitionDelay, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing)
     {
          var element = getAnimatableElement(elementObj);

          var start = new State();
          start.setAttribute('left', 0);
          start.setAttribute('top', 0);
          start.setAttribute('width', _getWidth(element));
          start.setAttribute('height', _getHeight(element));

          var end = start.clone();
          end.setAttribute('left', _getWidth(element)/2);
          end.setAttribute('top', _getHeight(element)/2);
          end.setAttribute('width', 0);
          end.setAttribute('height', 0);

          var a = new Animator(elementObj, start, end);
          a.setAnimateAttributesAsGroup(true);
          a.setTypeOfAnimation('CollapseToCenter');
          var deltaKVMap = new KeyValueMap();
          deltaKVMap.put('left', getUnitValue(deltaUnit, 'left'));
          deltaKVMap.put('top', getUnitValue(deltaUnit, 'top'));
          deltaKVMap.put('width', deltaKVMap.get('left') * 2);
          deltaKVMap.put('height', deltaKVMap.get('top') * 2);
          var speedKVMap = new KeyValueMap();
          speedKVMap.setDefault('left', 0);
          speedKVMap.setDefault('top', 0);
          speedKVMap.setDefault('width', 0);
          speedKVMap.setDefault('height', getUnitValue(transitionDelay, 'height'));

          return new AnimatorWrapper(elementObj, a, deltaKVMap, speedKVMap, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing);
     };

     function EmergeFromCenter(elementObj, deltaUnit, transitionDelay, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing)
     {
          var element = getAnimatableElement(elementObj);

          var start = new State();
          start.setAttribute('left', _getWidth(element)/2);
          start.setAttribute('top', _getHeight(element)/2);
          start.setAttribute('width', 0);
          start.setAttribute('height', 0);

          var end = start.clone();
          end.setAttribute('left', 0);
          end.setAttribute('top', 0);
          end.setAttribute('width', _getWidth(element));
          end.setAttribute('height', _getHeight(element));

          var a = new Animator(elementObj, start, end);
          a.setAnimateAttributesAsGroup(true);
          a.setTypeOfAnimation('EmergeFromCenter');
          var deltaKVMap = new KeyValueMap();
          deltaKVMap.put('left', getUnitValue(deltaUnit, 'left'));
          deltaKVMap.put('top', getUnitValue(deltaUnit, 'top'));
          deltaKVMap.put('width', deltaKVMap.get('left') * 2);
          deltaKVMap.put('height', deltaKVMap.get('top') * 2);
          var speedKVMap = new KeyValueMap();
          speedKVMap.setDefault('left', 0);
          speedKVMap.setDefault('top', 0);
          speedKVMap.setDefault('width', 0);
          speedKVMap.setDefault('height', getUnitValue(transitionDelay, 'height'));

          return new AnimatorWrapper(elementObj, a, deltaKVMap, speedKVMap, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing);
     };

     //private
     function _getWidth(elem)
     {
          if (!elem)
               return 0;
          if (_isImgElement(elem))
          {
               return elem.width;
          }
          return elem.offsetWidth;
     };

     //private
     function _getHeight(elem)
     {
          if (!elem)
               return 0;
          if (_isImgElement(elem))
          {
               return elem.height;
          }
          return elem.offsetHeight;
     };

     //private
     function _setWidth(elem, width)
     {
          if (!elem)
               return;
          if (_isImgElement(elem))
          {
               elem.width = width;
          }
          else
          {
               elem.style.width = width + "px";
          }
     };

     //private
     function _setHeight(elem, height)
     {
          if (!elem)
               return;
          if (_isImgElement(elem))
          {
               elem.height = height;
          }
          else
          {
               elem.style.height = height + "px";
          }
     };

     //private
     function _isImgElement(elem)
     {
          return elem instanceof Image || elem instanceof HTMLImageElement;
     };

     //private
     function _applyStateToSource(typeOfAnimationBeingPlayed, sourceObj, state, attribute, isAttributeTransitionComplete, animatorWrapper)
     {
          var source = getAnimatableElement(sourceObj);

          var _attrib = attribute;
          if (attribute == 'opacity')
          {
               source.style[_attrib] = state.getAttributeValue(attribute);
               source.style.filter = "'alpha(opacity=" + (state.getAttributeValue(attribute) * 100) + ")'";
          }
          else if ((attribute == 'left') || (attribute == 'right') || (attribute == 'top') || (attribute == 'bottom'))
          {
               _attrib = attribute == 'left'? 'left': 
                         attribute == 'right'? 'left': 
                         attribute == 'top'? 'top': 
                         attribute == 'bottom'? 'top': 'left';
               source.style[_attrib] = state.getAttributeValue(attribute) + "px";
               if (typeOfAnimationBeingPlayed == 'CollapseToMiddleVerticalLine')
               {
                    var horizontal_bw = 0;
                    if (!_isImgElement(source))
                    {
                         //we would do border width calculations only for non image elements as borders with image element doesn't distort the offsetWidth and offsetHeight calculations.
                         var sbw = GetBorderWidth(source);
                         horizontal_bw = sbw.left + sbw.right;
                         horizontal_bw = isNaN(horizontal_bw)? 0: horizontal_bw;
                    }
                    _setWidth(source, Math.max(_getWidth(source) - (animatorWrapper.deltaKVMap.get('left') * 2) - horizontal_bw, 0));
                    //_setWidth(source, Math.max(_getWidth(source) - 6, 0));
               }
               else if (typeOfAnimationBeingPlayed == 'CollapseToMiddleHorizontalLine')
               {
                    var vertical_bw = 0;
                    if (!_isImgElement(source))
                    {
                         //we would do border width calculations only for non image elements as borders with image element doesn't distort the offsetWidth and offsetHeight calculations.
                         var sbw = GetBorderWidth(source);
                         vertical_bw = sbw.top + sbw.bottom;
                         vertical_bw = isNaN(vertical_bw)? 0: vertical_bw;
                    }
                    _setHeight(source, Math.max(_getHeight(source) - (animatorWrapper.deltaKVMap.get('top') * 2) - vertical_bw, 0));
               }
          }
          else if (attribute == 'width')
               _setWidth(source, state.getAttributeValue(attribute));
          else if (attribute == 'height')
               _setHeight(source, state.getAttributeValue(attribute));
          else
               source.style[_attrib] = state.getAttributeValue(attribute) + "px";

          if (animatorWrapper.onApplyStateToSourceCallback_PostProcessing)
          {
               //primary state has already been applied to the animatable object. Invoke the post callback for any additional processing by client.
               animatorWrapper.onApplyStateToSourceCallback_PostProcessing.call(this, typeOfAnimationBeingPlayed, sourceObj, state, attribute, isAttributeTransitionComplete);
          }
     };

     //private
     function _onComplete(animatorWrapper)
     {
          var animator = animatorWrapper.animator;
          var element = getAnimatableElement(animatorWrapper.elementObj);
          var onCompleteClientCallback = animatorWrapper.onCompleteCallback;
          if (onCompleteClientCallback)
               onCompleteClientCallback.call(this, animator);
     };

     //private
     function _onStop(animatorWrapper, stateAtStop)
     {
          var animator = animatorWrapper.animator;
          var onStopClientCallback = animatorWrapper.onStopCallback;
          if (onStopClientCallback)
               onStopClientCallback.call(this, animator, stateAtStop);
     };

     return {
          //export any public methods and variables
          FadeTransition : FadeTransition,
          SlideTo  : SlideTo,
          CollapseToMiddleVerticalLine : CollapseToMiddleVerticalLine,
          CollapseToMiddleHorizontalLine : CollapseToMiddleHorizontalLine,
          CollapseToCenter : CollapseToCenter,
          EmergeFromCenter : EmergeFromCenter
     };

}());