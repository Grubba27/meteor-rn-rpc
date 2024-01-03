import Meteor from '@meteorrn/core';

const createProxyClient = <T>(
  path: string[] = []
) => {
  const proxy = new Proxy(() => {}, {
    get(_, key: string) {
      if (typeof key !== "string" || key === "then" || key === "toJSON") {
        // special case for if the proxy is accidentally treated
        // like a PromiseLike (like in `Promise.resolve(proxy)`)
        return undefined;
      }
      return createProxyClient([...path, key]);
    },
    apply(_1, _2, args) {
      const lastArg = path.at(-1);
      if (lastArg === "useQuery" || lastArg === "useMutation") {
        path = path.slice(0, -1);
      }

      const name = path.join(".");

      function call(...params) {
        return new Promise((resolve, reject) => {
          Meteor.call(name, ...params, (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          });
        })
      }


      // if (lastArg === "useQuery") {
      //   return useSuspenseQuery({
      //     queryKey: [name, ...args],
      //     queryFn: () => call(...args),
      //   });
      // }

      // if (lastArg === "useMutation") {
      //   return useMutationRQ({
      //     mutationFn: (params) => call(params),
      //   });
      // }

      return call(...args);
    },
  }) as unknown as T;

  return proxy;
};

// @ts-ignore
export const createClient = <T>() => createProxyClient<T>() as T;
