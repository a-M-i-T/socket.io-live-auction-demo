  //knob
  $(".knob").knob({
      'displayInput': true,
      'stopper':0,
      'min':0,
      change : function (value) {
          //console.log("change : " + value);
      },

      release : function (value) {
          //console.log(this.$.attr('value'));
          //console.log("release : " + value);
      },
  
      draw : function () {

          this.i.css('font-size', '15px')
          // "tron" case
          if(this.$.data('skin') == 'tron') {
              this.cursorExt = 0.3;

              var a = this.arc(this.cv)  // Arc
                  , pa                   // Previous arc
                  , r = 1;

              this.g.lineWidth = this.lineWidth;

              if (this.o.displayPrevious) {
                  pa = this.arc(this.v);
                  this.g.beginPath();
                  this.g.strokeStyle = this.pColor;
                  this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, pa.s, pa.e, pa.d);
                  this.g.stroke();
              }

              this.g.beginPath();
              this.g.strokeStyle = r ? this.o.fgColor : this.fgColor ;
              this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, a.s, a.e, a.d);
              this.g.stroke();

              this.g.lineWidth = 2;
              this.g.beginPath();
              this.g.strokeStyle = this.o.fgColor;
              this.g.arc( this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
              this.g.stroke();

              return false;
          }
      }
  });