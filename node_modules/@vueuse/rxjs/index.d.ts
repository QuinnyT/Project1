import { ObservableInput, Observable, NextObserver, BehaviorSubject, Subject, Unsubscribable } from 'rxjs';
import { Ref, WatchOptions } from 'vue-demi';
import { MaybeRef } from '@vueuse/shared';

declare function from<T>(value: ObservableInput<T> | Ref<T>, watchOptions?: WatchOptions): Observable<T>;
declare function fromEvent<T extends HTMLElement>(value: MaybeRef<T>, event: string): Observable<Event>;

declare function toObserver<T>(value: Ref<T>): NextObserver<T>;

interface UseObservableOptions<I> {
    onError?: (err: any) => void;
    /**
     * The value that should be set if the observable has not emitted.
     */
    initialValue?: I | undefined;
}
declare function useObservable<H, I = undefined>(observable: Observable<H>, options?: UseObservableOptions<I | undefined>): Readonly<Ref<H | I>>;

interface UseSubjectOptions<I = undefined> extends Omit<UseObservableOptions<I>, 'initialValue'> {
}
declare function useSubject<H>(subject: BehaviorSubject<H>, options?: UseSubjectOptions): Ref<H>;
declare function useSubject<H>(subject: Subject<H>, options?: UseSubjectOptions): Ref<H | undefined>;

declare function useSubscription(subscription: Unsubscribable): void;

export { UseObservableOptions, UseSubjectOptions, from, fromEvent, toObserver, useObservable, useSubject, useSubscription };
