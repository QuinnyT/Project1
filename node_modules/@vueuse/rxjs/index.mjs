import { Observable, from as from$1, fromEvent as fromEvent$1, BehaviorSubject } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { isRef, watch, ref } from 'vue-demi';
import { tryOnScopeDispose } from '@vueuse/shared';

function from(value, watchOptions) {
  if (isRef(value)) {
    return new Observable((subscriber) => {
      const watchStopHandle = watch(value, (val) => subscriber.next(val), watchOptions);
      return () => {
        watchStopHandle();
      };
    });
  } else {
    return from$1(value);
  }
}
function fromEvent(value, event) {
  if (isRef(value)) {
    return from(value, { immediate: true }).pipe(filter((value2) => value2 instanceof HTMLElement), mergeMap((value2) => fromEvent$1(value2, event)));
  }
  return fromEvent$1(value, event);
}

function toObserver(value) {
  return {
    next: (val) => {
      value.value = val;
    }
  };
}

function useObservable(observable, options) {
  const value = ref(options == null ? void 0 : options.initialValue);
  const subscription = observable.subscribe({
    next: (val) => value.value = val,
    error: options == null ? void 0 : options.onError
  });
  tryOnScopeDispose(() => {
    subscription.unsubscribe();
  });
  return value;
}

function useSubject(subject, options) {
  const value = ref(subject instanceof BehaviorSubject ? subject.value : void 0);
  const subscription = subject.subscribe({
    next(val) {
      value.value = val;
    },
    error: options == null ? void 0 : options.onError
  });
  watch(value, (nextValue) => {
    subject.next(nextValue);
  });
  tryOnScopeDispose(() => {
    subscription.unsubscribe();
  });
  return value;
}

function useSubscription(subscription) {
  tryOnScopeDispose(() => {
    subscription.unsubscribe();
  });
}

export { from, fromEvent, toObserver, useObservable, useSubject, useSubscription };
