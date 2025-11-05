import type { BaseApi } from './base';

const apiInstances = new WeakMap<new (...args: any[]) => any, Map<string, BaseApi>>();

export function createUseApiFunction<T extends BaseApi, C extends new (...args: any[]) => T>(apiClass: C) {
    return (...args: ConstructorParameters<C>) => {
        let cache = apiInstances.get(apiClass);
        if (!cache) apiInstances.set(apiClass, cache = new Map());
        const key = JSON.stringify(args);
        let instance = cache.get(key);
        // eslint-disable-next-line new-cap
        if (!instance) cache.set(key, instance = new apiClass(...args));
        return instance as InstanceType<C>;
    };
}
