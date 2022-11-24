# chaos-interceptor

<p align="center">chaos-interceptor inject random errors into your network layer.</p>

## Features

🌪 Randomize response <br>
⏱ Delay response

## Usage

### Basic Usage

##### Javascript Fetch 
Use chaosInterceptor to random raise error on network request

```ts
import {createChaosFetch} from '@domotz/chaos-interceptor';

window.fetch = createChaosFetch();
```

then

```ts
try {
  await fetch("http://api.github.com/");
} catch (error) {
  // may happen fetch errors with random
  console.log(error.status);
  console.log(error.statusText);
}
```

##### Apollo-Client 
You can specify the `fetch` to use in `HttpLink` configuration object. 

```ts
import {createChaosFetch} from '@domotz/chaos-interceptor';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const httpLink = new HttpLink({
   uri: '/graphql',
   fetch: createChaosFetch(simulatedErrors, {logError: true}),
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
});
```

##### Axios Fetch 
Use chaosInterceptor

```ts
import {createChaosInterceptor} from '@domotz/chaos-interceptor';

const client = axios.create();
const chaosInterceptor = createChaosInterceptor();
client.interceptors.response.use(chaosInterceptor);
```

then

```ts
try {
  await axios.get("http://api.github.com/");
} catch (error) {
  // may happen AxiosError with random
  console.log(error.status);
  console.log(error.data);
}
```

##### Possible outputs

Possible `error.status` is one of following

- 429
- 500
- 502
- 503
- 504

Possible `error.statusText` is one of following

- "Too Many Requests"
- "Internal Server Error"
- "Bad Gateway"
- "Service Unavailable"
- "Gateway Timeout"

### Params

Specify the response that will result in an error

```ts
const chaosFetch = createChaosFetch([
  {
    status: 500,
    body: {
      message: "Internal Server Error",
    },
    delay: 500, // delay response (ms)
    rate: 10, // possibilities (%)
  },
  {
    status: 504,
    body: {
      message: "Gateway Timeout",
    },
    delay: 100000,
    rate: 20,
  },
]);
```

Possible `error.status` is one of following

- 500
- 504

Possible `error.statusText` is one of following

- `{ message: "Internal Server Error" }`
- `{ message: "Gateway Timeout" }`


With `{showError: true}` it console.log a message everytime a response is rejected
