# experiment-react-native-client

Official Amplitude Experiment React Native Client

## Installation

```sh
npm install @amplitude/experiment-react-native-client
```

## Usage

```js
import { Experiment } from "@amplitude/experiment-react-native-client";

// ...

await Experiment.initialize('API-Key');
await Experiment.fetch({user_id: 'user_id'});
const variant = await Experiment.variant('react-native');
console.log(variant.value);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
