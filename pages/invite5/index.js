const {
  shared,
  Easing,
  timing,
  delay,
  repeat
} = wx.worklet;

Component({
  properties: {
    active: {
      type: Boolean,
      value: false,
    }
  },
  lifetimes: {
    attached() {
      // this.resetAnimation()
    }
  },

  data: {},

  methods: {
    resetAnimation() {
      this.initAnimatedStyles()
    },
    initAnimatedStyles() {
      this.image1X = shared(-50);
      this.image1Rz = shared(-15);
      this.image1Opacity = shared(0);
      this.image2X = shared(100);
      this.image2Rz = shared(15);
      this.image2Opacity = shared(0);

      this.marryBgX = shared(-50)
      this.marryOpacity = shared(0)

      this.text1Y = shared(30)
      this.text1Opacity = shared(0)
      this.text2Y = shared(30)
      this.text2Opacity = shared(0)
      this.text3Y = shared(30)
      this.text3Opacity = shared(0)

      this.text4Y = shared(30)
      this.text4Opacity = shared(0)

      this.text5Y = shared(30)
      this.text5Opacity = shared(0)

      this.applyAnimatedStyle('.top-5-left-image', () => {
        'worklet';
        return {
          transform: `translateX(${this.image1X.value}px) rotateZ(${this.image1Rz.value}deg)  `,
          opacity: this.image1Opacity.value,
        };
      });

      this.applyAnimatedStyle('.top-5-right-image', () => {
        'worklet';
        return {
          transform: `translateX(${this.image2X.value}px) rotateZ(${this.image2Rz.value}deg) `,
          opacity: this.image2Opacity.value,
        };
      });
      this.applyAnimatedStyle('.bottom-marry-me-bg ', () => {
        'worklet';
        return {
          transform: `translateX(${this.marryBgX.value}px) `,
          opacity: this.marryOpacity.value,
        };
      });

      this.applyAnimatedStyle('.text1', () => {
        'worklet';
        return {
          transform: `translateY(${this.text1Y.value}px) `,
          opacity: this.text1Opacity.value,
        };
      });
      this.applyAnimatedStyle('.text2', () => {
        'worklet';
        return {
          transform: `translateY(${this.text2Y.value}px) `,
          opacity: this.text2Opacity.value,
        };
      });
      this.applyAnimatedStyle('.text3', () => {
        'worklet';
        return {
          transform: `translateY(${this.text3Y.value}px) `,
          opacity: this.text3Opacity.value,
        };
      });
      this.applyAnimatedStyle('.text4', () => {
        'worklet';
        return {
          transform: `translateY(${this.text4Y.value}px) `,
          opacity: this.text4Opacity.value,
        };
      });
      this.applyAnimatedStyle('.text5', () => {
        'worklet';
        return {
          transform: `translateY(${this.text5Y.value}px) `,
          opacity: this.text5Opacity.value,
        };
      });

    },

    startAnimation() {
      this.initAnimatedStyles();
      const startTime = 300;

      this.image1X.value = delay(startTime, timing(0, {
        duration: 1000,
        easing: Easing.ease
      }));
      this.image1Rz.value = delay(startTime, timing(0, {
        duration: 1000,
        easing: Easing.ease
      }));
      this.image1Opacity.value = delay(startTime, timing(1, {
        duration: 1000,
        easing: Easing.ease
      }));

      this.image2X.value = delay(startTime + 300, timing(0, {
        duration: 1000,
        easing: Easing.ease
      }));
      this.image2Rz.value = delay(startTime + 300, timing(0, {
        duration: 1000,
        easing: Easing.ease
      }));
      this.image2Opacity.value = delay(startTime + 300, timing(1, {
        duration: 1000,
        easing: Easing.ease
      }));

      this.marryBgX.value = delay(startTime + 1500, timing(0, {
        duration: 1000,
        easing: Easing.ease
      }));
      this.marryOpacity.value = delay(startTime + 1500, timing(1, {
        duration: 1000,
        easing: Easing.ease
      }));



      this.text1Y.value = delay(startTime + 500, timing(0, {
        duration: 1000,
        easing: Easing.ease
      }));
      this.text1Opacity.value = delay(startTime + 500, timing(1, {
        duration: 1000,
        easing: Easing.ease
      }));

      this.text2Y.value = delay(startTime + 700, timing(0, {
        duration: 1000,
        easing: Easing.ease
      }));
      this.text2Opacity.value = delay(startTime + 700, timing(1, {
        duration: 1000,
        easing: Easing.ease
      }));


      this.text3Y.value = delay(startTime + 900, timing(0, {
        duration: 1000,
        easing: Easing.ease
      }));
      this.text3Opacity.value = delay(startTime + 900, timing(1, {
        duration: 1000,
        easing: Easing.ease
      }));

      this.text4Y.value = delay(startTime + 1100, timing(0, {
        duration: 1000,
        easing: Easing.ease
      }));
      this.text4Opacity.value = delay(startTime + 1100, timing(1, {
        duration: 1000,
        easing: Easing.ease
      }));

      this.text5Y.value = delay(startTime + 1300, timing(0, {
        duration: 1000,
        easing: Easing.ease
      }));
      this.text5Opacity.value = delay(startTime + 1300, timing(1, {
        duration: 1000,
        easing: Easing.ease
      }));
    }
  }
});