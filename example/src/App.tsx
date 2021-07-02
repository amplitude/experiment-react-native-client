import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { Amplitude } from '@amplitude/react-native';
import {
  Experiment,
  Source,
  Variant,
  Variants,
} from '@amplitude/experiment-react-native-client';

export default function App() {
  const [variant, setVariant] = React.useState<Variant | undefined>();
  const [fallbackResult, setFallbackResult] = React.useState<
    Variant | undefined
  >();
  const [variantFallbackResult, setVariantFallbackResult] = React.useState<
    Variant | undefined
  >();
  const [
    variantWithPayloadResult,
    setVariantWithPayloadResult,
  ] = React.useState<Variant | undefined>();
  const [allVariants, setAllVariants] = React.useState<Variants | undefined>();
  React.useEffect(() => {
    (async () => {
      if (Amplitude) {
        const amplitude = Amplitude.getInstance();
        amplitude.init('a6dd847b9d2f03c816d4f3f8458cdc1d');
      }
      if (Experiment) {
        await Experiment.initialize('client-IAxMYws9vVQESrrK88aTcToyqMxiiJoR', {
          debug: true,
          fallbackVariant: { value: 'defaultFallback' },
          source: Source.InitialVariants,
          initialVariants: {
            'flag-does-not-exist': {
              value: 'asdf',
            },
          },
        });
        await Experiment.setAmplitudeUserProvider();
        await Experiment.fetch({ user_properties: { test: '1' } });
        setVariant(await Experiment.variant('react-native'));
        setFallbackResult(await Experiment.variant('flag-does-not-exist'));
        setVariantFallbackResult(
          await Experiment.variant('flag-does-not-exist', {
            value: 'fallback',
            payload: {
              list: [1, 2],
              map: { key: 'value' },
              boolean: true,
              int: 1,
              number: 2.2,
              string: 'string',
            },
          })
        );
        setVariantWithPayloadResult(await Experiment.variant('android-demo'));
        setAllVariants(await Experiment.all());
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>react-native: {JSON.stringify(variant)}</Text>
      <Text style={styles.text}>
        'flag-does-not-exist' with no fallback: {JSON.stringify(fallbackResult)}
      </Text>
      <Text style={styles.text}>
        'flag-does-not-exist' with variant fallback:{' '}
        {JSON.stringify(variantFallbackResult)}
      </Text>
      <Text style={styles.text}>
        variant-with-payload: {JSON.stringify(variantWithPayloadResult)}
      </Text>
      <Text style={styles.text}>
        all variants: {JSON.stringify(allVariants)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  text: {
    marginVertical: 20,
  },
});
