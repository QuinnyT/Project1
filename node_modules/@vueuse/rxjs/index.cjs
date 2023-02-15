'use strict';

var rxjs = require('rxjs');
var operators = require('rxjs/operators');
var vueDemi = require('vue-demi');
var shared = require('@vueuse/shared');

function from(value, watchOptions) {
  if (vueDemi.isRef(value)) {
    return new rxjs.Observable((subscriber) => {
      const watchStopHandle = vueDemi.watch(value, (val) => subscriber.next(val), watchOptions);
      return () => {
        watchStopHandle();
      };
    });
  } else {
    return rxjs.from(value);
  }
}
function fromEvent(value, event) {
  if (vueDemi.isRef(value)) {
    return from(value, { immediate: true }).pipe(operators.filter((value2) => value2 instanceof HTMLElement), operators.mergeMap((value2) => rxjs.fromEvent(value2, event)));
  }
  return rxjs.fromEvent(value, event);
}

function toObserver(value) {
  return {
    next: (val) => {
      value.value = val;
    }
  };
}

function useObservable(observable, options) {
  const value = vueDemi.ref(options == null ? void 0 : options.initialValue);
  const subscription = observable.subscribe({
    next: (val) => value.value = val,
    error: options == null ? void 0 : options.onError
  });
  shared.tryOnScopeDispose(() => {
    subscription.unsubscribe();
  });
  return value;
}

function useSubject(subject, options) {
  const value = vueDemi.ref(subject instanceof rxjs.BehaviorSubject ? subject.value : void 0);
  const subscription = subject.subscribe({
    next(val) {
      value.value = val;
    },
    error: options == null ? void 0 : options.onError
  });
  vueDemi.watch(value, (nextValue) => {
    subject.next(nextValue);
  });
  shared.tryOnScopeDispose(() => {
    subscription.unsubscribe();
  });
  return value;
}

function useSubscription(subscription) {
  shared.tryOnScopeDispose(() => {
    subscription.unsubscribe();
  });
}

exports.from = from;
exports.fromEvent = fromEvent;
exports.toObserver = toObserver;
exports.useObservable = useObservable;
exports.useSubject = useSubject;
exports.useSubscription = useSubscription;
