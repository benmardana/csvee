import { Position, OverlayToaster, ToastProps } from '@blueprintjs/core';

const AppToaster = OverlayToaster.create({
  className: 'app-toaster',
  position: Position.TOP,
  maxToasts: 5,
});

// eslint-disable-next-line import/prefer-default-export
export default {
  showToast: (toastProps: ToastProps) => {
    // create toasts in response to interactions.
    // in most cases, it's enough to simply create and forget (thanks to timeout).
    AppToaster.show(toastProps);
  },
};
