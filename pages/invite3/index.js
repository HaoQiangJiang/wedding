const {
  shared,
  Easing,
  timing,
  delay
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
      this.imageY = shared(-50);
      this.imageOpacity = shared(0);
      this.topImageY = shared(-50);
      this.topBottomY = shared(50);
      this.topBottomOpacity = shared(0);
      this.bottomImageX = shared(-60)
      this.bottomImageOpacity = shared(0)
      this.bottomSvgY = shared(30);
      this.bottomSvgOpacity = shared(0);

      this.applyAnimatedStyle('.center-image', () => {
        'worklet';
        return {
          transform: `translateY(${this.imageY.value}px)`,
          opacity: this.imageOpacity.value,
        };
      });

      this.applyAnimatedStyle('.info-3', () => {
        'worklet';
        return {
          transform: `translateY(${this.topImageY.value}px)`,
          opacity: this.imageOpacity.value,
        };
      });

      this.applyAnimatedStyle('.top-bottom-container', () => {
        'worklet';
        return {
          transform: `translateY(${this.topBottomY.value}px)`,
          opacity: this.topBottomOpacity.value,
        };
      });
      this.applyAnimatedStyle('.bottom-image', () => {
        'worklet';
        return {
          transform: `translateX(${this.bottomImageX.value}px) `,
          opacity: this.bottomImageOpacity.value,
        };
      });

      this.applyAnimatedStyle('.bottom-svg', () => {
        'worklet';
        return {
          transform: `translateY(${this.bottomSvgY.value}px)`,
          opacity: this.bottomSvgOpacity.value,
        };
      });
    },

    startAnimation() {
      this.initAnimatedStyles();
      const startTime = 300;

      this.imageY.value = delay(startTime, timing(0, {
        duration: 1000,
        easing: Easing.ease
      }));
      this.imageOpacity.value = delay(startTime, timing(1, {
        duration: 1000,
        easing: Easing.ease
      }));

      this.topImageY.value = delay(startTime + 200, timing(0, {
        duration: 1000,
        easing: Easing.ease
      }));

      this.topBottomY.value = delay(startTime + 1000, timing(0, {
        duration: 1000,
        easing: Easing.ease
      }));
      this.topBottomOpacity.value = delay(startTime + 1000, timing(1, {
        duration: 1000,
        easing: Easing.ease
      }));

      this.bottomImageX.value = delay(startTime + 1300, timing(0, {
        duration: 1000,
        easing: Easing.bounce
      }));
      this.bottomImageOpacity.value = delay(startTime + 1300, timing(1, {
        duration: 1000,
        easing: Easing.ease
      }));


      this.bottomSvgY.value = delay(startTime + 1600, timing(0, {
        duration: 1000,
        easing: Easing.ease
      }));
      this.bottomSvgOpacity.value = delay(startTime + 1600, timing(1, {
        duration: 1000,
        easing: Easing.ease
      }));
    }
  }
});